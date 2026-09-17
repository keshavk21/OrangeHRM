import { expect, Page } from '@playwright/test';

export function createFlightResultsPage(page: Page) {
  const toggleCheckboxByLabel = async (labelText: string) => {
    const checkbox = page.getByRole('checkbox', { name: labelText }).first();
    await checkbox.scrollIntoViewIfNeeded();
    await checkbox.click();
  };

  return {
    async expectResultsDisplayed() {
      await expect(page).toHaveURL(/search/i);
      // The URL updates before the results/filters render; wait for either an
      // actual fare card or a "no flights found" message so a genuinely empty
      // result set (no flights for the searched route/date) doesn't fail the test.
      const fareHeading = page.getByRole('heading', { name: /^₹/ }).first();
      const noResultsMessage = page
        .getByText(/no flights found|no results found|sorry.*no flights|couldn't find any flights/i)
        .first();

      await expect(fareHeading.or(noResultsMessage)).toBeVisible({ timeout: 20_000 });
    },

    async hasNoFlightsFound() {
      return page
        .getByText(/no flights found|no results found|sorry.*no flights|couldn't find any flights/i)
        .first()
        .isVisible();
    },

    async filterByStops(label: 'Non-Stop' | '1 Stop' | '2+ Stops' | 'stops') {
      await toggleCheckboxByLabel(label);
    },

    async clearStopsFilter(label: 'Non-Stop' | '1 Stop' | '2+ Stops') {
      await toggleCheckboxByLabel(label);
    },

    async filterByAirline(airlineName: string) {
      await toggleCheckboxByLabel(airlineName);
    },

    async clearAirlineFilter(airlineName: string) {
      await toggleCheckboxByLabel(airlineName);
    },

    async filterByDepartureAirport(airportLabel: string) {
      await toggleCheckboxByLabel(airportLabel);
    },

    async filterByDepartureTimeWindow(windowLabel: string) {
      await toggleCheckboxByLabel(windowLabel);
    },

    async filterByArrivalTimeWindow(windowLabel: string) {
      await toggleCheckboxByLabel(windowLabel);
    },

    async clearTimeWindowFilters() {
      const checkedBoxes = page.getByRole('checkbox', { checked: true });
      const count = await checkedBoxes.count();
      for (let i = 0; i < count; i++) {
        await checkedBoxes.first().click();
      }
    },

    async getPriceRangeLabels() {
      const labels = page.locator('p').filter({ hasText: /^₹[\d,]+$/ });
      return labels.allTextContents();
    },

    async adjustPriceRange() {
      const slider = page.getByRole('slider').filter({ visible: true }).first();
      await slider.focus();
      await page.keyboard.press('ArrowRight');
    },

    async adjustDurationRange() {
      const slider = page.getByRole('slider').filter({ visible: true }).nth(1);
      await slider.focus();
      await page.keyboard.press('ArrowLeft');
    },

    async sortBy(mode: 'Price' | 'Fastest' | 'Departure' | 'Smart') {
      const row = page
        .locator('div')
        .filter({ hasText: mode })
        .filter({ has: page.getByRole('radio') })
        .filter({ visible: true })
        .last();
      await row.getByRole('radio').click();
    },

    async scrollDateStrip() {
      // Day-of-week in the strip label depends on the searched date, so match any weekday.
      const strip = page
        .locator('div')
        .filter({ hasText: /^[A-Za-z]{3}, \d{2} [A-Za-z]{3}$/ })
        .filter({ visible: true })
        .first();
      await strip.hover();
      await page.mouse.wheel(300, 0);
    },

    async selectDateFromStrip(dateLabel: string) {
      await page.getByText(dateLabel, { exact: true }).first().click();
    },

    async getFirstFareText() {
      return (await page.getByRole('heading', { name: /^₹/ }).first().textContent())?.trim();
    },

    async getFirstFlightCardText() {
      return (await page.locator('h6').first().textContent())?.trim();
    },

    async openFlightDetails(index = 0) {
      await page.getByText('Flight Details', { exact: true }).filter({ visible: true }).nth(index).click();
    },

    async clickBook(index = 0) {
      const bookButton = page.getByRole('button', { name: 'Book' }).filter({ visible: true }).nth(index);
      await bookButton.scrollIntoViewIfNeeded();
      await expect(bookButton).toBeVisible();
      // Third-party ad content briefly renders into #portal-root and can intercept
      // pointer events; force the click since the button itself is confirmed visible.
      await bookButton.click({ force: true });
    },

    async clickLockPrice(index = 0) {
      const lockPrice = page.getByText(/Lock Price/i).filter({ visible: true }).nth(index);
      await lockPrice.scrollIntoViewIfNeeded();
      await expect(lockPrice).toBeVisible();
      // Third-party ad content briefly renders into #portal-root and can intercept
      // pointer events; force the click since the element itself is confirmed visible.
      await lockPrice.click({ force: true });
    },

    async selectBankOffer() {
      await page.getByRole('button').filter({ has: page.locator('img') }).first().click();
    },

    async expectBankOfferDetailsVisible() {
      await expect(page.getByText(/off|discount|cashback/i).first()).toBeVisible();
    },
  };
}