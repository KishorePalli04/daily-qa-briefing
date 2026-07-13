import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // -------------------------------------------------------
  // Test directory & global settings
  // -------------------------------------------------------
  testDir: './tests',
  timeout: 60_000,           // 60s per test (scraping can be slow)
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 2,
  fullyParallel: false,       // Run sequentially to avoid rate limits

  // -------------------------------------------------------
  // Reporters: HTML (visual) + list (console)
  // -------------------------------------------------------
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
    ['./utils/briefingReporter.ts'], // Our custom reporter
  ],

  // -------------------------------------------------------
  // Global setup & teardown
  // -------------------------------------------------------
  globalSetup: './utils/globalSetup.ts',
  globalTeardown: './utils/globalTeardown.ts',

  use: {
    // API base URL (Hacker News Firebase API)
    baseURL: 'https://hacker-news.firebaseio.com',

    // Browser settings for UI tests
    headless: false,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',

    // Extra HTTP headers
    extraHTTPHeaders: {
      'Accept': 'application/json',
    },
  },

  projects: [
    // ── API Project ────────────────────────────────────────
    {
      name: 'api-tests',
      testMatch: 'tests/api/**/*.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
      },
    },

    // ── UI Project ─────────────────────────────────────────
    {
      name: 'ui-tests',
      testMatch: 'tests/ui/**/*.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
      },
    },
  ],

  // Output folder for test artifacts
  outputDir: 'test-results/',
});
