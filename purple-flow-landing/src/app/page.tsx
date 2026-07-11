"use client";

import { useState } from "react";
import {
  Star,
  MapPin,
  Clock,
  Truck,
  ShoppingBag,
  Leaf,
  Sparkles,
  Heart,
  Menu,
  X,
  Quote,
  IceCream,
  Grape,
  Wallet,
} from "lucide-react";

const NAV_LINKS = [
  { href: "#menu", label: "Our Treats" },
  { href: "#reviews", label: "Reviews" },
  { href: "#why-us", label: "Why Us" },
  { href: "#visit", label: "Visit Us" },
];

const REVIEWS = [
  {
    quote: "Lovely flavours and fresh fruit toppings, great service",
    author: "Google Review",
  },
  {
    quote: "So good, love the flavours and variety of toppings!",
    author: "Google Review",
  },
  {
    quote:
      "Good variety of toppings & good flavours. Priced well for the portions",
    author: "Google Review",
  },
];

const FEATURES = [
  {
    icon: Grape,
    title: "Great Variety",
    body: "A rotating line-up of frozen yoghurt flavours and acai bowls with a huge selection of toppings to build your perfect cup.",
  },
  {
    icon: Leaf,
    title: "Fresh Ingredients",
    body: "Real fresh fruit and quality toppings prepared daily — the kind of freshness you can see and taste in every spoonful.",
  },
  {
    icon: Heart,
    title: "Generous Portions",
    body: "We don't skimp. Every serve is piled high so you get plenty to enjoy and plenty to share.",
  },
  {
    icon: Wallet,
    title: "Excellent Value",
    body: "Priced well for the portions. Treat yourself without the guilt — great taste that's kind on your wallet.",
  },
];

const OFFERINGS = [
  {
    icon: IceCream,
    title: "Frozen Yogurt",
    body: "Smooth, creamy and refreshing swirls in a range of lovely flavours — self-serve your favourite.",
  },
  {
    icon: Grape,
    title: "Acai Bowls",
    body: "Thick, antioxidant-rich acai blends topped with granola, fruit and all the good stuff.",
  },
  {
    icon: Sparkles,
    title: "Fresh Fruit Toppings",
    body: "Strawberries, mango, blueberries and more — piled on fresh to finish your treat just right.",
  },
];

const ORDER_URL =
  "https://www.google.com/maps/search/Purple+Flow+Frozen+Yogurt+and+Acai+Strathfield";
const MAPS_EMBED_SRC =
  "https://maps.google.com/maps?q=Purple%20Flow%20Frozen%20Yogurt%20and%20Acai%20Strathfield%20Plaza%20Shop%206%2F11%20The%20Boulevarde%20Strathfield%20NSW%202135&t=&z=16&ie=UTF8&iwloc=&output=embed";

function StarRow({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-0.5 ${className}`} aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => (
        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
      ))}
    </div>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex min-h-full flex-col bg-white">
      {/* ---------- Navigation ---------- */}
      <header className="sticky top-0 z-50 border-b border-brand-100 bg-white/85 backdrop-blur-md">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <a href="#top" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-sm">
              <IceCream className="h-5 w-5" />
            </span>
            <span className="text-lg font-extrabold leading-none tracking-tight text-brand-800">
              Purple Flow
              <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-500">
                Frozen Yogurt &amp; Acai
              </span>
            </span>
          </a>

          {/* Desktop links */}
          <div className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-slate-600 transition-colors hover:text-brand-700"
              >
                {link.label}
              </a>
            ))}
            <a
              href={ORDER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-brand-600/30 transition-all hover:bg-brand-700 hover:shadow-md"
            >
              Order Now
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="inline-flex items-center justify-center rounded-lg p-2 text-brand-700 hover:bg-brand-50 md:hidden"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="border-t border-brand-100 bg-white md:hidden">
            <div className="space-y-1 px-4 py-3">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-lg px-3 py-2 text-base font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-700"
                >
                  {link.label}
                </a>
              ))}
              <a
                href={ORDER_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                className="mt-2 block rounded-full bg-brand-600 px-4 py-3 text-center text-base font-semibold text-white"
              >
                Order Now
              </a>
            </div>
          </div>
        )}
      </header>

      <main id="top" className="flex-1">
        {/* ---------- Hero ---------- */}
        <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 via-white to-white">
          {/* decorative blobs */}
          <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-brand-200/50 blur-3xl" />
          <div className="pointer-events-none absolute -right-16 top-32 h-64 w-64 rounded-full bg-fuchsia-200/40 blur-3xl" />

          <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-2">
            <div className="text-center lg:text-left">
              <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-4 py-1.5 text-sm font-medium text-brand-700 shadow-sm lg:mx-0">
                <StarRow />
                <span>4.7 on Google · Strathfield Plaza</span>
              </div>

              <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Lovely Flavours.
                <span className="block bg-gradient-to-r from-brand-600 to-fuchsia-500 bg-clip-text text-transparent">
                  Fresh Fruit Toppings.
                </span>
              </h1>

              <p className="mx-auto mt-5 max-w-xl text-lg text-slate-600 lg:mx-0">
                Creamy frozen yoghurt and thick, antioxidant-rich acai bowls —
                piled high with fresh fruit and all your favourite toppings.
                Made fresh daily in the heart of Strathfield.
              </p>

              <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center lg:justify-start">
                <a
                  href={ORDER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-600 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-brand-600/30 transition-all hover:bg-brand-700 hover:shadow-xl"
                >
                  <ShoppingBag className="h-5 w-5" />
                  Order Collection
                </a>
                <a
                  href={ORDER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-brand-600 bg-white px-7 py-3.5 text-base font-semibold text-brand-700 transition-all hover:bg-brand-50"
                >
                  <Truck className="h-5 w-5" />
                  Order Delivery
                </a>
              </div>

              <p className="mt-4 text-sm text-slate-500">
                Open 7 days · Sundays from 11:00 AM
              </p>
            </div>

            {/* Hero visual card */}
            <div className="relative mx-auto w-full max-w-md">
              <div className="rounded-[2rem] bg-gradient-to-br from-brand-500 via-brand-600 to-fuchsia-600 p-1.5 shadow-2xl shadow-brand-600/30">
                <div className="rounded-[1.65rem] bg-white p-6">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
                      Today&apos;s Favourites
                    </span>
                    <StarRow />
                  </div>
                  <div className="mt-5 space-y-4">
                    {OFFERINGS.map((item) => {
                      const Icon = item.icon;
                      return (
                        <div
                          key={item.title}
                          className="flex items-start gap-3 rounded-2xl border border-brand-100 bg-brand-50/40 p-3"
                        >
                          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white">
                            <Icon className="h-5 w-5" />
                          </span>
                          <div>
                            <p className="font-semibold text-slate-900">
                              {item.title}
                            </p>
                            <p className="text-sm leading-snug text-slate-500">
                              {item.body}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- Offerings strip ---------- */}
        <section id="menu" className="border-y border-brand-100 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-500">
                What we serve
              </p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                Froyo, acai &amp; fresh fruit — your way
              </h2>
              <p className="mt-3 text-slate-600">
                Build your own cup or bowl from our line-up of lovely flavours
                and a generous spread of fresh toppings.
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-3">
              {OFFERINGS.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="group rounded-2xl border border-brand-100 bg-gradient-to-b from-white to-brand-50/40 p-6 text-center transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-600/10"
                  >
                    <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-md shadow-brand-600/25">
                      <Icon className="h-7 w-7" />
                    </span>
                    <h3 className="mt-4 text-lg font-bold text-slate-900">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      {item.body}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ---------- Reviews / Social proof ---------- */}
        <section id="reviews" className="bg-brand-50/60">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
            <div className="mx-auto max-w-2xl text-center">
              <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 shadow-sm">
                <StarRow />
                <span className="text-sm font-semibold text-slate-700">
                  4.7 stars on Google
                </span>
              </div>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                Loved by locals
              </h2>
              <p className="mt-3 text-slate-600">
                Don&apos;t just take our word for it — here&apos;s what our
                customers are saying.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {REVIEWS.map((review) => (
                <figure
                  key={review.quote}
                  className="flex h-full flex-col rounded-2xl border border-brand-100 bg-white p-6 shadow-sm"
                >
                  <Quote className="h-8 w-8 text-brand-300" />
                  <blockquote className="mt-3 flex-1 text-lg font-medium leading-relaxed text-slate-800">
                    &ldquo;{review.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-5 flex items-center justify-between border-t border-brand-50 pt-4">
                    <span className="text-sm font-semibold text-slate-500">
                      {review.author}
                    </span>
                    <StarRow />
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- Why choose us ---------- */}
        <section id="why-us" className="bg-white">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-500">
                Why choose us
              </p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                Fresh, generous &amp; great value
              </h2>
              <p className="mt-3 text-slate-600">
                Everything that keeps Strathfield coming back for more.
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {FEATURES.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className="rounded-2xl border border-brand-100 bg-white p-6 transition-all hover:border-brand-300 hover:shadow-lg hover:shadow-brand-600/10"
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                      <Icon className="h-6 w-6" />
                    </span>
                    <h3 className="mt-4 text-lg font-bold text-slate-900">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      {feature.body}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* CTA banner */}
            <div className="mt-14 overflow-hidden rounded-3xl bg-gradient-to-r from-brand-600 to-fuchsia-600 px-6 py-10 text-center shadow-xl shadow-brand-600/20 sm:px-12">
              <h3 className="text-2xl font-extrabold text-white sm:text-3xl">
                Craving something sweet?
              </h3>
              <p className="mx-auto mt-2 max-w-xl text-brand-50">
                Skip the queue — order your froyo or acai bowl for collection or
                delivery today.
              </p>
              <div className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
                <a
                  href={ORDER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-base font-semibold text-brand-700 shadow-md transition-transform hover:scale-[1.02]"
                >
                  <ShoppingBag className="h-5 w-5" />
                  Order Collection
                </a>
                <a
                  href={ORDER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/80 px-7 py-3.5 text-base font-semibold text-white transition-colors hover:bg-white/10"
                >
                  <Truck className="h-5 w-5" />
                  Order Delivery
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ---------- Location & hours footer ---------- */}
      <footer id="visit" className="bg-slate-900 text-slate-300">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-2">
            {/* Details */}
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-white">
                  <IceCream className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-lg font-extrabold text-white">
                    Purple Flow
                  </p>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-300">
                    Frozen Yogurt &amp; Acai
                  </p>
                </div>
              </div>

              <div className="mt-8 space-y-6">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand-400" />
                  <div>
                    <p className="font-semibold text-white">Find us</p>
                    <p className="mt-1 text-slate-400">
                      Strathfield Plaza, Shop 6/11 The Boulevarde
                      <br />
                      Strathfield NSW 2135
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-5 w-5 shrink-0 text-brand-400" />
                  <div>
                    <p className="font-semibold text-white">Opening hours</p>
                    <p className="mt-1 text-slate-400">Open 7 days a week</p>
                    <p className="text-slate-400">
                      <span className="font-medium text-slate-200">
                        Sundays
                      </span>{" "}
                      from 11:00 AM
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-xl bg-white/5 px-4 py-3">
                  <StarRow />
                  <span className="text-sm text-slate-300">
                    Rated <span className="font-semibold text-white">4.7</span>{" "}
                    on Google
                  </span>
                </div>
              </div>

              <a
                href={ORDER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-500"
              >
                <ShoppingBag className="h-4 w-4" />
                Order Now
              </a>
            </div>

            {/* Map embed placeholder */}
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-brand-300">
                Come visit
              </p>
              <div className="overflow-hidden rounded-2xl border border-white/10 shadow-lg">
                {/* Google Maps embed — swap src for your own Maps embed link if desired */}
                <iframe
                  title="Map to Purple Flow Frozen Yogurt and Acai, Strathfield Plaza"
                  src={MAPS_EMBED_SRC}
                  className="h-72 w-full lg:h-[420px]"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-sm text-slate-500 sm:flex-row">
            <p>
              © {new Date().getFullYear()} Purple Flow Frozen Yogurt and Acai.
              All rights reserved.
            </p>
            <p>Strathfield Plaza · Strathfield NSW</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
