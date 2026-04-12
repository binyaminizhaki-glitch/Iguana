# Playwright Visual Testing Guide

## Playwright Visual Testing Guide

### Quick Start - 3 Ways to Run:

**Option 1: Node.js Script (Works Everywhere)**
```bash
npm run test:visual:run
```

**Option 2: Direct Commands**
```bash
npx playwright install chromium
npm run test:visual:update
```

**Option 3: Windows Batch File**
Double-click: `run-visual-tests.bat`

Or PowerShell:
```powershell
.\scripts\Run-VisualTests.ps1
```

### What Gets Tested

The visual tests in `visual.spec.ts` check:

1. **Homepage Load** - Full page screenshot
2. **Viewport Content** - Visible content screenshot
3. **Mobile Responsive** (375x667) - iPhone SE size
4. **Tablet Responsive** (768x1024) - iPad size  
5. **Desktop Responsive** (1920x1080) - Full HD
6. **Interactive Elements** - Buttons and links visibility
7. **Theme Toggle** - If theme switcher exists
8. **Focus States** - Keyboard navigation visibility

## Screenshot Storage

- Baseline screenshots: `visual.spec.ts-snapshots/`
- Test results: `playwright-report/`
- Failed test diffs: `test-results/`

## Manual Execution

If you prefer to run manually, execute:

```bash
# 1. Make sure the app is built (if needed)
npm run build

# 2. Run Playwright tests (will start dev server automatically)
npx playwright test

# 3. View HTML report
npx playwright show-report
```

## Quick Start Script

On Windows, you can double-click `run-visual-tests.bat` to:
1. Install browsers
2. Run visual tests with baseline update
3. View results

## Troubleshooting

**Issue:** Tests fail with "Target page, context or browser has been closed"
- **Solution:** Run `npm run dev` in another terminal first, then run tests

**Issue:** Screenshots don't match
- **Solution:** Run `npm run test:visual:update` to update baselines

**Issue:** Browsers not installed
- **Solution:** Run `npx playwright install`
