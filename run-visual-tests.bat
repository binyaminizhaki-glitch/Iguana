@echo off
echo =====================================
echo Playwright Visual Tests Runner
echo =====================================
echo.

echo [1/2] Installing Playwright browsers...
call npx playwright install chromium
if errorlevel 1 (
    echo Error installing browsers!
    pause
    exit /b 1
)
echo Success: Browsers installed
echo.

echo [2/2] Running visual tests...
call npm run test:visual:update
if errorlevel 1 (
    echo Error running tests!
    pause
    exit /b 1
)
echo.

echo =====================================
echo Visual tests complete!
echo Check playwright-report/ for results
echo =====================================
pause
