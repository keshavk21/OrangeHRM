import { expect, Locator, Page } from '@playwright/test';

export function createCommonPage(initialPage: Page) {
  // Reassigned when a header/footer link opens a popup tab (see clickAndFollowPopup).
  let page = initialPage;

  // The header renders a duplicate nav (a sticky/compact header kept
  // translated off-screen above the viewport until the user scrolls). It still
  // passes Playwright's isVisible() check, so `.first()` picks the off-screen
  // copy; the on-screen copy is consistently the last match in DOM order.
  const headerNavLink = (name: string) => page.getByRole('link', { name: new RegExp(name, 'i') }).last();

  // Some header/footer links open in a new tab; switch to it so subsequent
  // checks (e.g. URL assertions) run against the page that actually navigated.
  const clickAndFollowPopup = async (link: Locator) => {
    await link.scrollIntoViewIfNeeded();
    const popupPromise = page.waitForEvent('popup', { timeout: 5_000 }).catch(() => null);
    await link.click();
    const popup = await popupPromise;
    if (popup) {
      await popup.waitForLoadState('domcontentloaded').catch(() => undefined);
      page = popup;
    }
  };

  return {
    async expectHeaderNavLinkVisible(name: string) {
      await expect(headerNavLink(name)).toBeVisible();
    },

    async clickHeaderNavLink(name: string) {
      await clickAndFollowPopup(headerNavLink(name));
    },

    async expectFooterLinkVisible(name: string) {
      const link = page.getByRole('link', { name: new RegExp(name, 'i') }).first();
      await link.scrollIntoViewIfNeeded();
      await expect(link).toBeVisible();
    },

    async clickFooterLink(name: string) {
      const link = page.getByRole('link', { name: new RegExp(name, 'i') }).last();
      await clickAndFollowPopup(link);
    },

    async expectUrlContains(path: string) {
      await expect(page).toHaveURL(new RegExp(path.replace(/\//g, '\\/')));
    },

    async expectBannerVisible() {
      await expect(page.locator('img[alt*="sale" i], img[alt*="banner" i], img[alt*="offer" i]').first()).toBeVisible();
    },

    async clickBanner() {
      await page.locator('img[alt*="sale" i], img[alt*="banner" i], img[alt*="offer" i]').first().click();
    },

    async resizeViewport(width: number, height: number) {
      await page.setViewportSize({ width, height });
      // Let responsive layout/reflow settle before measuring dimensions.
      await page.waitForFunction((expectedWidth) => window.innerWidth === expectedWidth, width);
    },

    async expectNoLayoutOverlap() {
      await expect(page.locator('body')).toBeVisible();
      const hasHorizontalScroll = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 5
      );
      expect(hasHorizontalScroll).toBeFalsy();
    },
  };
}
