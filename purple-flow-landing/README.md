# Purple Flow — Frozen Yogurt & Acai Landing Site

A vibrant, conversion-optimized, single-page marketing site for **Purple Flow
Frozen Yogurt and Acai** in Strathfield, Sydney. Built to drive online orders
and foot traffic, with a mobile-first layout since most local customers search
on their phones.

## Stack

- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS v4** — custom `brand-*` purple palette defined in
  `src/app/globals.css`
- **lucide-react** — icons

## Page structure (`src/app/page.tsx`)

1. **Sticky navigation** — logo/name, in-page anchor links, prominent
   "Order Now" CTA, and a responsive hamburger menu on mobile.
2. **Hero** — headline emphasising *Lovely Flavours* and *Fresh Fruit
   Toppings*, with dual "Order Collection" / "Order Delivery" CTAs and a
   4.7-star Google badge.
3. **Our Treats** — Frozen Yogurt, Acai Bowls, Fresh Fruit Toppings.
4. **Reviews** — real customer testimonials for social proof.
5. **Why Choose Us** — great variety, fresh ingredients, generous portions,
   excellent value, plus a closing CTA banner.
6. **Location & hours footer** — Strathfield Plaza address, opening note
   (Sundays from 11:00 AM), Google Maps embed, and a 4.7-star rating.

## Customising

- **Order links:** update `ORDER_URL` at the top of `src/app/page.tsx` to point
  at your preferred ordering platform (e.g. Uber Eats, DoorDash, or a booking
  page).
- **Map:** `MAPS_EMBED_SRC` uses Google Maps' keyless embed for the store
  address. Swap it for a "Share → Embed a map" iframe link from Google Maps if
  you'd like a custom pin.
- **Brand colours:** edit the `--color-brand-*` tokens in
  `src/app/globals.css`.

## Local development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
```
