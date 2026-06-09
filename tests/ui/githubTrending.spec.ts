import { test, expect } from '../../fixtures';
import { BriefingStore } from '../../utils/dataStore';

/**
 * GitHub Trending UI Tests
 *
 * Demonstrates:
 *  ✅ Page Object Model — all selectors in GitHubTrendingPage
 *  ✅ Data extraction from real-world UI
 *  ✅ Assertions on scraped data shape
 *  ✅ Screenshot capture
 *  ✅ Cross-test data sharing via BriefingStore
 *
 * Interview talking point:
 *  "I always keep locators inside Page Objects — if GitHub changes
 *   a CSS class, I fix it in ONE place, not in every test."
 */

test.describe('GitHub Trending UI', () => {

  test('should load GitHub trending page successfully', async ({ githubPage }) => {
    await githubPage.open();

    // Assert we're on the right page
    const title = await githubPage.getPageTitle();
    expect(title).toContain('Trending');

    await githubPage.assertUrlContains('github.com/trending');

    // Take a screenshot as evidence
    await githubPage.takeScreenshot('github-trending');

    console.log(`[UI Test] Page title: "${title}"`);
  });

  test('should scrape at least 5 trending repositories', async ({ githubPage }) => {
    await githubPage.open();
    await githubPage.assertReposLoaded();

    const repos = await githubPage.getTrendingRepos(10);

    // Data shape assertions
    expect(repos.length).toBeGreaterThanOrEqual(5);

    for (const repo of repos) {
      expect(repo.name).toBeTruthy();              // e.g. "torvalds/linux"
      expect(repo.url).toContain('github.com');    // valid URL
    }

    // Log a sample
    console.log('[UI Test] Sample repos:');
    repos.slice(0, 3).forEach(r => {
      console.log(`  - ${r.name} (${r.language}) ⭐ ${r.stars}`);
    });
  });

  test('should scrape trending repos and save to briefing store', async ({ githubPage }) => {
    await githubPage.open();

    const repos = await githubPage.getTrendingRepos(10);
    expect(repos.length).toBeGreaterThan(0);

    // Merge UI data into the store (API test already saved HN stories)
    const existing = BriefingStore.load();
    BriefingStore.save({
      ...existing,
      trendingRepos: repos,
    });

    console.log(`[UI Test] ✅ ${repos.length} trending repos saved to briefing store`);
  });

  test('should filter trending repos by TypeScript language', async ({ githubPage }) => {
    await githubPage.openFilteredBy('typescript');

    const repos = await githubPage.getTrendingRepos(5);
    expect(repos.length).toBeGreaterThan(0);

    // Most results should be TypeScript (GitHub may include some N/A)
    const tsRepos = repos.filter(r =>
      r.language === 'TypeScript' || r.language === 'N/A'
    );
    expect(tsRepos.length).toBeGreaterThan(0);

    console.log(`[UI Test] TypeScript trending: ${repos.map(r => r.name).join(', ')}`);
  });

});
