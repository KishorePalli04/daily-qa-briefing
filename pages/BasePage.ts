import { Page, Locator, expect } from '@playwright/test';

/**
 * BasePage — all Page Objects extend this.
 * Provides common helpers: navigation, waiting, logging.
 */
export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // ── Navigation ────────────────────────────────────────────
  async navigateTo(url: string): Promise<void> {
    console.log(`[BasePage] Navigating to: ${url}`);
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
  }

  // ── Waits ─────────────────────────────────────────────────
  async waitForElement(locator: Locator, timeout = 15_000): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
  }

  // ── Screenshot helper ─────────────────────────────────────
  async takeScreenshot(name: string): Promise<Buffer> {
    return await this.page.screenshot({
      path: `test-results/screenshots/${name}-${Date.now()}.png`,
      fullPage: true,
    });
  }

  // ── Page title ────────────────────────────────────────────
  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  // ── Assert URL contains ───────────────────────────────────
  async assertUrlContains(fragment: string): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(fragment));
  }
}
