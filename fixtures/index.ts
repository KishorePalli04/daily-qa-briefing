import { test as base, APIRequestContext } from '@playwright/test';
import { GitHubTrendingPage } from '../pages/GitHubTrendingPage';
import { HackerNewsApiClient } from '../utils/apiClient';

/**
 * Custom fixtures — extend Playwright's base `test` with our own objects.
 *
 * WHY FIXTURES?
 *  Instead of instantiating page objects inside every test, fixtures
 *  inject them automatically. This is the idiomatic Playwright pattern
 *  and a key concept to explain in interviews.
 *
 * Usage in tests:
 *   test('my test', async ({ githubPage, hnClient }) => { ... })
 */

type MyFixtures = {
  githubPage : GitHubTrendingPage;
  hnClient   : HackerNewsApiClient;
};

export const test = base.extend<MyFixtures>({
  // ── UI Fixture: GitHub Trending Page ─────────────────────
  githubPage: async ({ page }, use) => {
    const githubPage = new GitHubTrendingPage(page);
    await use(githubPage);
    // Teardown: take screenshot if test failed (handled by Playwright config)
  },

  // ── API Fixture: Hacker News Client ───────────────────────
  hnClient: async ({ request }, use) => {
    const client = new HackerNewsApiClient(request);
    await use(client);
  },
});

export { expect } from '@playwright/test';
