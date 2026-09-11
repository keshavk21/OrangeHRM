import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { PimPage } from '../pages/PimPage';

test.describe('OrangeHRM Add Employee', () => {
  test('should add new employee and verify profile page', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const pimPage = new PimPage(page);

    await loginPage.goto();
    //await loginPage.login('Admin', 'admin123');
    await loginPage.login('admin', 'Awesomeqa@4321');
    //await page.waitForURL('**/dashboard/index');

    await pimPage.navigateToPim();
    await pimPage.openAddEmployee();

    await pimPage.addEmployee('John123', 'Doe456');

    await page.waitForURL('**/pim/viewPersonalDetails/**');
    await expect(page.locator('text=John123 Doe456')).toBeVisible();
  });
});
