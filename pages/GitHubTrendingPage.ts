import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export interface TrendingRepo {
  name: string;
  description: string;
  language: string;
  stars: string;
  url: string;
}

/**
 * GitHubTrendingPage — scrapes GitHub Trending for hot repositories.
 *
 * URL: https://github.com/trending
 *
 * Why this is useful in interviews:
 *  - Shows real-world UI scraping with locators
 *  - Demonstrates Page Object Model properly
 *  - Uses structured data extraction (not just assertions)
 */
export class GitHubTrendingPage extends BasePage {
  // ── Locators (defined once, reused everywhere) ────────────
  private readonly repoList: Locator;
  private readonly repoItems: Locator;

  constructor(page: Page) {
    super(page);
    this.repoList  = page.locator('article.Box-row');
    this.repoItems = page.locator('article.Box-row');
  }

  // ── Actions ───────────────────────────────────────────────

  async open(): Promise<void> {
    await this.navigateTo('https://github.com/trending');
    // Wait until at least one repo card is visible
    await this.waitForElement(this.repoList.first());
  }

  async openFilteredBy(language: string): Promise<void> {
    await this.navigateTo(
      `https://github.com/trending/${encodeURIComponent(language)}?since=daily`
    );
    await this.waitForElement(this.repoList.first());
  }

  async getTrendingRepos(limit = 10): Promise<TrendingRepo[]> {
    const items = await this.repoItems.all();
    const repos: TrendingRepo[] = [];

    for (const item of items.slice(0, limit)) {
      // Repo name (org/repo)
      const nameEl   = item.locator('h2 a');
      const rawName  = await nameEl.getAttribute('href') ?? '';
      const name     = rawName.replace(/^\//, '');          // strip leading /

      // Description
      const descEl   = item.locator('p');
      const desc     = (await descEl.textContent() ?? '').trim();

      // Language
      const langEl   = item.locator('[itemprop="programmingLanguage"]');
      const lang     = await langEl.count() > 0
        ? (await langEl.textContent() ?? '').trim()
        : 'N/A';

      // Stars today
      const starsEl  = item.locator('span.d-inline-block.float-sm-right');
      const stars    = await starsEl.count() > 0
        ? (await starsEl.textContent() ?? '').trim()
        : '0';

      repos.push({
        name,
        description: desc,
        language: lang,
        stars,
        url: `https://github.com/${name}`,
      });
    }

    return repos;
  }

  // ── Assertions ────────────────────────────────────────────

  async assertReposLoaded(): Promise<void> {
    const count = await this.repoItems.count();
    if (count === 0) throw new Error('No trending repos found — page may have changed');
    console.log(`[GitHubTrendingPage] Found ${count} trending repos`);
  }
}
