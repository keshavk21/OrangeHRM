import { test, expect } from '@playwright/test';

test.describe('OrangeHRM Logout', () => {
  const baseURL = 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login';
  const username = 'Admin';
  const password = 'admin123';

  test('Login, logout, and verify login page', async ({ page }) => {
    // Step 1: Navigate to login page
    await page.goto(baseURL);

    // Step 2: Login with username and password
    await page.locator('input[placeholder="Username"]').fill(username);
    await page.locator('input[placeholder="Password"]').fill(password);
    await page.locator('button:has-text("Login")').click();

    // Wait for dashboard to load after login
    await page.waitForURL('**/dashboard/index');

    // Step 3: Click on the user profile icon in the top-right corner
    await page.locator('.oxd-userdropdown-img').click();

    // Step 4: Click on "Logout"
    await page.locator('a:has-text("Logout")').click();

    // Step 5: Verify that the login page is displayed
    await page.waitForURL('**/auth/login');
    await expect(page).toHaveURL(/.*\/auth\/login/);

    // Step 6: Verify that the page contains "Username" field
    await expect(page.locator('input[placeholder="Username"]')).toBeVisible();
    
    // Additional verification: Check for "Username" label text
    await expect(page.locator('label:has-text("Username")')).toBeVisible();
  });
});
