# 📈 Daily Stock Picks

An automated, news-aware technical screener that scans a universe of
**Australian (ASX)** and **international** stocks every weekday, ranks them by a
transparent opportunity score, and emails you a self-contained HTML report of
the best picks for the day.

> ⚠️ **Not financial advice.** This is an educational technical screen — not a
> recommendation to buy or sell. Always do your own research.

---

## What it does

1. **Fetches** ~3 months of daily price/volume history for every stock in the
   universe (`stock-report/universe.js`) and recent news headlines.
2. **Analyses** each stock with a set of technical indicators (moving averages,
   RSI, momentum, volume surge, consistency) plus keyword-based news sentiment.
3. **Scores & ranks** them into *Top Picks*, *Australian Picks*, and
   *International Picks*.
4. **Renders** a dark-themed HTML report (`test-results/reports/daily-stock-report.html`)
   and a JSON snapshot next to it.
5. **Emails** it to you daily via GitHub Actions.

---

## The scoring model

Each stock gets a score out of 100 from six **transparent, fixed-weight**
components (the coloured bar under each score in the report shows the split):

| Component | Weight | What it rewards |
|---|---|---|
| **Momentum** | 25 | Positive 5-day & 20-day price returns |
| **Trend** | 20 | Price above its 20- and 50-day moving averages (clean uptrend) |
| **RSI health** | 15 | Healthy momentum (RSI ~50–66); penalises overbought (>78) & oversold |
| **Volume** | 15 | Above-average volume confirming up-moves |
| **Consistency** | 15 | High fraction of up-days, adjusted for choppiness |
| **News** | 10 | Positive tone in recent headlines |

Signal labels: `Strong Buy` ≥70, `Buy` ≥60, `Accumulate` ≥50, `Hold` ≥40,
`Watch` below.

---

## Run it locally

```bash
# Offline preview with deterministic synthetic data (no network needed):
npm run stocks:demo

# Live run against Yahoo Finance / stooq (needs internet access):
npm run stocks

# Open the report:
open test-results/reports/daily-stock-report.html
```

### Environment variables

| Var | Default | Purpose |
|---|---|---|
| `STOCK_DEMO` | `0` | `1` = synthetic offline data |
| `STOCK_CONCURRENCY` | `6` | Parallel fetches |
| `STOCK_FETCH_TIMEOUT_MS` | `15000` | Per-request price timeout |
| `STOCK_NEWS_TIMEOUT_MS` | `12000` | Per-request news timeout |

---

## Automation (GitHub Actions)

`.github/workflows/daily-stock-report.yml` runs the pipeline **21:30 UTC on
weekdays (≈ 07:30 AEST)** — after the US close and before the ASX open — then
emails the report and uploads it as an artifact.

### Required repository secrets (Gmail SMTP)

These are the **same secrets** used by the existing daily-briefing workflow, so
if that email already works, this one will too:

| Secret | Description |
|---|---|
| `SMTP_USERNAME` | Gmail address used to send |
| `SMTP_PASSWORD` | Gmail **app password** (not your login password) |
| `MAIL_FROM` | From address |
| `EMAIL_TO` | Where to deliver the report |

Trigger it manually any time from **Actions → Daily Stock Picks → Run workflow**
(optionally with the *demo* input).

---

## Data sources

- **Prices:** Yahoo Finance chart API (keyless), with a stooq.com CSV fallback.
- **News:** Yahoo Finance headline RSS (keyless).

No API keys are required. If a symbol can't be priced it's skipped without
failing the run.

---

## Extending the universe

Add or remove tickers in `stock-report/universe.js`. Australian symbols use the
`.AX` (ASX) suffix for Yahoo and `.au` for stooq; international symbols use their
plain Yahoo symbol.
