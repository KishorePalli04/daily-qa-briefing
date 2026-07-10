'use strict';

const ind = require('./indicators');

/**
 * Turns raw price/news data for a single ticker into a transparent, weighted
 * "opportunity score" out of 100, plus the component breakdown and a
 * plain-English rationale.
 *
 * The philosophy: favour stocks in a healthy uptrend with positive momentum
 * that are NOT already over-extended (overbought), with confirming volume and
 * a supportive news tone. Every component is bounded to [0,1] and combined with
 * fixed weights so the score is explainable, never a black box.
 */

const WEIGHTS = {
  momentum: 25,
  trend: 20,
  rsi: 15,
  volume: 15,
  consistency: 15,
  news: 10,
};

const clamp01 = (x) => Math.max(0, Math.min(1, x));

function analyze(ticker, series, news) {
  const { closes, volumes, lastClose, prevClose } = series;

  const ret1d = prevClose ? ((lastClose - prevClose) / prevClose) * 100 : 0;
  const ret5d = ind.pctReturn(closes, 5);
  const ret20d = ind.pctReturn(closes, 20);
  const sma20 = ind.sma(closes, 20);
  const sma50 = ind.sma(closes, 50);
  const rsi = ind.rsi(closes, 14);
  const upFrac = ind.upDayFraction(closes, 20);
  const vol = ind.volatility(closes, 20);
  const volSurge = ind.volumeSurge(volumes, 20);
  const fromHigh = ind.pctFromHigh(closes, 60);

  // --- Component: momentum (blend of 5d and 20d returns) ---
  const blendedMom = 0.4 * (ret5d ?? 0) + 0.6 * (ret20d ?? 0);
  // Map roughly [-10%, +15%] -> [0, 1].
  const momentum = clamp01((blendedMom + 10) / 25);

  // --- Component: trend (stacked moving averages) ---
  let trend = 0;
  if (sma20 != null && lastClose > sma20) trend += 0.4;
  if (sma20 != null && sma50 != null && sma20 > sma50) trend += 0.3;
  if (sma50 != null && lastClose > sma50) trend += 0.3;

  // --- Component: RSI (reward healthy, penalise overbought/oversold) ---
  let rsiComp = 0.5;
  if (rsi != null) {
    if (rsi >= 78) rsiComp = 0.1; // dangerously overbought
    else if (rsi <= 28) rsiComp = 0.25; // oversold / falling knife
    else rsiComp = clamp01(1 - Math.abs(rsi - 58) / 30); // ideal band ~50-66
  }

  // --- Component: volume confirmation ---
  let volume = 0.5;
  if (volSurge != null) {
    volume = clamp01((volSurge - 0.6) / 1.4);
    if ((ret1d ?? 0) < 0) volume *= 0.5; // heavy volume on a down day is a warning
  }

  // --- Component: consistency (up-day fraction, lightly volatility-adjusted) ---
  let consistency = 0.5;
  if (upFrac != null) {
    consistency = clamp01(upFrac * 1.4);
    if (vol != null && vol > 4) consistency *= 0.85; // very choppy names get a haircut
  }

  // --- Component: news sentiment ([-1,1] -> [0,1]) ---
  const newsComp = clamp01((news.sentiment + 1) / 2);

  const components = {
    momentum,
    trend,
    rsi: rsiComp,
    volume,
    consistency,
    news: newsComp,
  };

  let score = 0;
  for (const key of Object.keys(WEIGHTS)) score += WEIGHTS[key] * components[key];
  score = Math.round(score * 10) / 10;

  return {
    ticker,
    score,
    components,
    metrics: {
      price: lastClose,
      ret1d,
      ret5d,
      ret20d,
      sma20,
      sma50,
      rsi,
      volSurge,
      fromHigh,
      volatility: vol,
    },
    news,
    rationale: buildRationale({ ret5d, ret20d, rsi, trend, volSurge, ret1d }, news, components),
    signal: labelFor(score),
  };
}

function labelFor(score) {
  if (score >= 70) return 'Strong Buy';
  if (score >= 60) return 'Buy';
  if (score >= 50) return 'Accumulate';
  if (score >= 40) return 'Hold';
  return 'Watch';
}

function buildRationale(m, news, c) {
  const reasons = [];
  if (m.ret20d != null && m.ret20d > 3)
    reasons.push(`up ${m.ret20d.toFixed(1)}% over the last month`);
  else if (m.ret5d != null && m.ret5d > 2)
    reasons.push(`${m.ret5d.toFixed(1)}% higher over the past week`);

  if (c.trend >= 0.7) reasons.push('trading above its 20- & 50-day averages (clean uptrend)');
  else if (c.trend >= 0.4) reasons.push('holding above its 20-day average');

  if (m.rsi != null) {
    if (m.rsi >= 78) reasons.push(`RSI ${m.rsi.toFixed(0)} — overbought, so watch for a pullback`);
    else if (m.rsi >= 50 && m.rsi < 70)
      reasons.push(`RSI ${m.rsi.toFixed(0)} shows healthy momentum with room to run`);
    else if (m.rsi <= 30) reasons.push(`RSI ${m.rsi.toFixed(0)} — oversold, a possible bounce candidate`);
  }

  if (m.volSurge != null && m.volSurge > 1.3 && (m.ret1d ?? 0) >= 0)
    reasons.push(`volume ${m.volSurge.toFixed(1)}× its average, confirming buyer interest`);

  if (news.sentiment > 0.2) reasons.push('recent headlines skew positive');
  else if (news.sentiment < -0.2) reasons.push('recent headlines skew negative — caution');

  if (!reasons.length) reasons.push('mixed signals — no strong edge today');
  const text = reasons.join('; ');
  return text.charAt(0).toUpperCase() + text.slice(1) + '.';
}

/**
 * Analyse every ticker for which we have data, then rank.
 * `results` is [{ ticker, series, news }].
 */
function rank(results) {
  const analysed = results
    .filter((r) => r.series && r.series.closes && r.series.closes.length >= 30)
    .map((r) => analyze(r.ticker, r.series, r.news));

  const byScore = (a, b) => b.score - a.score;
  const sorted = [...analysed].sort(byScore);

  return {
    all: sorted,
    top: sorted.slice(0, 6),
    australian: sorted.filter((a) => a.ticker.market === 'AU').slice(0, 8),
    international: sorted.filter((a) => a.ticker.market === 'INTL').slice(0, 8),
    generatedAt: new Date().toISOString(),
    universeCount: results.length,
    analysedCount: analysed.length,
  };
}

module.exports = { analyze, rank, WEIGHTS };
