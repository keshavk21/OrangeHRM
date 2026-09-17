import { expect, Page } from '@playwright/test';

export function createFlightSearchPage(page: Page) {
  const selectAirport = async (searchText: string, airportName: string, fieldName?: 'From' | 'To') => {
    const airportInput = page.getByRole('textbox').first();

    if (fieldName) {
      await page.locator('p').filter({ hasText: fieldName }).click();
    } else {
      await airportInput.click();
    }

    await airportInput.fill(searchText);
    await page.waitForSelector('[role="listitem"]:visible', { state: 'visible' });

    const airportOption = page
      .locator('[role="listitem"]:visible')
      .filter({ hasText: airportName })
      .first();

    await expect(airportOption).toBeVisible();
    await airportOption.click();
  };

  const ageRangeLabelFor = (category: 'Adults' | 'Children' | 'Infants') =>
    ({ Adults: '12 yrs or above', Children: '2 - 12 yrs', Infants: '0 - 2 yrs' }[category]);

  const setTravellerCount = async (category: 'Adults' | 'Children' | 'Infants', count: number) => {
    const row = page
      .locator('div')
      .filter({ hasText: ageRangeLabelFor(category) })
      .filter({ has: page.getByRole('button', { name: String(count), exact: true }) })
      .filter({ visible: true })
      .last();
    const button = row.getByRole('button', { name: String(count), exact: true });
    await expect(button).toBeVisible();
    await button.click();
  };

  return {
    async open() {
      const baseUrl = process.env.BASE_URL ?? 'https://www.ixigo.com/';
      await page.goto(new URL('flights', baseUrl).toString());
    },

    async selectOneWay() {
      const oneWayTab = page.getByRole('tab', { name: /One Way/i });
      await oneWayTab.waitFor({ state: 'visible' });
      await oneWayTab.click();
    },

    async selectRoundTrip() {
      const roundTripTab = page.getByRole('tab', { name: /Round Trip/i });
      await roundTripTab.waitFor({ state: 'visible' });
      await roundTripTab.click();
    },

    async selectOrigin() {
      await selectAirport('Delhi', 'Delhi Indira Gandhi International Airport', 'From');
    },

    async selectDestination() {
      // "To" field auto-focuses after origin selection, so skip clicking its label.
      await selectAirport('Bengaluru', 'Kempegowda International Airport');
    },

    async selectOriginAirport(searchText: string, airportName: string) {
      await selectAirport(searchText, airportName, 'From');
    },

    async selectDestinationAirport(searchText: string, airportName: string) {
      await selectAirport(searchText, airportName, 'To');
    },

    async selectDepartureDate(dateLabel: string) {
      const dateOption = page.locator(`abbr[aria-label="${dateLabel}"]`);

      // The calendar auto-opens after destination selection; clicking the label
      // again while it's open would close it, so only open it if it's not already visible.
      if (!(await dateOption.isVisible())) {
        await page.locator('p').filter({ hasText: 'Departure' }).click();
      }
      await page.waitForSelector(`abbr[aria-label="${dateLabel}"]:visible`, { state: 'visible' });
      await expect(dateOption).toBeVisible();
      await dateOption.click();
    },

    async selectReturnDate(dateLabel: string) {
      // Round trip renders departure and return calendars side by side, and a hidden
      // duplicate for responsive layouts, so scope to visible matches only and take
      // the last one (the return calendar).
      const dateOption = page.locator(`abbr[aria-label="${dateLabel}"]:visible`).last();
      if (!(await dateOption.isVisible())) {
        await page.locator('p').filter({ hasText: 'Return' }).click();
      }
      await expect(dateOption).toBeVisible();
      await dateOption.click();
    },

    async openTravellersAndClass() {
      const trigger = page.locator('p').filter({ hasText: 'Travellers & Class' });
      const heading = page.getByRole('heading', { name: 'Travellers' });
      await trigger.click();
      // Retry once in case the first click didn't register (e.g. panel still animating in).
      if (!(await heading.waitFor({ state: 'visible', timeout: 3_000 }).then(() => true).catch(() => false))) {
        await trigger.click();
      }
      await expect(heading).toBeVisible();
    },

    async setAdultsCount(count: number) {
      await setTravellerCount('Adults', count);
    },

    async setChildrenCount(count: number) {
      await setTravellerCount('Children', count);
    },

    async setInfantsCount(count: number) {
      await setTravellerCount('Infants', count);
    },

    async selectClass(className: 'Economy' | 'Premium Economy' | 'Business') {
      await page.getByText(className, { exact: true }).last().click();
    },

    async confirmTravellersAndClass() {
      await page.getByRole('button', { name: 'Done' }).click();
    },

    async selectSpecialFare(name: 'Student' | 'Senior Citizen' | 'Armed Forces' | 'Doctors & Nurses') {
      await page.getByText(name, { exact: true }).click();
    },

    async toggleFreeCancellation() {
      const container = page.locator('div').filter({ hasText: 'Always opt for Free Cancellation' }).last();
      await container.getByRole('checkbox').first().click();
    },

    async search() {
      await page.getByRole('button', { name: /Search/i }).click();
    },

    async expectStillOnSearchPage() {
      await expect(page).not.toHaveURL(/search\/result/i);
    },
  };
}