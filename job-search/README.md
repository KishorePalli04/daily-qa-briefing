# Job Search — Kishore Palli (Australia)

Daily curated job briefings for a Senior Automation Engineer targeting the Australian market.

## What this is (and isn't)
- ✅ **Is:** a daily, curated, deduped shortlist of matching live roles across the major AU job boards, with direct pre-filtered apply links, plus tailored application materials on request.
- ❌ **Isn't:** an auto-apply bot. Applications are submitted by Kishore himself (portals require his login, block automation, and each application should be reviewed). This keeps accounts safe and applications tailored — which is what actually gets interviews.

## Layout
```
job-search/
├── PROFILE.md            # Candidate profile + targeting/filters (edit to retune the briefing)
├── README.md             # This file
├── APPLICATIONS.md       # Running tracker of what was applied to + status
└── briefings/
    └── YYYY-MM-DD.md      # One briefing per day
```

## Daily process
Each morning: search Seek / Indeed / LinkedIn / Glassdoor / Jobgether across the four target
categories (Sydney senior automation, contract/day-rate, Test/QA Lead, remote/hybrid AU-wide),
filter to genuine matches per `PROFILE.md`, dedupe against prior briefings, and write a new
`briefings/YYYY-MM-DD.md`.

## How to retune
Edit `PROFILE.md` (targeting, filters, tailoring notes). Or just tell Claude in chat —
"add insurance domain", "drop contracts", "only Sydney" — and the next briefing reflects it.
