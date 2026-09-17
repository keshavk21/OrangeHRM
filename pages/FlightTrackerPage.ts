import { expect, Page } from '@playwright/test';

export function createFlightTrackerPage(page: Page) {
  const selectFromSuggestion = async (container: string, value: string) => {
    const input = page.locator('div').filter({ hasText: container }).last().locator('input, [role="textbox"]').first();
    await input.click();
    await input.fill(value);
    const suggestion = page.locator('[role="listitem"], li').filter({ hasText: value }).first();
    await expect(suggestion).toBeVisible();
    await suggestion.click();
  };

  return {
    async open() {
      const baseUrl = process.env.BASE_URL ?? 'https://www.ixigo.com/';
      await page.goto(new URL('flight-status', baseUrl).toString());
    },

    async searchByFlightNumber(flightNumber: string) {
      const input = page.getByPlaceholder(/flight number/i);
      // The field only accepts the numeric flight number (type="number"); the
      // airline code prefix, if any, is dropped before typing.
      const numericFlightNumber = flightNumber.replace(/\D/g, '');
      await input.fill(numericFlightNumber);
      await page.getByRole('button', { name: /search|track/i }).click();
    },

    async searchByRoute(origin: string, destination: string, date: string) {
      // The toggle between "Flight No." and "Route" search modes is rendered as a
      // plain button, not a tab.
      await page.getByRole('button', { name: 'Route', exact: true }).click();
      await selectFromSuggestion('Departure Airport', origin);
      await selectFromSuggestion('Arrival Airport', destination);
      if (date.trim().toLowerCase() !== 'today') {
        await page.getByRole('button', { name: /^Date/ }).click();
        const dateOption = page.getByRole('button', { name: date, exact: false });
        await expect(dateOption).toBeVisible();
        await dateOption.click();
      }
      await page.getByRole('button', { name: /search|track/i }).click();
    },

    async expectLiveStatusDisplayed() {
      await expect(page.getByText(/status|departure|arrival|gate/i).first()).toBeVisible();
    },
  };
}
