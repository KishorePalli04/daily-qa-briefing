import { test, expect } from '../../fixtures';
import { BriefingStore } from '../../utils/dataStore';

/**
 * Hacker News API Tests
 *
 * Demonstrates:
 *  ✅ Using Playwright's APIRequestContext (not axios)
 *  ✅ REST API assertions (status codes, response shape)
 *  ✅ Data extraction and persistence across test files
 *  ✅ Filtering/processing API responses
 *
 * Interview talking point:
 *  "I use Playwright's built-in request context for API tests so that
 *   API calls appear in the same HTML trace/report as UI steps — giving
 *   a single pane of glass for debugging."
 */

test.describe('Hacker News API', () => {

  test('should return 200 for top stories endpoint', async ({ request }) => {
    const response = await request.get(
      'https://hacker-news.firebaseio.com/v0/topstories.json'
    );

    // Assert HTTP status
    expect(response.status()).toBe(200);

    // Assert content type
    expect(response.headers()['content-type']).toContain('application/json');

    // Assert response is a non-empty array
    const ids: number[] = await response.json();
    expect(Array.isArray(ids)).toBeTruthy();
    expect(ids.length).toBeGreaterThan(0);

    console.log(`[API Test] Top stories endpoint returned ${ids.length} story IDs`);
  });

  test('should fetch a valid story by ID', async ({ hnClient }) => {
    // Fetch just the top ID to keep the test fast
    const ids   = await hnClient.getTopStoryIds(1);
    const story = await hnClient.getStory(ids[0]);

    // Assert story shape
    expect(story).toHaveProperty('id');
    expect(story).toHaveProperty('title');
    expect(story).toHaveProperty('score');
    expect(story).toHaveProperty('by');
    expect(story.score).toBeGreaterThan(0);

    console.log(`[API Test] Fetched story: "${story.title}" — Score: ${story.score}`);
  });

  test('should fetch top 10 stories and save to briefing store', async ({ hnClient }) => {
    const stories = await hnClient.getTopStories(10);

    // Validate we got stories
    expect(stories.length).toBeGreaterThan(0);
    expect(stories.length).toBeLessThanOrEqual(10);

    // Validate each story has required fields
    for (const story of stories) {
      expect(story.id).toBeDefined();
      expect(story.title).toBeTruthy();
    }

    // Filter for QA-relevant stories
    const qaStories = hnClient.filterQARelevant(stories);
    console.log(`[API Test] ${qaStories.length}/${stories.length} stories are QA-relevant`);

    // Save ALL stories to the store (teardown generates the report)
    BriefingStore.save({
      generatedAt: new Date().toISOString(),
      hnStories: stories,
    });

    console.log(`[API Test] ✅ ${stories.length} stories saved to briefing store`);
  });

});
