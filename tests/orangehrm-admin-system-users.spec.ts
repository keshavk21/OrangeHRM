import { test, expect } from '@playwright/test';

test.describe('OrangeHRM Admin - System Users', () => {
  const baseURL = 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login';
  const username = 'Admin';
  const password = 'admin123';

  test('Login and verify Admin System Users page', async ({ page }) => {
    // Step 1: Navigate to login page
    await page.goto(baseURL);

    // Step 2: Login with username and password
    await page.locator('input[placeholder="Username"]').fill(username);
    await page.locator('input[placeholder="Password"]').fill(password);
    await page.locator('button:has-text("Login")').click();

    // Wait for dashboard to load after login
    await page.waitForURL('**/dashboard/index');

    // Step 3: Click on "Admin" tab in the left navigation
    await page.locator('a:has-text("Admin")').click();

    // Wait for Admin page to load
    await page.waitForURL('**/admin/viewSystemUsers');

    // Step 4: Verify the page contains "System Users"
    await expect(page.locator('text=System Users')).toBeVisible();

    // Step 5: Verify that the "Add" button is visible
    await expect(page.locator('button:has-text("Add")')).toBeVisible();
  });
});
