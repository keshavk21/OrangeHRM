import { expect, Page } from '@playwright/test';

export function createGroupBookingPage(page: Page) {
  const fillAutocomplete = async (placeholder: RegExp, value: string) => {
    const input = page.getByPlaceholder(placeholder);
    await input.click();
    await input.fill(value);
    // Selecting a suggestion (if the field opens one) closes the dropdown so it
    // doesn't intercept clicks/fills on the next field.
    const suggestion = page.locator('[role="listitem"], li').filter({ hasText: value }).first();
    if (await suggestion.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await suggestion.click();
    }
  };

  return {
    async open() {
      await page.goto('https://rocket.ixigo.com/group/index.html?p=app_search_form');
    },

    async fillRoute(origin: string, destination: string) {
      await fillAutocomplete(/from/i, origin);
      await fillAutocomplete(/to/i, destination);
    },

    async fillTravellerCount(count: number) {
      await page.getByPlaceholder(/traveller|passenger/i).fill(String(count));
    },

    async fillContactDetails(name: string, phone: string, email: string) {
      await page.getByPlaceholder(/name/i).fill(name);
      await page.getByPlaceholder(/phone|mobile/i).fill(phone);
      await page.getByPlaceholder(/email/i).fill(email);
    },

    async leaveContactNumberEmpty() {
      await page.getByPlaceholder(/phone|mobile/i).fill('');
    },

    async submit() {
      await page.getByRole('button', { name: /submit|send|request/i }).click();
    },

    async expectConfirmationDisplayed() {
      await expect(page.getByText(/thank you|confirmed|reference/i).first()).toBeVisible();
    },

    async expectValidationBlocked() {
      await expect(page.getByText(/required|please enter|invalid/i).first()).toBeVisible();
    },
  };
}
