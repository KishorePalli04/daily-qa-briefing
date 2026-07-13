'use strict';

/**
 * Pulls recent headlines for a ticker and scores their sentiment with a small
 * finance-tuned keyword lexicon. This is intentionally lightweight — it adds
 * colour and a small tilt to the score, it is not a substitute for reading the
 * news yourself.
 *
 * Source : Yahoo Finance headline RSS (keyless).
 * Demo   : a couple of canned neutral-to-positive headlines so the report has
 *          something to show offline.
 */

const DEMO = process.env.STOCK_DEMO === '1' || process.env.STOCK_DEMO === 'true';
const NEWS_TIMEOUT_MS = Number(process.env.STOCK_NEWS_TIMEOUT_MS || 12000);

const POSITIVE = [
  'beat', 'beats', 'surge', 'surges', 'soar', 'soars', 'rally', 'rallies',
  'record', 'high', 'upgrade', 'upgraded', 'outperform', 'buy', 'bullish',
  'growth', 'profit', 'profits', 'gain', 'gains', 'jump', 'jumps', 'strong',
  'raises', 'raised', 'boost', 'boosts', 'wins', 'win', 'approval', 'approved',
  'expansion', 'dividend', 'buyback', 'partnership', 'breakthrough',
];
const NEGATIVE = [
  'miss', 'misses', 'plunge', 'plunges', 'fall', 'falls', 'drop', 'drops',
  'slump', 'downgrade', 'downgraded', 'underperform', 'sell', 'bearish',
  'loss', 'losses', 'cut', 'cuts', 'warns', 'warning', 'lawsuit', 'probe',
  'investigation', 'recall', 'layoffs', 'weak', 'slowdown', 'default',
  'bankruptcy', 'fraud', 'decline', 'declines', 'slide', 'slides', 'fear',
];

async function fetchWithTimeout(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), NEWS_TIMEOUT_MS);
  try {
    return await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
          '(KHTML, like Gecko) Chrome/120.0 Safari/537.36',
        Accept: 'application/rss+xml,text/xml,*/*',
      },
    });
  } finally {
    clearTimeout(timer);
  }
}

/** Minimal RSS parse — pull <item> title/link pairs without a DOM dependency. */
function parseRss(xml, limit) {
  const items = [];
  const itemRe = /<item>([\s\S]*?)<\/item>/g;
  let m;
  while ((m = itemRe.exec(xml)) && items.length < limit) {
    const block = m[1];
    const title = extractTag(block, 'title');
    const link = extractTag(block, 'link');
    if (title) items.push({ title: decode(title), link: link || '' });
  }
  return items;
}

function extractTag(block, tag) {
  const re = new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`, 'i');
  const m = block.match(re);
  if (!m) return '';
  return m[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').trim();
}

function decode(s) {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");
}

/** Sentiment in [-1, 1] from a set of headlines using the keyword lexicon. */
function scoreSentiment(headlines) {
  if (!headlines.length) return 0;
  let score = 0;
  let hits = 0;
  for (const h of headlines) {
    const words = h.title.toLowerCase().split(/[^a-z]+/);
    for (const w of words) {
      if (POSITIVE.includes(w)) {
        score += 1;
        hits++;
      } else if (NEGATIVE.includes(w)) {
        score -= 1;
        hits++;
      }
    }
  }
  if (hits === 0) return 0;
  // Normalise into [-1, 1] with a gentle cap so one word doesn't dominate.
  return Math.max(-1, Math.min(1, score / Math.max(3, hits)));
}

function demoNews(ticker) {
  const headlines = [
    { title: `${ticker.name} beats quarterly estimates as growth accelerates`, link: '#' },
    { title: `Analysts raise ${ticker.name} price target on strong outlook`, link: '#' },
  ];
  return { headlines, sentiment: scoreSentiment(headlines) };
}

/**
 * Get up to `limit` headlines + a sentiment score for a ticker. Never throws.
 */
async function getNews(ticker, limit = 3) {
  if (DEMO) return demoNews(ticker);
  const regionByMarket = { AU: 'AU', IN: 'IN', INTL: 'US' };
  const langByMarket = { AU: 'en-AU', IN: 'en-IN', INTL: 'en-US' };
  const region = regionByMarket[ticker.market] || 'US';
  const lang = langByMarket[ticker.market] || 'en-US';
  const url =
    `https://feeds.finance.yahoo.com/rss/2.0/headline?s=${encodeURIComponent(ticker.yahoo)}` +
    `&region=${region}&lang=${lang}`;
  try {
    const res = await fetchWithTimeout(url);
    if (!res.ok) throw new Error(`news HTTP ${res.status}`);
    const xml = await res.text();
    const headlines = parseRss(xml, limit);
    return { headlines, sentiment: scoreSentiment(headlines) };
  } catch (err) {
    return { headlines: [], sentiment: 0 };
  }
}

module.exports = { getNews, scoreSentiment };
