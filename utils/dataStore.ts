import * as fs from 'fs';
import * as path from 'path';
import { HNStory } from './apiClient';
import { TrendingRepo } from '../pages/GitHubTrendingPage';

/**
 * BriefingDataStore — a simple JSON-based store to pass data
 * between separate test files (API tests → UI tests → Reporter).
 *
 * In a real project this could be Redis, a database, or shared fixtures.
 * For portability in this framework, we use a temp JSON file.
 */

const STORE_PATH = path.join(process.cwd(), 'test-results', 'briefing-data.json');

export interface BriefingData {
  generatedAt: string;
  hnStories: HNStory[];
  trendingRepos: TrendingRepo[];
}

export const BriefingStore = {
  // ── Save data ───────────────────────────────────────────
  save(data: Partial<BriefingData>): void {
    const existing = this.load();
    const merged   = { ...existing, ...data };
    fs.mkdirSync(path.dirname(STORE_PATH), { recursive: true });
    fs.writeFileSync(STORE_PATH, JSON.stringify(merged, null, 2));
    console.log(`[BriefingStore] Data saved to ${STORE_PATH}`);
  },

  // ── Load data ───────────────────────────────────────────
  load(): Partial<BriefingData> {
    if (!fs.existsSync(STORE_PATH)) return {};
    try {
      return JSON.parse(fs.readFileSync(STORE_PATH, 'utf-8'));
    } catch {
      return {};
    }
  },

  // ── Clear store ─────────────────────────────────────────
  clear(): void {
    if (fs.existsSync(STORE_PATH)) fs.unlinkSync(STORE_PATH);
  },
};
