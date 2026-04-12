import { test, expect } from '@playwright/test';

test.describe('Visual Application Tests', () => {
  test('homepage loads and displays correctly', async ({ page }) => {
    await page.goto('/');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Take a screenshot of the homepage
    await expect(page).toHaveScreenshot('homepage.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('homepage has visible header/navigation', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check if the page has loaded content
    const body = await page.locator('body');
    await expect(body).toBeVisible();
    
    // Take screenshot of the visible viewport
    await expect(page).toHaveScreenshot('viewport.png', {
      animations: 'disabled',
    });
  });

  test('responsive design - mobile view', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('mobile-view.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('responsive design - tablet view', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('tablet-view.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('responsive design - desktop view', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('desktop-view.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('interactive elements are visible', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Find all buttons and links
    const buttons = await page.locator('button').count();
    const links = await page.locator('a').count();
    
    console.log(`Found ${buttons} buttons and ${links} links`);
    
    // Take screenshot highlighting interactive elements
    await expect(page).toHaveScreenshot('interactive-elements.png', {
      animations: 'disabled',
    });
  });

  test('dark mode or theme variations', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Try to find and click theme toggle if it exists
    const themeToggle = page.locator('button:has-text("theme"), button[aria-label*="theme"], button[title*="theme"]').first();
    
    if (await themeToggle.count() > 0) {
      await themeToggle.click();
      await page.waitForTimeout(500);
      
      await expect(page).toHaveScreenshot('theme-toggled.png', {
        fullPage: true,
        animations: 'disabled',
      });
    }
  });

  test('check focus states on interactive elements', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Find first focusable element
    const firstButton = page.locator('button, a, input').first();
    
    if (await firstButton.count() > 0) {
      await firstButton.focus();
      await page.waitForTimeout(200);
      
      await expect(page).toHaveScreenshot('focus-state.png', {
        animations: 'disabled',
      });
    }
  });
});
