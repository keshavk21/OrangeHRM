import { test, expect } from '@playwright/test';

test.describe('OrangeHRM Buzz module', () => {
  const baseURL = 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login';
  const username = 'Admin';
  const password = 'admin123';
  const message = 'Excited for testing!';

  test('should post a message in Buzz and verify it appears in the feed', async ({ page }) => {
    await page.goto(baseURL, { waitUntil: 'domcontentloaded' });

    const usernameInput = page.locator('input[placeholder="Username"]');
    const passwordInput = page.locator('input[placeholder="Password"]');
    const loginButton = page.getByRole('button', { name: 'Login' });

    await expect(usernameInput).toBeVisible({ timeout: 15000 });
    await expect(passwordInput).toBeVisible({ timeout: 15000 });
    await usernameInput.fill(username);
    await passwordInput.fill(password);

    await Promise.all([
      page.waitForURL('**/dashboard/index', { timeout: 60000 }),
      loginButton.click(),
    ]);
    await page.waitForLoadState('networkidle');

    const buzzLink = page.locator('a.oxd-main-menu-item:has-text("Buzz")');
    await expect(buzzLink).toBeVisible({ timeout: 30000 });
    await buzzLink.click();

    await page.waitForURL('**/buzz/viewBuzz', { timeout: 60000 });
    await expect(page.locator('text=Buzz Newsfeed').first()).toBeVisible({ timeout: 30000 });

    const buzzInput = page.locator('textarea[placeholder="What\'s on your mind?"]');
    await expect(buzzInput).toBeVisible({ timeout: 15000 });
    await buzzInput.fill(message);

    const postButton = page.locator('button[type="submit"]:has-text("Post")');
    await expect(postButton).toBeVisible({ timeout: 15000 });
    await postButton.click();

    const postedMessage = page.locator(`text=${message}`).last();
    await expect(postedMessage).toBeVisible({ timeout: 30000 });
  });
});
