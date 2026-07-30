# The Dog Exorcist Dog Behaviourist — Landing Page

A modern, responsive, single-file landing page for **The Dog Exorcist Dog Behaviourist** —
expert dog training, behaviour modification, and grooming.

**Rating:** 5.0 ★ (14 reviews) · **Phone:** [0432 750 250](tel:0432750250)

## Features

- **Hero section** — headline, 5.0-star social-proof badge, dual CTAs (click-to-call + book a consultation)
- **Services grid** — dog training, behaviour modification, bath/blow dry/brush, ear cleaning
- **Why Choose Us** — compassionate, structured, results-driven approach for all sizes and temperaments
- **Testimonial carousel** — auto-rotating client reviews with dots and arrow controls
- **Contact section** — clickable phone link, weekly hours (today's row auto-highlighted), quick inquiry form
- Fully responsive (desktop → mobile), dark charcoal + warm white + amber/gold palette, Outfit + Inter typography

## Tech

Plain HTML, CSS, and vanilla JavaScript in a single `index.html` — no build step, no dependencies
(only Google Fonts loaded externally).

## Run locally

Open `index.html` in a browser, or serve it:

```bash
python3 -m http.server 8000
# → http://localhost:8000
```

## Notes

- The inquiry form is front-end only; wire it to a backend or a form service (Formspree, Netlify Forms, etc.) to receive submissions.
- Opening hours in the contact section are placeholders — update them to the real schedule.
