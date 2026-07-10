'use strict';

const { WEIGHTS } = require('./analyzer');

/**
 * Renders the ranked analysis into a self-contained, email-friendly HTML report.
 * Dark theme, colour-coded gains/losses, one hero row of top picks, then
 * Australian and international tables, each pick expandable with rationale and
 * a headline. Ends with a methodology note and a not-financial-advice
 * disclaimer.
 */

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function fmtPrice(currency, price) {
  if (price == null) return '—';
  return `${currency}${price.toFixed(2)}`;
}

function pct(v, digits = 1) {
  if (v == null) return '—';
  const sign = v > 0 ? '+' : '';
  return `${sign}${v.toFixed(digits)}%`;
}

function colorFor(v) {
  if (v == null) return '#8b949e';
  if (v > 0) return '#3fb950';
  if (v < 0) return '#f85149';
  return '#8b949e';
}

function scoreColor(score) {
  if (score >= 70) return '#3fb950';
  if (score >= 60) return '#56d364';
  if (score >= 50) return '#d29922';
  if (score >= 40) return '#e3b341';
  return '#8b949e';
}

function heroCard(a, rank) {
  const t = a.ticker;
  const m = a.metrics;
  return `
    <td class="hero-cell">
      <div class="hero-card">
        <div class="hero-rank">#${rank}</div>
        <div class="hero-sym">${esc(t.yahoo)}</div>
        <div class="hero-name">${esc(t.name)}</div>
        <div class="hero-score" style="color:${scoreColor(a.score)}">${a.score}<span>/100</span></div>
        <div class="hero-signal" style="background:${scoreColor(a.score)}">${esc(a.signal)}</div>
        <div class="hero-meta">
          <span>${fmtPrice(t.currency, m.price)}</span>
          <span style="color:${colorFor(m.ret1d)}">${pct(m.ret1d)}</span>
        </div>
        <div class="hero-flag">${t.market === 'AU' ? '🇦🇺 Australia' : '🌏 International'}</div>
      </div>
    </td>`;
}

function scoreBar(a) {
  // Stacked contribution bar so the reader can see WHY the score is what it is.
  const segs = Object.keys(WEIGHTS)
    .map((k) => {
      const contribution = WEIGHTS[k] * a.components[k];
      const colors = {
        momentum: '#58a6ff',
        trend: '#3fb950',
        rsi: '#bc8cff',
        volume: '#d29922',
        consistency: '#39c5cf',
        news: '#f778ba',
      };
      const w = (contribution / 100) * 100;
      if (w < 0.5) return '';
      return `<span class="seg" style="width:${w}%;background:${colors[k]}" title="${k}: ${contribution.toFixed(1)}"></span>`;
    })
    .join('');
  return `<div class="scorebar">${segs}</div>`;
}

function row(a) {
  const t = a.ticker;
  const m = a.metrics;
  const headline = a.news.headlines[0];
  const headlineHtml = headline
    ? `<a class="news" href="${esc(headline.link)}" target="_blank" rel="noopener">📰 ${esc(headline.title)}</a>`
    : '';
  return `
    <tr>
      <td class="c-sym">
        <div class="sym">${esc(t.yahoo)}</div>
        <div class="nm">${esc(t.name)}</div>
      </td>
      <td class="c-score">
        <div class="score-val" style="color:${scoreColor(a.score)}">${a.score}</div>
        <div class="signal" style="color:${scoreColor(a.score)}">${esc(a.signal)}</div>
        ${scoreBar(a)}
      </td>
      <td class="c-num">${fmtPrice(t.currency, m.price)}</td>
      <td class="c-num" style="color:${colorFor(m.ret1d)}">${pct(m.ret1d)}</td>
      <td class="c-num" style="color:${colorFor(m.ret5d)}">${pct(m.ret5d)}</td>
      <td class="c-num" style="color:${colorFor(m.ret20d)}">${pct(m.ret20d)}</td>
      <td class="c-num">${m.rsi != null ? m.rsi.toFixed(0) : '—'}</td>
      <td class="c-why">
        <div class="rationale">${esc(a.rationale)}</div>
        ${headlineHtml}
      </td>
    </tr>`;
}

function table(title, subtitle, rows) {
  return `
    <h2>${title} <span class="h2-sub">${subtitle}</span></h2>
    <div class="table-wrap">
      <table class="picks">
        <thead>
          <tr>
            <th>Stock</th><th>Score</th><th>Price</th><th>1D</th>
            <th>1W</th><th>1M</th><th>RSI</th><th>Why it made the list</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}

function generateHTML(ranked) {
  const date = new Date().toLocaleDateString('en-AU', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Australia/Sydney',
  });
  const time = new Date().toLocaleTimeString('en-AU', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Australia/Sydney',
  });

  const heroRow = ranked.top
    .slice(0, 5)
    .map((a, i) => heroCard(a, i + 1))
    .join('');

  const auRows = ranked.australian.map(row).join('') || emptyRow();
  const intlRows = ranked.international.map(row).join('') || emptyRow();

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Daily Stock Picks — ${date}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
         background: #0d1117; color: #c9d1d9; padding: 1.5rem; line-height: 1.45; }
  .wrap { max-width: 1100px; margin: 0 auto; }
  h1 { color: #f0f6fc; font-size: 1.7rem; }
  .accent { color: #58a6ff; }
  .subtitle { color: #8b949e; font-size: .9rem; margin: .35rem 0 1.5rem; }
  h2 { color: #f0f6fc; font-size: 1.15rem; margin: 2rem 0 .9rem;
       border-bottom: 1px solid #30363d; padding-bottom: .5rem; }
  .h2-sub { color: #8b949e; font-size: .8rem; font-weight: 400; }
  .hero { width: 100%; border-collapse: separate; border-spacing: 10px 0; }
  .hero-cell { width: 20%; vertical-align: top; }
  .hero-card { background: linear-gradient(160deg,#161b22,#1c2230);
    border: 1px solid #30363d; border-radius: 12px; padding: 1rem .85rem; text-align: center; }
  .hero-rank { color: #6e7681; font-size: .7rem; font-weight: 700; letter-spacing: .05em; }
  .hero-sym { color: #f0f6fc; font-size: 1.15rem; font-weight: 700; margin-top: .2rem; }
  .hero-name { color: #8b949e; font-size: .72rem; height: 2.1em; overflow: hidden; margin-bottom: .5rem; }
  .hero-score { font-size: 1.9rem; font-weight: 800; line-height: 1; }
  .hero-score span { font-size: .8rem; color: #6e7681; font-weight: 500; }
  .hero-signal { display: inline-block; color: #0d1117; font-weight: 700; font-size: .68rem;
    padding: .12rem .5rem; border-radius: 20px; margin: .5rem 0; }
  .hero-meta { display: flex; justify-content: center; gap: .6rem; font-size: .82rem; font-weight: 600; }
  .hero-flag { color: #6e7681; font-size: .68rem; margin-top: .45rem; }
  .table-wrap { overflow-x: auto; }
  table.picks { width: 100%; border-collapse: collapse; font-size: .82rem; min-width: 720px; }
  table.picks th { text-align: left; color: #8b949e; font-weight: 600; font-size: .72rem;
    text-transform: uppercase; letter-spacing: .03em; padding: .5rem .55rem; border-bottom: 1px solid #30363d; }
  table.picks td { padding: .6rem .55rem; border-bottom: 1px solid #21262d; vertical-align: top; }
  .c-sym .sym { color: #58a6ff; font-weight: 700; }
  .c-sym .nm { color: #8b949e; font-size: .72rem; }
  .c-num { text-align: right; white-space: nowrap; font-variant-numeric: tabular-nums; }
  .c-score { width: 150px; }
  .score-val { font-weight: 800; font-size: 1.05rem; display: inline-block; }
  .signal { font-size: .68rem; font-weight: 600; display: inline-block; margin-left: .4rem; }
  .scorebar { display: flex; height: 5px; border-radius: 3px; overflow: hidden;
    background: #21262d; margin-top: .35rem; }
  .scorebar .seg { display: block; height: 100%; }
  .c-why { max-width: 340px; }
  .rationale { color: #c9d1d9; font-size: .78rem; }
  .news { display: inline-block; margin-top: .35rem; color: #8b949e; font-size: .72rem;
    text-decoration: none; }
  .news:hover { color: #58a6ff; text-decoration: underline; }
  .legend { display: flex; flex-wrap: wrap; gap: .8rem; font-size: .72rem; color: #8b949e; margin: .6rem 0 0; }
  .legend span::before { content: ''; display: inline-block; width: 10px; height: 10px;
    border-radius: 2px; margin-right: .3rem; vertical-align: middle; }
  .lg-momentum::before { background: #58a6ff; }
  .lg-trend::before { background: #3fb950; }
  .lg-rsi::before { background: #bc8cff; }
  .lg-volume::before { background: #d29922; }
  .lg-consistency::before { background: #39c5cf; }
  .lg-news::before { background: #f778ba; }
  .method { background: #161b22; border: 1px solid #30363d; border-radius: 10px;
    padding: 1rem 1.2rem; margin-top: 2rem; font-size: .8rem; color: #8b949e; }
  .method b { color: #c9d1d9; }
  .disclaimer { border: 1px solid #6e4a00; background: #1a1400; color: #d29922;
    border-radius: 10px; padding: .9rem 1.1rem; margin-top: 1.2rem; font-size: .78rem; }
  .footer { text-align: center; color: #6e7681; font-size: .75rem; margin-top: 2rem; }
  @media (max-width: 720px) {
    .hero, .hero-cell { display: block; width: 100%; }
    .hero-cell { margin-bottom: 10px; }
  }
</style>
</head>
<body>
  <div class="wrap">
    <h1>📈 Daily Stock Picks <span class="accent">Briefing</span></h1>
    <p class="subtitle">
      ${esc(date)} · ${esc(time)} AEST &nbsp;|&nbsp;
      Scanned ${ranked.analysedCount}/${ranked.universeCount} stocks (Australian + International)
      &nbsp;|&nbsp; News-aware technical ranking
    </p>

    <h2>⭐ Today's Top Picks <span class="h2-sub">highest opportunity scores across all markets</span></h2>
    <table class="hero"><tr>${heroRow}</tr></table>
    <div class="legend">
      Score drivers:
      <span class="lg-momentum">Momentum</span>
      <span class="lg-trend">Trend</span>
      <span class="lg-rsi">RSI health</span>
      <span class="lg-volume">Volume</span>
      <span class="lg-consistency">Consistency</span>
      <span class="lg-news">News</span>
    </div>

    ${table('🇦🇺 Australian Picks (ASX)', 'top ranked ASX-listed names', auRows)}
    ${table('🌏 International Picks', 'top ranked global names', intlRows)}

    <div class="method">
      <b>How the score works.</b> Each stock is scored out of 100 from six weighted,
      fully transparent components: momentum (${WEIGHTS.momentum}), trend vs 20/50-day
      moving averages (${WEIGHTS.trend}), RSI health — rewarding healthy momentum and
      penalising overbought names (${WEIGHTS.rsi}), volume confirmation (${WEIGHTS.volume}),
      consistency of up-days (${WEIGHTS.consistency}), and recent news sentiment (${WEIGHTS.news}).
      The coloured bar under each score shows how much each factor contributed. Data is daily
      OHLCV over the trailing ~3 months; headlines are scored with a finance keyword lexicon.
    </div>

    <div class="disclaimer">
      ⚠️ <b>Not financial advice.</b> This is an automated, educational technical screen — not a
      recommendation to buy or sell. It does not account for your circumstances, fundamentals,
      valuation, or risk tolerance. Prices and news may be delayed or inaccurate. Always do your
      own research and consider a licensed financial adviser before investing.
    </div>

    <p class="footer">
      Generated automatically by the Daily Stock Picks pipeline · Data: Yahoo Finance / stooq
      · Runs every weekday via GitHub Actions
    </p>
  </div>
</body>
</html>`;
}

function emptyRow() {
  return `<tr><td colspan="8" style="color:#8b949e;padding:1rem;text-align:center">No data available today.</td></tr>`;
}

module.exports = { generateHTML };
