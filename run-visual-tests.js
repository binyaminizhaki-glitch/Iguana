#!/usr/bin/env node
/**
 * Run Playwright Visual Tests
 * This script works cross-platform and doesn't require PowerShell 6+
 */

const { execSync } = require('child_process');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  red: '\x1b[31m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function run(command, description) {
  log(`\n${description}`, 'yellow');
  try {
    execSync(command, { stdio: 'inherit', cwd: __dirname });
    log(`✓ ${description} - Success`, 'green');
    return true;
  } catch (error) {
    log(`✗ ${description} - Failed`, 'red');
    return false;
  }
}

log('=====================================', 'cyan');
log('Playwright Visual Tests Runner', 'cyan');
log('=====================================', 'cyan');

// Step 1: Install browsers
if (!run('npx playwright install chromium', '[1/2] Installing Playwright browsers')) {
  log('\nFailed to install browsers. Exiting.', 'red');
  process.exit(1);
}

// Step 2: Run tests
if (!run('npm run test:visual:update', '[2/2] Running visual tests')) {
  log('\nTests failed. Check output above for details.', 'red');
  process.exit(1);
}

log('\n=====================================', 'cyan');
log('All done! Check playwright-report/ for results', 'green');
log('=====================================', 'cyan');
