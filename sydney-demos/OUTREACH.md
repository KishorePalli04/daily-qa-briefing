# Sydney Small-Business Website Outreach — Pilot Batch

10 real Sydney businesses, verified (July 2026) as having **no dedicated website** — only
Facebook pages, Instagram, and/or directory/booking listings. A concept demo site has been
built for each one, ready to host and pitch.

## 1. Deploy the demos (one step, ~30 seconds)

The Netlify project **`sydney-concept-demos`** already exists in your Netlify account
(team: KishorePalli04). The sandbox this was built in blocks direct uploads, so run this
from your own machine in the repo root:

```bash
npx netlify-cli deploy --prod --dir sydney-demos/dist --site sydney-concept-demos
```

(First run: `npx netlify-cli login`.) Regenerate pages any time with
`node sydney-demos/generate.js`.

Review index (all 10 links): **https://sydney-concept-demos.netlify.app/**
All pages carry a "CONCEPT DEMO — not the official website" banner, a footer disclaimer
with a takedown promise, and `noindex` so they never appear in search results.

## 2. The roster

| # | Business | Niche | Suburb | Demo URL | Best contact channel |
|---|----------|-------|--------|----------|---------------------|
| 1 | King Crown Barbers | Barber | Greystanes | https://sydney-concept-demos.netlify.app/king-crown-barbers/ | FB: facebook.com/Clean.Cut.Hair.Greystanes.Shopping · (02) 8677 1799 |
| 2 | Barberiko Barbershop | Barber | North Sydney | https://sydney-concept-demos.netlify.app/barberiko/ | FB: facebook.com/BarberikoNorthSydney · (02) 8590 4485 |
| 3 | Central Barber Shop Sydney | Barber | Surry Hills | https://sydney-concept-demos.netlify.app/central-barber-shop/ | FB: facebook.com/sydneycentralstationbarbershop |
| 4 | Tony's Barber Shop | Barber | Dee Why | https://sydney-concept-demos.netlify.app/tonys-barber-shop/ | FB: facebook.com/p/Tonys-Barber-Shop-100064299841049 · (02) 9982 3436 |
| 5 | Modern Nails Bankstown | Nails | Bankstown | https://sydney-concept-demos.netlify.app/modern-nails/ | **Email: nailspamodern@gmail.com** (Gmail draft prepared) · 0451 818 077 |
| 6 | Luxe Nails & Spa | Nails | Bankstown | https://sydney-concept-demos.netlify.app/luxe-nails/ | FB: facebook.com/luxenails.bankstown · (02) 8747 5973 |
| 7 | Nail Central | Nails | Bankstown | https://sydney-concept-demos.netlify.app/nail-central/ | FB: facebook.com/NailCentralBankstown · (02) 9793 9245 |
| 8 | Nail Pro Fairfield | Nails | Fairfield | https://sydney-concept-demos.netlify.app/nail-pro/ | FB: facebook.com/nailpro.fairfield · IG @nailpro.fairfield |
| 9 | GMR Mechanical Repairs | Mechanic | Penrith | https://sydney-concept-demos.netlify.app/gmr-mechanical/ | FB: facebook.com/p/GMR-Mechanical-Repairs-100063520454250 |
| 10 | VP Auto Mobile Mechanic | Mechanic | Penrith / Emu Plains | https://sydney-concept-demos.netlify.app/vp-auto/ | FB: facebook.com/vpautomobile · 0425 150 833 |

## 3. Pitch messages (copy-paste, personalise the [bracketed] bits)

Send these yourself — under Australia's **Spam Act 2003**, commercial electronic messages
need consent or a relevant published business address, must identify you as the sender,
and must offer a way to opt out. Messaging a business's public page about a service
relevant to that business is standard practice, but keep it personal, one message, no
follow-up spam. Phone or walk-in works even better for shops.

### Template A — Facebook Messenger (short)

> Hi! I'm [name], a web developer based in Sydney. I noticed [Business] doesn't have its
> own website — so as a working example, I went ahead and designed one for you:
>
> [demo link]
>
> It's just a mockup (not live to the public or on Google) — your name, hours and services
> are from your public listings, so tell me if anything's wrong and I'll fix or remove it.
> If you like it, I can have it live on your own domain (e.g. [business].com.au) in a few
> days, typically for [$X setup + $Y/yr hosting]. No pressure either way — and if you'd
> rather I take the demo down, just say the word. Cheers, [name] [phone]

### Template B — Email (Modern Nails; a draft is already in your Gmail)

Subject: **A website mockup I made for Modern Nails Bankstown**

> Hi Modern Nails team,
>
> My name is [name] — I'm a Sydney web developer. Your nail work gets great feedback
> around Bankstown, but I noticed you don't have a website of your own, just the Facebook
> page. Customers searching "nails Bankstown" are mostly finding your competitors.
>
> Rather than send a sales brochure, I built you a working mockup so you can see exactly
> what you'd get: https://sydney-concept-demos.netlify.app/modern-nails/
>
> It's a private concept page (hidden from Google, clearly marked as a demo). The details
> on it come from your public listings — happy to correct anything, or take it down
> entirely if you'd prefer.
>
> If you like the direction, I can register your own domain, connect your booking and
> Instagram, and have it live within a week — typically [$X setup + $Y/yr]. Reply here or
> text me on [phone]; and if you'd rather not hear from me again, just reply "no thanks"
> and that's the end of it.
>
> [name]
> [phone]

### Per-business opening lines (swap into either template)

1. **King Crown** — "Your fades get talked about in the Greystanes community groups, but there's no site for people to find you — only Fresha."
2. **Barberiko** — "You're two minutes from North Sydney station with thousands of office workers googling 'barber north sydney' — and no website of yours comes up."
3. **Central Barber Shop** — "Two locations and no website — 'barber near Central Station' is a search you should own."
4. **Tony's** — "A 7am Saturday open is a genuine edge on the northern beaches — a website would let you show it to everyone searching 'barber dee why'."
5. **Modern Nails** — (email above)
6. **Luxe Nails** — "Bankstown Central foot traffic finds you; Google traffic doesn't — 'nails bankstown' currently sends people elsewhere."
7. **Nail Central** — "You offer far more than nails — lashes, waxing, IPL — but none of it is findable outside the centre directory."
8. **Nail Pro** — "Your Instagram sets deserve more than a Bookwell listing — a one-page site would tie it all together."
9. **GMR** — "Your reviews say 'honest mechanic' — exactly what people search Penrith for, and right now that search can't find you."
10. **VP Auto** — "A mobile mechanic lives on being findable — 'mobile mechanic penrith' should be your phone ringing."

## 4. Ground rules baked into the demos

- Sticky banner + footer on every page: concept mockup, **not** the official site.
- `noindex, nofollow` — invisible to search engines.
- All business details compiled from public listings; each page promises corrections or
  immediate takedown on request. Honour that promise.
- One outreach message per business, always with an opt-out. If they say no, delete the
  demo directory and redeploy.
