import * as fs from 'fs';
import * as path from 'path';
import { BriefingStore, BriefingData } from './dataStore';

/**
 * globalTeardown — runs ONCE after all tests complete.
 * Generates the final daily HTML briefing report.
 */
export default async function globalTeardown(): Promise<void> {
  console.log('\n📊 [Global Teardown] Generating Daily Briefing HTML report...');

  const data = BriefingStore.load() as BriefingData;

  // Diagnostic logging for CI runs: show cwd and raw store contents
  try {
    console.log(`[Global Teardown] process.cwd(): ${process.cwd()}`);
    const storePath = require('path').join(process.cwd(), 'test-results', 'briefing-data.json');
    const exists = require('fs').existsSync(storePath);
    console.log(`[Global Teardown] briefing-data.json exists: ${exists}`);
    if (exists) {
      const raw = require('fs').readFileSync(storePath, 'utf-8');
      console.log('[Global Teardown] briefing-data.json contents:');
      console.log(raw);
    }
  } catch (err) {
    console.warn('[Global Teardown] Failed to read briefing-data.json for diagnostics:', err.message || err);
  }

  if (!data.hnStories && !data.trendingRepos) {
    console.warn('[Global Teardown] No briefing data found — skipping report generation');
    return;
  }

  const html = generateBriefingHTML(data);
  const reportPath = path.join('test-results', 'reports', 'daily-briefing.html');
  fs.writeFileSync(reportPath, html);

  console.log(`✅ [Global Teardown] Briefing report saved: ${reportPath}`);
}

function generateBriefingHTML(data: BriefingData): string {
  const date = new Date().toLocaleDateString('en-AU', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    timeZone: 'Australia/Sydney',
  });

  const storiesHTML = (data.hnStories ?? []).map((s, i) => `
    <div class="card">
      <span class="badge">#${i + 1}</span>
      <a href="${s.url ?? `https://news.ycombinator.com/item?id=${s.id}`}" target="_blank">
        ${s.title}
      </a>
      <div class="meta">⬆️ ${s.score} points &nbsp;|&nbsp; 💬 ${s.descendants ?? 0} comments &nbsp;|&nbsp; 👤 ${s.by}</div>
    </div>
  `).join('');

  const reposHTML = (data.trendingRepos ?? []).map((r, i) => `
    <div class="card">
      <span class="badge">#${i + 1}</span>
      <a href="${r.url}" target="_blank">${r.name}</a>
      <div class="meta">
        ${r.language !== 'N/A' ? `🔵 ${r.language} &nbsp;|&nbsp;` : ''}
        ⭐ ${r.stars}
      </div>
      ${r.description ? `<div class="desc">${r.description}</div>` : ''}
    </div>
  `).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Daily QA Briefing — ${date}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
           background: #0d1117; color: #c9d1d9; padding: 2rem; }
    h1   { color: #58a6ff; font-size: 1.8rem; margin-bottom: .25rem; }
    .subtitle { color: #8b949e; font-size: .9rem; margin-bottom: 2rem; }
    h2   { color: #f0f6fc; font-size: 1.2rem; margin: 1.5rem 0 1rem;
           border-bottom: 1px solid #30363d; padding-bottom: .5rem; }
    .card { background: #161b22; border: 1px solid #30363d; border-radius: 8px;
            padding: 1rem; margin-bottom: .75rem; }
    .card a { color: #58a6ff; text-decoration: none; font-weight: 600; }
    .card a:hover { text-decoration: underline; }
    .meta { color: #8b949e; font-size: .8rem; margin-top: .4rem; }
    .desc { color: #8b949e; font-size: .85rem; margin-top: .4rem; font-style: italic; }
    .badge { background: #1f6feb; color: #fff; border-radius: 4px;
             padding: .1rem .4rem; font-size: .75rem; margin-right: .5rem; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
    @media (max-width: 768px) { .grid { grid-template-columns: 1fr; } }
    .footer { text-align: center; color: #8b949e; font-size: .8rem; margin-top: 2rem; }
  </style>
</head>
<body>
  <h1>🤖 Daily QA Intelligence Briefing</h1>
  <p class="subtitle">Generated on ${date} &nbsp;|&nbsp; Powered by Playwright (UI + API)</p>

  <div class="grid">
    <div>
      <h2>🔥 Top Hacker News Stories (API)</h2>
      ${storiesHTML || '<p>No stories fetched.</p>'}
    </div>
    <div>
      <h2>📈 GitHub Trending Repos (UI Scrape)</h2>
      ${reposHTML || '<p>No repos scraped.</p>'}
    </div>
  </div>

  <p class="footer">
    Framework: Playwright + TypeScript &nbsp;|&nbsp;
    Data sources: Hacker News API + GitHub Trending &nbsp;|&nbsp;
    Runs daily via GitHub Actions
  </p>
</body>
</html>`;
}
