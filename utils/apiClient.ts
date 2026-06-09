import { APIRequestContext } from '@playwright/test';

export interface HNStory {
  id: number;
  title: string;
  url: string;
  score: number;
  by: string;
  time: number;
  descendants: number; // comment count
}

/**
 * HackerNewsApiClient — wraps Hacker News Firebase REST API.
 *
 * Base URL : https://hacker-news.firebaseio.com/v0
 * Docs     : https://github.com/HackerNews/API
 *
 * Why use Playwright's APIRequestContext instead of axios?
 *  → It integrates with Playwright's tracing, reporting, and retry logic.
 *  → Responses appear in the HTML report alongside UI steps.
 *  → This is exactly what interviewers want to see — unified tooling.
 */
export class HackerNewsApiClient {
  private readonly baseUrl = 'https://hacker-news.firebaseio.com/v0';
  private readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  // ── Fetch top story IDs ───────────────────────────────────
  async getTopStoryIds(limit = 30): Promise<number[]> {
    const response = await this.request.get(`${this.baseUrl}/topstories.json`);

    if (!response.ok()) {
      throw new Error(`Failed to fetch top stories: ${response.status()}`);
    }

    const ids: number[] = await response.json();
    return ids.slice(0, limit);
  }

  // ── Fetch a single story by ID ────────────────────────────
  async getStory(id: number): Promise<HNStory> {
    const response = await this.request.get(`${this.baseUrl}/item/${id}.json`);

    if (!response.ok()) {
      throw new Error(`Failed to fetch story ${id}: ${response.status()}`);
    }

    return await response.json() as HNStory;
  }

  // ── Fetch top N stories with full details ─────────────────
  async getTopStories(limit = 10): Promise<HNStory[]> {
    console.log(`[HackerNewsApiClient] Fetching top ${limit} stories...`);

    const ids    = await this.getTopStoryIds(limit);
    const stories: HNStory[] = [];

    // Fetch stories concurrently (batches of 5 to avoid rate limits)
    const batchSize = 5;
    for (let i = 0; i < ids.length; i += batchSize) {
      const batch   = ids.slice(i, i + batchSize);
      const results = await Promise.all(batch.map(id => this.getStory(id)));
      stories.push(...results.filter(s => s && s.title)); // filter nulls
    }

    return stories;
  }

  // ── Filter stories relevant to QA / Testing / Automation ──
  filterQARelevant(stories: HNStory[]): HNStory[] {
    const keywords = [
      'test', 'testing', 'playwright', 'selenium', 'cypress',
      'automation', 'qa', 'quality', 'ci/cd', 'github actions',
      'devops', 'typescript', 'javascript', 'python', 'api',
    ];

    return stories.filter(story =>
      keywords.some(kw =>
        story.title?.toLowerCase().includes(kw) ||
        story.url?.toLowerCase().includes(kw)
      )
    );
  }

  // ── Format Unix timestamp to readable date ─────────────────
  formatDate(unixTime: number): string {
    return new Date(unixTime * 1000).toLocaleString('en-AU', {
      timeZone: 'Australia/Sydney',
    });
  }
}
