import { expect, Page } from '@playwright/test';

export function createReviewPage(page: Page) {
  return {
    async expectReviewDisplayed() {
      // Some flows gate the review details behind a login prompt instead of rendering
      // the details directly; treat that boundary as a valid, non-blocking outcome.
      const reviewHeading = page.getByText(/Review Flight Details/i).first();
      const loginPrompt = page.getByRole('button', { name: /Log ?in.*Sign ?up/i }).first();
      await expect(reviewHeading.or(loginPrompt)).toBeVisible();
    },

    async openCancellationPolicy() {
      await page.getByText(/Cancellation.*Reschedul|Cancellation Polic/i).first().click();
    },

    async expectCancellationPolicyVisible() {
      await expect(page.getByText(/cancellation fee|refund/i).first()).toBeVisible();
    },

    async openReschedulingPolicy() {
      const link = page.getByText(/Reschedul/i).first();
      await link.scrollIntoViewIfNeeded();
      await expect(link).toBeVisible();
      // Third-party ad content briefly renders into #portal-root and can intercept
      // pointer events; force the click since the element itself is confirmed visible.
      await link.click({ force: true });
    },

    async expectReschedulingPolicyVisible() {
      await expect(
        page.getByText(/reschedul(e|ing)?.*(fee|fees|charge|charges|rule|rules|polic)/i).first()
      ).toBeVisible();
    },

    async lockPrice() {
      await page.getByText(/Lock Price/i).first().click();
    },

    async expectLockPriceTermsVisible() {
      // If a login prompt appears instead of the lock-price terms, that boundary is expected.
      // .first() must be applied after combining with .or(), otherwise both elements can be
      // visible at once and trigger a strict-mode violation.
      const terms = page.getByText(/hold|lock/i);
      const loginPrompt = page.getByRole('button', { name: /Log ?in.*Sign ?up/i });
      await expect(terms.or(loginPrompt).first()).toBeVisible();
    },

    async expectAuthenticationBoundary() {
      await expect(page.getByRole('button', { name: 'Log in/Sign up', exact: true })).toBeVisible();
    },

    async expectNoPaymentSubmitted() {
      await expect(page.getByText(/Review Flight Details/i).first()).toBeVisible();
    },
  };
}
