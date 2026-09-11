import { test, expect } from '@playwright/test';

test.describe('OrangeHRM PIM - Employee Search', () => {
  const baseURL = 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login';

  test('Search employees by name', async ({ page }) => {
    // Navigate to login
    await page.goto(baseURL);

    // Login
    await page.getByPlaceholder('Username').fill('Admin');
    await page.getByPlaceholder('Password').fill('admin123');
    await page.getByRole('button', { name: 'Login' }).click();

    // Wait for dashboard
    await page.waitForURL('**/dashboard/index');

    // Navigate to PIM
    await page.locator('a:has-text("PIM")').click();
    await page.waitForURL('**/pim/viewEmployeeList');

    // Verify Employee Information section is visible
    await expect(page.getByRole('heading', { name: 'Employee Information' })).toBeVisible();

    // Enter a name in the Employee Name search field (scoped to the filter area)
    const employeeNameField = page.locator('.oxd-table-filter-area').getByPlaceholder('Type for hints...').first();
    await employeeNameField.fill('Amelia Brown');

    // Click Search
    await page.locator('.oxd-table-filter').locator('button:has-text("Search")').click();

    // Verify that search results are displayed (at least one row)
    const firstRow = page.locator('.oxd-table-body .oxd-table-row').first();
    await expect(firstRow).toBeVisible();
  });
});
