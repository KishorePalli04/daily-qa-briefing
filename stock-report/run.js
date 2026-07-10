'use strict';

/**
 * Entry point for the Daily Stock Picks pipeline.
 *
 *   1. For every ticker in the universe, fetch price history + news (throttled).
 *   2. Score and rank them into top / Australian / international picks.
 *   3. Render an HTML report to test-results/reports/daily-stock-report.html.
 *
 * Set STOCK_DEMO=1 to run fully offline with deterministic synthetic data
 * (used for local previews and CI smoke tests). The scheduled GitHub Action
 * runs without it, against live Yahoo Finance / stooq data.
 */

const fs = require('fs');
const path = require('path');

const { UNIVERSE } = require('./universe');
const { getSeries, DEMO } = require('./dataProvider');
const { getNews } = require('./newsProvider');
const { rank } = require('./analyzer');
const { generateHTML } = require('./reporter');

const CONCURRENCY = Number(process.env.STOCK_CONCURRENCY || 6);

/** Run async `worker` over `items` with a bounded number of concurrent tasks. */
async function mapLimit(items, limit, worker) {
  const results = new Array(items.length);
  let next = 0;
  async function runner() {
    while (next < items.length) {
      const i = next++;
      results[i] = await worker(items[i], i);
    }
  }
  const runners = Array.from({ length: Math.min(limit, items.length) }, runner);
  await Promise.all(runners);
  return results;
}

async function main() {
  const startedAt = Date.now();
  console.log('📈 Daily Stock Picks — starting analysis');
  console.log(`   Mode: ${DEMO ? 'DEMO (offline synthetic data)' : 'LIVE (Yahoo Finance / stooq)'}`);
  console.log(`   Universe: ${UNIVERSE.length} tickers, concurrency ${CONCURRENCY}\n`);

  const results = await mapLimit(UNIVERSE, CONCURRENCY, async (ticker) => {
    const series = await getSeries(ticker);
    // Only spend a news request on tickers we could actually price.
    const news = series ? await getNews(ticker) : { headlines: [], sentiment: 0 };
    if (series) process.stdout.write('.');
    else process.stdout.write('x');
    return { ticker, series, news };
  });
  process.stdout.write('\n\n');

  const ranked = rank(results);

  if (ranked.analysedCount === 0) {
    console.error('❌ No stocks could be analysed (no data). Aborting report generation.');
    process.exit(1);
  }

  const outDir = path.join(process.cwd(), 'test-results', 'reports');
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, 'daily-stock-report.html');
  fs.writeFileSync(outPath, generateHTML(ranked));

  // Also drop a machine-readable snapshot for debugging / future use.
  const jsonPath = path.join(outDir, 'daily-stock-report.json');
  fs.writeFileSync(
    jsonPath,
    JSON.stringify(
      {
        generatedAt: ranked.generatedAt,
        analysedCount: ranked.analysedCount,
        universeCount: ranked.universeCount,
        top: ranked.top.map(summarise),
        australian: ranked.australian.map(summarise),
        international: ranked.international.map(summarise),
      },
      null,
      2
    )
  );

  const elapsed = ((Date.now() - startedAt) / 1000).toFixed(1);
  console.log(`✅ Analysed ${ranked.analysedCount}/${ranked.universeCount} stocks in ${elapsed}s`);
  console.log('\n🏆 Top picks today:');
  ranked.top.slice(0, 5).forEach((a, i) => {
    console.log(
      `   ${i + 1}. ${a.ticker.yahoo.padEnd(7)} ${String(a.score).padStart(4)}  ${a.signal.padEnd(11)} (${a.ticker.market})`
    );
  });
  console.log(`\n📄 Report:  ${outPath}`);
  console.log(`📦 Data:    ${jsonPath}`);
}

function summarise(a) {
  return {
    symbol: a.ticker.yahoo,
    name: a.ticker.name,
    market: a.ticker.market,
    score: a.score,
    signal: a.signal,
    price: a.metrics.price,
    ret1d: a.metrics.ret1d,
    ret5d: a.metrics.ret5d,
    ret20d: a.metrics.ret20d,
    rsi: a.metrics.rsi,
    rationale: a.rationale,
  };
}

main().catch((err) => {
  console.error('❌ Stock pipeline failed:', err);
  process.exit(1);
});
