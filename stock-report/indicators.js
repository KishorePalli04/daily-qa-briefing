'use strict';

/**
 * Pure technical-analysis helpers. Every function takes plain arrays of
 * numbers (oldest -> newest) and returns a number or null when there isn't
 * enough history to compute a meaningful value.
 */

/** Simple moving average of the last `period` values. */
function sma(values, period) {
  if (!values || values.length < period) return null;
  const slice = values.slice(-period);
  return slice.reduce((a, b) => a + b, 0) / period;
}

/** Percentage return over the last `period` closes (e.g. 5 -> 5-day momentum). */
function pctReturn(closes, period) {
  if (!closes || closes.length <= period) return null;
  const past = closes[closes.length - 1 - period];
  const now = closes[closes.length - 1];
  if (!past) return null;
  return ((now - past) / past) * 100;
}

/**
 * Wilder's 14-day Relative Strength Index.
 * Returns a value in [0, 100]; null if there isn't enough data.
 */
function rsi(closes, period = 14) {
  if (!closes || closes.length < period + 1) return null;
  let gains = 0;
  let losses = 0;
  // Seed with the first `period` changes.
  for (let i = closes.length - period; i < closes.length; i++) {
    const change = closes[i] - closes[i - 1];
    if (change >= 0) gains += change;
    else losses -= change;
  }
  let avgGain = gains / period;
  let avgLoss = losses / period;
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - 100 / (1 + rs);
}

/** Fraction of up-days over the last `period` closes (a proxy for consistency). */
function upDayFraction(closes, period = 20) {
  if (!closes || closes.length < period + 1) return null;
  let up = 0;
  for (let i = closes.length - period; i < closes.length; i++) {
    if (closes[i] > closes[i - 1]) up++;
  }
  return up / period;
}

/** Annualised-ish volatility proxy: stdev of daily returns over `period`. */
function volatility(closes, period = 20) {
  if (!closes || closes.length < period + 1) return null;
  const rets = [];
  for (let i = closes.length - period; i < closes.length; i++) {
    rets.push((closes[i] - closes[i - 1]) / closes[i - 1]);
  }
  const mean = rets.reduce((a, b) => a + b, 0) / rets.length;
  const variance = rets.reduce((a, b) => a + (b - mean) ** 2, 0) / rets.length;
  return Math.sqrt(variance) * 100;
}

/** Ratio of the latest volume to the average volume over `period`. */
function volumeSurge(volumes, period = 20) {
  if (!volumes || volumes.length < period + 1) return null;
  const recent = volumes.slice(-period - 1, -1);
  const avg = recent.reduce((a, b) => a + b, 0) / recent.length;
  if (!avg) return null;
  return volumes[volumes.length - 1] / avg;
}

/** Distance (in %) of the latest close from the highest close over `period`. */
function pctFromHigh(closes, period = 60) {
  if (!closes || closes.length < 2) return null;
  const slice = closes.slice(-period);
  const high = Math.max(...slice);
  const now = closes[closes.length - 1];
  if (!high) return null;
  return ((now - high) / high) * 100;
}

module.exports = {
  sma,
  pctReturn,
  rsi,
  upDayFraction,
  volatility,
  volumeSurge,
  pctFromHigh,
};
