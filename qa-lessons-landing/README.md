# 🎓 TestCraft Academy — QA & Automation Lessons Landing Page

A **3D floating landing page** for offering QA / test-automation lessons to
students, built from Kishore Palli's résumé (ISTQB-certified Senior Automation
Engineer, 12 years' experience).

> Single self-contained file: **[`index.html`](index.html)** — no build step, no
> dependencies. Open it in any browser.

---

## ✨ What's inside

| Section | Highlights |
|---|---|
| **Hero** | 3D floating card cluster (mentor card + tech chips + ISTQB badge) with mouse-driven parallax and gentle bob animation |
| **Skills marquee** | Auto-scrolling belt of the real tools from the résumé (Playwright, Selenium, REST Assured, Appium, GitHub Actions…) |
| **Curriculum** | Six project-based tracks with 3D tilt-on-hover cards |
| **Mentor** | Credentials pulled straight from the résumé (ISTQB, UFT One, banking/CRM/broadcasting experience) |
| **How it works** | 4-step path from free intro call to landing a role |
| **Pricing** | Self-Paced / Live Cohort / 1:1 Mentoring plans |
| **FAQ** | Accordion of common student questions |
| **Enroll** | Email capture (front-end validation demo) + CTA |

## 🎨 Design & tech

- **Pure HTML + CSS + vanilla JS** — everything inlined in one file.
- **3D effects** via CSS `perspective` / `transform-style: preserve-3d`, with
  `requestAnimationFrame` mouse parallax on the hero and tilt on curriculum cards.
- **Animated cosmic backdrop** — drifting gradient blobs + generated starfield.
- **Glassmorphism** cards, gradient accents (cyan → violet → teal).
- **Responsive** down to mobile; **respects `prefers-reduced-motion`** (all
  animation disabled for users who ask for it).
- **Accessible**: semantic sections, labelled form input, keyboard-friendly nav.

## 🚀 Usage

```bash
# Just open it
open qa-lessons-landing/index.html      # macOS
xdg-open qa-lessons-landing/index.html  # Linux
```

The signup form is a front-end demo only — wire the `submit` handler in
`index.html` to your email provider (SendGrid, Mailchimp, a form service, etc.)
to collect real leads.

> ℹ️ *TestCraft Academy* is a presentational brand for this landing page; the
> mentor content is based on Kishore Palli's résumé.
