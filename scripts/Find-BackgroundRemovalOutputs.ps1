[CmdletBinding()]
param(
    [Parameter(Mandatory = $false)]
    [string]$SearchRoot = "$env:USERPROFILE"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

if (-not (Test-Path -LiteralPath $SearchRoot -PathType Container)) {
    throw "[FindOutputs] Search root not found: $SearchRoot"
}

$matches = Get-ChildItem -Path $SearchRoot -File -Recurse -ErrorAction SilentlyContinue |
    Where-Object { $_.Name -like "*_bg_removed.mov" -or $_.Name -like "*_bg_removed_2x.mov" } |
    Sort-Object FullName

if (-not $matches) {
    Write-Host "No output files found under: $SearchRoot" -ForegroundColor Yellow
    exit 0
}

Write-Host "Found output files:" -ForegroundColor Cyan
$matches | Select-Object -ExpandProperty FullName
