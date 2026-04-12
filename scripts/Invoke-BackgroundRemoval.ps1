[CmdletBinding()]
param(
    [Parameter(Mandatory = $false)]
    [string]$InputVideo,

    [Parameter(Mandatory = $false)]
    [string]$InputFolder,

    [Parameter(Mandatory = $false)]
    [string]$OutputFolder = "",

    [Parameter(Mandatory = $false)]
    [double]$SpeedFactor = 2.0,

    [Parameter(Mandatory = $false)]
    [ValidateSet("u2net", "u2netp", "u2net_human_seg")]
    [string]$Model = "u2net",

    [Parameter(Mandatory = $false)]
    [string]$WorkDir = "$PSScriptRoot\..\tools",

    [Parameter(Mandatory = $false)]
    [string]$RepoUrl = "https://github.com/nadermx/backgroundremover"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Throw-Friendly([string]$Message) {
    throw "[BackgroundRemoval] $Message"
}

function Test-RequiredTool([string]$ToolName) {
    $cmd = Get-Command $ToolName -ErrorAction SilentlyContinue
    if (-not $cmd) {
        Throw-Friendly "Missing required tool: '$ToolName'. Install it and run again."
    }
    return $cmd.Source
}

function Resolve-OutputFolder([string]$DesiredOutputFolder, [string]$FallbackFolder) {
    if ([string]::IsNullOrWhiteSpace($DesiredOutputFolder)) {
        return $FallbackFolder
    }
    return $DesiredOutputFolder
}

function Get-InputVideos([string]$SingleVideo, [string]$Folder) {
    $videos = @()
    if (-not [string]::IsNullOrWhiteSpace($SingleVideo)) {
        if (-not (Test-Path -LiteralPath $SingleVideo -PathType Leaf)) {
            Throw-Friendly "InputVideo not found: $SingleVideo"
        }
        $videos += (Resolve-Path -LiteralPath $SingleVideo).Path
    }

    if (-not [string]::IsNullOrWhiteSpace($Folder)) {
        if (-not (Test-Path -LiteralPath $Folder -PathType Container)) {
            Throw-Friendly "InputFolder not found: $Folder"
        }
        $supported = @("*.mp4", "*.mov", "*.webm", "*.ogg", "*.gif")
        $folderVideos = @()
        foreach ($pattern in $supported) {
            $folderVideos += Get-ChildItem -LiteralPath $Folder -Filter $pattern -File -ErrorAction SilentlyContinue
        }
        $folderVideos = $folderVideos | Sort-Object FullName -Unique
        if (-not $folderVideos -or $folderVideos.Count -eq 0) {
            Throw-Friendly "InputFolder is empty (no supported video files): $Folder"
        }
        $videos += ($folderVideos | ForEach-Object { $_.FullName })
    }

    if (-not $videos -or $videos.Count -eq 0) {
        Throw-Friendly "Provide at least one source via -InputVideo or -InputFolder."
    }

    return ($videos | Sort-Object -Unique)
}

function Invoke-Step([string]$FilePath, [string[]]$Arguments, [string]$ErrorHint) {
    & $FilePath @Arguments
    if ($LASTEXITCODE -ne 0) {
        Throw-Friendly "$ErrorHint (exit code: $LASTEXITCODE)"
    }
}

Write-Host "== BackgroundRemover automation start ==" -ForegroundColor Cyan

$gitPath = Test-RequiredTool "git"
$pythonPath = Test-RequiredTool "python"
$ffmpegPath = Test-RequiredTool "ffmpeg"

if ($SpeedFactor -le 0) {
    Throw-Friendly "SpeedFactor must be greater than 0."
}

$inputVideos = Get-InputVideos -SingleVideo $InputVideo -Folder $InputFolder

if (-not (Test-Path -LiteralPath $WorkDir -PathType Container)) {
    New-Item -ItemType Directory -Path $WorkDir -Force | Out-Null
}
$workDirResolved = (Resolve-Path -LiteralPath $WorkDir).Path
    $repoDir = Join-Path $workDirResolved "backgroundremover"

if (-not (Test-Path -LiteralPath $repoDir -PathType Container)) {
    Write-Host "Cloning repository..." -ForegroundColor Yellow
    Invoke-Step -FilePath $gitPath -Arguments @("clone", $RepoUrl, $repoDir) -ErrorHint "git clone failed"
}
else {
    Write-Host "Repository exists. Pulling latest..." -ForegroundColor Yellow
    Invoke-Step -FilePath $gitPath -Arguments @("-C", $repoDir, "pull", "--ff-only") -ErrorHint "git pull failed"
}

$venvDir = Join-Path $repoDir ".venv"
if (-not (Test-Path -LiteralPath $venvDir -PathType Container)) {
    Write-Host "Creating virtual environment..." -ForegroundColor Yellow
    Invoke-Step -FilePath $pythonPath -Arguments @("-m", "venv", $venvDir) -ErrorHint "venv creation failed"
}

$venvPython = Join-Path $venvDir "Scripts\python.exe"
if (-not (Test-Path -LiteralPath $venvPython -PathType Leaf)) {
    Throw-Friendly "Venv python not found: $venvPython"
}

Write-Host "Installing dependencies..." -ForegroundColor Yellow
Invoke-Step -FilePath $venvPython -Arguments @("-m", "pip", "install", "--upgrade", "pip", "setuptools", "wheel") -ErrorHint "pip upgrade failed"

$cudaDetected = $false
if (Get-Command "nvidia-smi" -ErrorAction SilentlyContinue) {
    $cudaDetected = $true
}

if ($cudaDetected) {
    Write-Host "CUDA-capable GPU detected. Trying CUDA torch install..." -ForegroundColor Yellow
    & $venvPython -m pip install torch torchvision --index-url https://download.pytorch.org/whl/cu121
    if ($LASTEXITCODE -ne 0) {
        Write-Host "CUDA torch install failed, falling back to CPU wheels..." -ForegroundColor Yellow
        Invoke-Step -FilePath $venvPython -Arguments @("-m", "pip", "install", "torch", "torchvision", "--index-url", "https://download.pytorch.org/whl/cpu") -ErrorHint "CPU torch install failed"
    }
}
else {
    Write-Host "No CUDA detected. Installing CPU torch/torchvision..." -ForegroundColor Yellow
    Invoke-Step -FilePath $venvPython -Arguments @("-m", "pip", "install", "torch", "torchvision", "--index-url", "https://download.pytorch.org/whl/cpu") -ErrorHint "CPU torch install failed"
}

$requirementsPath = Join-Path $repoDir "requirements.txt"
if (Test-Path -LiteralPath $requirementsPath -PathType Leaf) {
    Invoke-Step -FilePath $venvPython -Arguments @("-m", "pip", "install", "-r", $requirementsPath) -ErrorHint "requirements installation failed"
}
Invoke-Step -FilePath $venvPython -Arguments @("-m", "pip", "install", "-e", $repoDir) -ErrorHint "backgroundremover package install failed"

$results = @()
foreach ($videoPath in $inputVideos) {
    $videoItem = Get-Item -LiteralPath $videoPath
    $baseName = [System.IO.Path]::GetFileNameWithoutExtension($videoItem.Name)
    $outputDir = Resolve-OutputFolder -DesiredOutputFolder $OutputFolder -FallbackFolder $videoItem.DirectoryName

    if (-not (Test-Path -LiteralPath $outputDir -PathType Container)) {
        New-Item -ItemType Directory -Path $outputDir -Force | Out-Null
    }

    $bgRemoved = Join-Path $outputDir ("{0}_bg_removed.mov" -f $baseName)
    $bgRemoved2x = Join-Path $outputDir ("{0}_bg_removed_2x.mov" -f $baseName)

    Write-Host "Removing background: $($videoItem.FullName)" -ForegroundColor Green
    Invoke-Step -FilePath $venvPython -Arguments @("-m", "backgroundremover.cmd.cli", "-i", $videoItem.FullName, "-tv", "-m", $Model, "-o", $bgRemoved) -ErrorHint "background removal failed for $($videoItem.FullName)"

    if (-not (Test-Path -LiteralPath $bgRemoved -PathType Leaf)) {
        Throw-Friendly "Expected output not created: $bgRemoved"
    }

    Write-Host "Creating speed-adjusted output x$SpeedFactor ..." -ForegroundColor Green
    Invoke-Step -FilePath $ffmpegPath -Arguments @("-y", "-i", $bgRemoved, "-filter:v", "setpts=PTS/$SpeedFactor", "-c:v", "prores_ks", "-profile:v", "4", "-pix_fmt", "yuva444p10le", "-an", $bgRemoved2x) -ErrorHint "ffmpeg speed conversion failed for $bgRemoved"

    if (-not (Test-Path -LiteralPath $bgRemoved2x -PathType Leaf)) {
        Throw-Friendly "Expected speed output not created: $bgRemoved2x"
    }

    $results += [PSCustomObject]@{
        Input        = $videoItem.FullName
        BgRemoved    = $bgRemoved
        BgRemoved2x  = $bgRemoved2x
    }
}

Write-Host ""
Write-Host "== Completed successfully ==" -ForegroundColor Cyan
$results | Format-Table -AutoSize
