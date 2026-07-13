'use strict';

/**
 * Fetches daily OHLCV history for a ticker.
 *
 * Primary source : Yahoo Finance chart API (keyless).
 * Fallback source: stooq.com CSV (keyless).
 * Demo mode      : deterministic synthetic series so the pipeline and report
 *                  can be exercised with zero network access (the CI runner has
 *                  full internet; local dev / restricted sandboxes do not).
 *
 * A "series" is: { closes:[], highs:[], lows:[], volumes:[], lastClose, prevClose }
 * ordered oldest -> newest.
 */

const DEMO = process.env.STOCK_DEMO === '1' || process.env.STOCK_DEMO === 'true';
const FETCH_TIMEOUT_MS = Number(process.env.STOCK_FETCH_TIMEOUT_MS || 15000);

async function fetchWithTimeout(url, opts = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    return await fetch(url, {
      ...opts,
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
          '(KHTML, like Gecko) Chrome/120.0 Safari/537.36',
        Accept: 'application/json,text/csv,*/*',
        ...(opts.headers || {}),
      },
    });
  } finally {
    clearTimeout(timer);
  }
}

/** Yahoo Finance v8 chart endpoint. */
async function fromYahoo(symbol) {
  const url =
    `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}` +
    `?range=3mo&interval=1d&includePrePost=false`;
  const res = await fetchWithTimeout(url);
  if (!res.ok) throw new Error(`Yahoo HTTP ${res.status}`);
  const json = await res.json();
  const result = json?.chart?.result?.[0];
  if (!result) throw new Error('Yahoo: no chart result');

  const quote = result.indicators?.quote?.[0] || {};
  const closesRaw = quote.close || [];
  const highsRaw = quote.high || [];
  const lowsRaw = quote.low || [];
  const volsRaw = quote.volume || [];

  // Drop trailing/interspersed null candles (holidays, halts).
  const closes = [];
  const highs = [];
  const lows = [];
  const volumes = [];
  for (let i = 0; i < closesRaw.length; i++) {
    if (closesRaw[i] == null) continue;
    closes.push(closesRaw[i]);
    highs.push(highsRaw[i] ?? closesRaw[i]);
    lows.push(lowsRaw[i] ?? closesRaw[i]);
    volumes.push(volsRaw[i] ?? 0);
  }
  if (closes.length < 30) throw new Error('Yahoo: insufficient history');

  const meta = result.meta || {};
  return {
    closes,
    highs,
    lows,
    volumes,
    lastClose: meta.regularMarketPrice ?? closes[closes.length - 1],
    // The true prior *daily* close. NOT meta.chartPreviousClose, which is the
    // close before the chart range begins (~3 months ago for a 3mo range).
    prevClose: closes[closes.length - 2],
    source: 'yahoo',
  };
}

/** stooq.com CSV fallback (Date,Open,High,Low,Close,Volume). */
async function fromStooq(stooqSymbol) {
  const url = `https://stooq.com/q/d/l/?s=${encodeURIComponent(stooqSymbol)}&i=d`;
  const res = await fetchWithTimeout(url);
  if (!res.ok) throw new Error(`stooq HTTP ${res.status}`);
  const text = await res.text();
  const lines = text.trim().split('\n');
  if (lines.length < 31) throw new Error('stooq: insufficient history');

  const closes = [];
  const highs = [];
  const lows = [];
  const volumes = [];
  for (let i = 1; i < lines.length; i++) {
    const [, , high, low, close, volume] = lines[i].split(',');
    const c = parseFloat(close);
    if (!Number.isFinite(c)) continue;
    closes.push(c);
    highs.push(parseFloat(high) || c);
    lows.push(parseFloat(low) || c);
    volumes.push(parseFloat(volume) || 0);
  }
  // Keep ~3 months of trading days.
  const keep = 66;
  return {
    closes: closes.slice(-keep),
    highs: highs.slice(-keep),
    lows: lows.slice(-keep),
    volumes: volumes.slice(-keep),
    lastClose: closes[closes.length - 1],
    prevClose: closes[closes.length - 2],
    source: 'stooq',
  };
}

/** Deterministic pseudo-random generator seeded from the ticker string. */
function seededRng(seedStr) {
  let h = 2166136261;
  for (let i = 0; i < seedStr.length; i++) {
    h ^= seedStr.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return function next() {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Synthetic random-walk series with a per-ticker drift, for offline demos. */
function demoSeries(ticker) {
  const rng = seededRng(ticker.yahoo);
  const days = 66;
  // Drift ranges roughly -0.15%..+0.35% per day so some names clearly outperform.
  const drift = (rng() - 0.35) * 0.005;
  const vol = 0.008 + rng() * 0.02;
  let price = 20 + rng() * 380;
  const closes = [];
  const highs = [];
  const lows = [];
  const volumes = [];
  const baseVol = 500000 + Math.floor(rng() * 5000000);
  for (let i = 0; i < days; i++) {
    const shock = (rng() - 0.5) * 2 * vol;
    price = Math.max(1, price * (1 + drift + shock));
    const intraday = price * (0.003 + rng() * 0.012);
    closes.push(price);
    highs.push(price + intraday);
    lows.push(price - intraday);
    // Volume spikes on the last few days for some tickers to exercise the surge signal.
    const surge = i > days - 4 && rng() > 0.6 ? 1.5 + rng() : 1;
    volumes.push(Math.floor(baseVol * (0.6 + rng() * 0.8) * surge));
  }
  return {
    closes,
    highs,
    lows,
    volumes,
    lastClose: closes[closes.length - 1],
    prevClose: closes[closes.length - 2],
    source: 'demo',
  };
}

/**
 * Resolve a series for one ticker. Never throws — returns null on total
 * failure so a single bad symbol can't sink the whole run.
 */
async function getSeries(ticker) {
  if (DEMO) return demoSeries(ticker);
  try {
    return await fromYahoo(ticker.yahoo);
  } catch (errYahoo) {
    try {
      const s = await fromStooq(ticker.stooq);
      if (s.closes.length >= 30) return s;
      throw new Error('stooq: too short');
    } catch (errStooq) {
      console.warn(
        `  ⚠️  ${ticker.yahoo}: data unavailable (${errYahoo.message} / ${errStooq.message})`
      );
      return null;
    }
  }
}

module.exports = { getSeries, DEMO };
