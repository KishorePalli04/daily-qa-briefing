# 🤖 Daily QA Intelligence Briefing

A **production-grade Playwright framework** that combines **UI scraping** and
**REST API testing** to generate a daily tech briefing — and runs automatically
via **GitHub Actions** every morning.

> 📈 **Also in this repo:** [**Daily Stock Picks**](stock-report/README.md) — a
> news-aware technical screener that ranks Australian (ASX) and international
> stocks each weekday and emails you an HTML report of the best picks.
> Run it with `npm run stocks:demo` (offline) or `npm run stocks` (live).

---

## 📐 Framework Architecture

```
daily-qa-briefing/
├── .github/
│   └── workflows/
│       └── daily-briefing.yml   ← GitHub Actions (runs daily 7am AEST)
│
├── pages/                       ← Page Object Model
│   ├── BasePage.ts              ← Shared helpers (navigate, wait, screenshot)
│   └── GitHubTrendingPage.ts    ← UI scraping — GitHub Trending
│
├── tests/
│   ├── api/
│   │   └── hackerNews.spec.ts   ← REST API tests (Hacker News API)
│   └── ui/
│       └── githubTrending.spec.ts ← UI scrape tests
│
├── utils/
│   ├── apiClient.ts             ← HackerNewsApiClient (wraps Playwright request)
│   ├── dataStore.ts             ← Shares data between API + UI tests
│   ├── briefingReporter.ts      ← Custom Playwright reporter
│   ├── globalSetup.ts           ← Runs once before all tests
│   └── globalTeardown.ts        ← Generates HTML report after all tests
│
├── fixtures/
│   └── index.ts                 ← Custom fixtures (inject page objects + API client)
│
└── playwright.config.ts         ← Config: two projects (api-tests, ui-tests)
```

---

## 🚀 Quick Start

```bash
# 1. Clone and install
git clone <your-repo>
cd daily-qa-briefing
npm install

# 2. Install Playwright browsers
npx playwright install chromium

# 3. Run everything
npm test

# 4. View reports
npm run report                                    # Playwright HTML report
open test-results/reports/daily-briefing.html     # Custom briefing report
```

---

## 🧠 Key Design Decisions (Interview Talking Points)

| Decision | Why |
|---|---|
| **Playwright APIRequestContext** for API calls | API calls appear in the same trace/report as UI steps — one pane of glass |
| **Page Object Model** | Locators in one place; if UI changes, fix in one file |
| **Custom fixtures** | Inject page objects automatically — no `new GitHubTrendingPage(page)` in every test |
| **Global setup/teardown** | Centralise directory creation and report generation |
| **Custom reporter** | Shows real-time pass/fail inline in console |
| **Two Playwright projects** | Separate `api-tests` and `ui-tests` — run independently or together |
| **BriefingStore** | Shares data between test files without coupling them |

---

## ⚙️ GitHub Actions

The workflow in `.github/workflows/daily-briefing.yml`:

- **Runs daily** at 9:00 PM UTC (= 7:00 AM AEST Sydney)
- **Manual trigger** available via `workflow_dispatch`
- **Uploads** the HTML briefing as a downloadable artifact (kept 30 days)
- **Uploads** test traces/screenshots only on failure (saves storage)

---

## 📊 What the Briefing Report Shows

| Section | Source | Method |
|---|---|---|
| Top 10 Hacker News stories | Hacker News Firebase API | **API call** via Playwright request |
| GitHub Trending repos (top 10) | github.com/trending | **UI scrape** via Playwright page |

---

## 🔧 Extending the Framework

```typescript
// Add a new data source? Create a new Page Object or API client:
pages/SeekJobsPage.ts          // Scrape Seek.com.au job listings
utils/weatherApiClient.ts      // Call OpenWeatherMap API
tests/ui/seekJobs.spec.ts      // Write the test
tests/api/weather.spec.ts      // Write the test
// That's it — teardown auto-includes it in the HTML report
```
