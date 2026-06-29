import { test, expect } from '@playwright/test';

test('User can login', async ({ page }) => {
    // Navigate to your Vercel frontend
    await page.goto('https://asset-management-lovat-one.vercel.app/');

    // Fill in username (using placeholder selector)
    await page.fill('input[placeholder="Username"]', 'admin');

    // Fill in password
    await page.fill('input[placeholder="Password"]', 'password123');

    // Click Login button
    await page.click('button:has-text("Login")');

    // Wait for navigation (it should redirect based on role)
    await page.waitForNavigation();

    // Check if login was successful by verifying we're not on login page anymore
    const url = page.url();
    expect(url).not.toContain('/login');
});