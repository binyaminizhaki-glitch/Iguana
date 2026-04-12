# Run Playwright Visual Tests
# Requires: Node.js and npm

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Playwright Visual Tests Runner" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Install Playwright browsers
Write-Host "[1/2] Installing Playwright Chromium browser..." -ForegroundColor Yellow
try {
    & npx playwright install chromium
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to install Playwright browsers"
    }
    Write-Host "✓ Browsers installed successfully" -ForegroundColor Green
} catch {
    Write-Host "✗ Error installing browsers: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Step 2: Run visual tests
Write-Host "[2/2] Running visual tests with baseline update..." -ForegroundColor Yellow
try {
    & npm run test:visual:update
    if ($LASTEXITCODE -ne 0) {
        throw "Tests failed or encountered errors"
    }
    Write-Host "✓ Visual tests completed successfully" -ForegroundColor Green
} catch {
    Write-Host "✗ Error running tests: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "All done! Check playwright-report/ for results" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan
