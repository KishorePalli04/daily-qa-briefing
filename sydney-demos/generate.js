#!/usr/bin/env node
// Generates static one-page concept sites for Sydney small businesses
// into sydney-demos/dist/<slug>/index.html plus a root index for review.
const fs = require("fs");
const path = require("path");

const businesses = JSON.parse(fs.readFileSync(path.join(__dirname, "businesses.json"), "utf8"));
const OUT = path.join(__dirname, "dist");

const themes = {
  barber: {
    fonts: "family=Oswald:wght@500;600&family=Inter:wght@400;500;600",
    display: "'Oswald', sans-serif",
    body: "'Inter', sans-serif",
    bg: "#111312",
    surface: "#1b1e1c",
    card: "#222623",
    accent: "#d4a545",
    accentDark: "#b8892f",
    accentText: "#111312",
    text: "#f2efe8",
    muted: "#a8a698",
    heroGrad: "radial-gradient(1200px 600px at 80% -10%, rgba(212,165,69,.18), transparent 60%), radial-gradient(800px 500px at 10% 110%, rgba(212,165,69,.08), transparent 60%)",
    icon: "✂️"
  },
  nails: {
    fonts: "family=Cormorant+Garamond:wght@600;700&family=Inter:wght@400;500;600",
    display: "'Cormorant Garamond', serif",
    body: "'Inter', sans-serif",
    bg: "#fdf7f4",
    surface: "#ffffff",
    card: "#fff",
    accent: "#b0526b",
    accentDark: "#933f56",
    accentText: "#ffffff",
    text: "#3d2c33",
    muted: "#8a707b",
    heroGrad: "radial-gradient(1000px 500px at 85% -10%, rgba(176,82,107,.14), transparent 60%), radial-gradient(700px 400px at 5% 110%, rgba(176,82,107,.10), transparent 60%)",
    icon: "💅"
  },
  mechanic: {
    fonts: "family=Barlow+Condensed:wght@600;700&family=Inter:wght@400;500;600",
    display: "'Barlow Condensed', sans-serif",
    body: "'Inter', sans-serif",
    bg: "#12161c",
    surface: "#1a2027",
    card: "#212932",
    accent: "#e8722a",
    accentDark: "#c95c1c",
    accentText: "#12161c",
    text: "#eef1f4",
    muted: "#9aa6b2",
    heroGrad: "radial-gradient(1100px 550px at 80% -10%, rgba(232,114,42,.16), transparent 60%), radial-gradient(800px 450px at 10% 110%, rgba(232,114,42,.07), transparent 60%)",
    icon: "🔧"
  }
};

const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function page(b) {
  const t = themes[b.theme];
  const isLight = b.theme === "nails";
  const mapsQ = encodeURIComponent(`${b.name} ${b.address}`);
  const phoneBtn = b.phone
    ? `<a class="btn btn-primary" href="tel:+61${b.phone.replace(/^0/, "")}">Call ${esc(b.phoneDisplay)}</a>`
    : `<a class="btn btn-primary" href="#contact">${esc(b.booking || "Get in touch")}</a>`;
  return `<!DOCTYPE html>
<html lang="en-AU">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>${esc(b.name)} — ${esc(b.suburb)} | Concept Demo</title>
<meta name="description" content="Concept website demo for ${esc(b.name)}, ${esc(b.suburb)}. Not the official website.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?${t.fonts}&display=swap" rel="stylesheet">
<style>
  :root{--bg:${t.bg};--surface:${t.surface};--card:${t.card};--accent:${t.accent};--accent-dark:${t.accentDark};--accent-text:${t.accentText};--text:${t.text};--muted:${t.muted}}
  *{margin:0;padding:0;box-sizing:border-box}
  html{scroll-behavior:smooth}
  body{font-family:${t.body};background:var(--bg);color:var(--text);line-height:1.6}
  .demo-banner{position:sticky;top:0;z-index:50;background:${isLight ? "#3d2c33" : "#000"};color:#fff;text-align:center;font-size:.8rem;padding:.5rem 1rem;letter-spacing:.02em}
  .demo-banner strong{color:${t.accent}}
  .wrap{max-width:1060px;margin:0 auto;padding:0 1.25rem}
  header.site{display:flex;align-items:center;justify-content:space-between;padding:1.1rem 0}
  .logo{font-family:${t.display};font-size:1.35rem;letter-spacing:.04em;text-transform:uppercase}
  .logo span{color:var(--accent)}
  nav.main a{color:var(--muted);text-decoration:none;margin-left:1.4rem;font-size:.92rem;font-weight:500}
  nav.main a:hover{color:var(--text)}
  nav.main a.call{color:var(--accent);font-weight:600}
  .hero{padding:5rem 0 4.5rem;background:${t.heroGrad}}
  .hero .kicker{color:var(--accent);font-weight:600;letter-spacing:.18em;text-transform:uppercase;font-size:.8rem}
  .hero h1{font-family:${t.display};font-size:clamp(2.6rem,6vw,4.2rem);line-height:1.08;margin:.6rem 0 1rem;letter-spacing:.01em}
  .hero p.sub{color:var(--muted);font-size:1.12rem;max-width:34rem;margin-bottom:2rem}
  .btn{display:inline-block;padding:.85rem 1.6rem;border-radius:6px;text-decoration:none;font-weight:600;font-size:.95rem;letter-spacing:.02em}
  .btn-primary{background:var(--accent);color:var(--accent-text)}
  .btn-primary:hover{background:var(--accent-dark)}
  .btn-ghost{border:1px solid ${isLight ? "rgba(61,44,51,.25)" : "rgba(255,255,255,.25)"};color:var(--text);margin-left:.6rem}
  .btn-ghost:hover{border-color:var(--accent);color:var(--accent)}
  .badges{display:flex;flex-wrap:wrap;gap:.6rem;margin-top:2.2rem}
  .badge{border:1px solid ${isLight ? "rgba(176,82,107,.35)" : "rgba(255,255,255,.14)"};color:var(--muted);border-radius:999px;padding:.35rem .95rem;font-size:.82rem}
  section{padding:4.2rem 0}
  .sec-kicker{color:var(--accent);font-weight:600;letter-spacing:.18em;text-transform:uppercase;font-size:.78rem}
  h2{font-family:${t.display};font-size:clamp(1.8rem,3.5vw,2.5rem);margin:.4rem 0 2rem;letter-spacing:.01em}
  .services{background:var(--surface)}
  .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.1rem}
  .card{background:var(--card);border:1px solid ${isLight ? "rgba(61,44,51,.08)" : "rgba(255,255,255,.06)"};border-radius:10px;padding:1.5rem;${isLight ? "box-shadow:0 2px 12px rgba(61,44,51,.06)" : ""}}
  .card h3{font-size:1.05rem;margin-bottom:.45rem;font-weight:600}
  .card h3::before{content:"${t.icon}";margin-right:.5rem;font-size:.95rem}
  .card p{color:var(--muted);font-size:.92rem}
  .about-grid{display:grid;grid-template-columns:1.2fr .8fr;gap:3rem;align-items:center}
  .about-grid p{color:var(--muted);font-size:1.05rem}
  .stat-box{background:var(--card);border-left:4px solid var(--accent);border-radius:8px;padding:1.6rem;${isLight ? "box-shadow:0 2px 12px rgba(61,44,51,.06)" : ""}}
  .stat-box li{list-style:none;color:var(--muted);padding:.45rem 0;font-size:.98rem}
  .stat-box li::before{content:"✓";color:var(--accent);font-weight:700;margin-right:.7rem}
  .info{background:var(--surface)}
  .info-grid{display:grid;grid-template-columns:1fr 1fr;gap:3rem}
  table.hours{width:100%;border-collapse:collapse}
  table.hours td{padding:.55rem 0;border-bottom:1px solid ${isLight ? "rgba(61,44,51,.1)" : "rgba(255,255,255,.08)"};color:var(--muted);font-size:.95rem}
  table.hours td:last-child{text-align:right;color:var(--text)}
  .contact-line{display:flex;gap:.8rem;margin-bottom:1.1rem;color:var(--muted);font-size:.98rem}
  .contact-line .ic{color:var(--accent)}
  .contact-line a{color:var(--accent);text-decoration:none;font-weight:600}
  .cta-band{text-align:center;padding:4.5rem 0;background:${t.heroGrad}}
  .cta-band h2{margin-bottom:1.6rem}
  footer{padding:2.2rem 0 3rem;border-top:1px solid ${isLight ? "rgba(61,44,51,.1)" : "rgba(255,255,255,.07)"}}
  footer p{color:var(--muted);font-size:.8rem;max-width:46rem}
  footer p+p{margin-top:.6rem}
  @media(max-width:760px){
    nav.main a:not(.call){display:none}
    .about-grid,.info-grid{grid-template-columns:1fr;gap:2rem}
    .btn-ghost{margin-left:0;margin-top:.6rem}
  }
</style>
</head>
<body>
<div class="demo-banner"><strong>CONCEPT DEMO</strong> — a website design mockup prepared for ${esc(b.name)}. This is <strong>not</strong> the official website of this business.</div>
<div class="wrap">
  <header class="site">
    <div class="logo">${esc(b.name.split(" ")[0])} <span>${esc(b.name.split(" ").slice(1).join(" "))}</span></div>
    <nav class="main">
      <a href="#services">Services</a>
      <a href="#about">About</a>
      <a href="#contact">Hours &amp; Contact</a>
      ${b.phone ? `<a class="call" href="tel:+61${b.phone.replace(/^0/, "")}">${esc(b.phoneDisplay)}</a>` : ""}
    </nav>
  </header>
</div>
<div class="hero">
  <div class="wrap">
    <div class="kicker">${esc(b.suburb)}, Sydney</div>
    <h1>${esc(b.tagline)}</h1>
    <p class="sub">${esc(b.sub)}</p>
    ${phoneBtn}
    <a class="btn btn-ghost" href="#services">See services</a>
    <div class="badges">${b.badges.map(x => `<span class="badge">${esc(x)}</span>`).join("")}</div>
  </div>
</div>
<section class="services" id="services">
  <div class="wrap">
    <div class="sec-kicker">What we do</div>
    <h2>Services</h2>
    <div class="grid">
      ${b.services.map(s => `<div class="card"><h3>${esc(s.name)}</h3><p>${esc(s.desc)}</p></div>`).join("\n      ")}
    </div>
  </div>
</section>
<section id="about">
  <div class="wrap">
    <div class="about-grid">
      <div>
        <div class="sec-kicker">Who we are</div>
        <h2>About ${esc(b.name)}</h2>
        <p>${esc(b.about)}</p>
      </div>
      <div class="stat-box"><ul>${b.badges.map(x => `<li>${esc(x)}</li>`).join("")}</ul></div>
    </div>
  </div>
</section>
<section class="info" id="contact">
  <div class="wrap">
    <div class="info-grid">
      <div>
        <div class="sec-kicker">When to find us</div>
        <h2>Opening Hours</h2>
        <table class="hours">${b.hours.map(h => `<tr><td>${esc(h[0])}</td><td>${esc(h[1])}</td></tr>`).join("")}</table>
      </div>
      <div>
        <div class="sec-kicker">Where to find us</div>
        <h2>Contact</h2>
        <div class="contact-line"><span class="ic">📍</span><span>${esc(b.address)}${b.address2 ? `<br>${esc(b.address2)}` : ""}</span></div>
        ${b.phone ? `<div class="contact-line"><span class="ic">📞</span><a href="tel:+61${b.phone.replace(/^0/, "")}">${esc(b.phoneDisplay)}</a></div>` : ""}
        ${b.email ? `<div class="contact-line"><span class="ic">✉️</span><a href="mailto:${esc(b.email)}">${esc(b.email)}</a></div>` : ""}
        ${b.booking ? `<div class="contact-line"><span class="ic">🗓️</span><span>${esc(b.booking)}</span></div>` : ""}
        ${b.instagram ? `<div class="contact-line"><span class="ic">📷</span><a href="https://www.instagram.com/${esc(b.instagram)}/" rel="noopener">@${esc(b.instagram)}</a></div>` : ""}
        <div class="contact-line"><span class="ic">🗺️</span><a href="https://maps.google.com/?q=${mapsQ}" rel="noopener">Open in Google Maps</a></div>
      </div>
    </div>
  </div>
</section>
<div class="cta-band">
  <div class="wrap">
    <h2>${esc(b.cta)}</h2>
    ${phoneBtn}
  </div>
</div>
<footer>
  <div class="wrap">
    <p><strong>Demo notice:</strong> This page is a concept design mockup prepared as a proposal for ${esc(b.name)} and is not the business's official website. It is temporarily hosted for review purposes only and is excluded from search engines.</p>
    <p>Business details (address, phone, hours) were compiled from public listings and may be out of date. We're happy to correct any detail — or take this page down immediately on request.</p>
  </div>
</footer>
</body>
</html>`;
}

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
for (const b of businesses) {
  fs.mkdirSync(path.join(OUT, b.slug), { recursive: true });
  fs.writeFileSync(path.join(OUT, b.slug, "index.html"), page(b));
  console.log(`built ${b.slug}`);
}

// Review index (for the site owner reviewing demos, not for outreach)
const index = `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow"><title>Sydney Demo Sites — Review Index</title>
<style>
body{font-family:system-ui,sans-serif;background:#14161a;color:#eee;max-width:720px;margin:3rem auto;padding:0 1.2rem;line-height:1.6}
h1{font-size:1.5rem}p{color:#9aa}a{color:#7ec8ff;text-decoration:none}a:hover{text-decoration:underline}
li{padding:.35rem 0}.tag{font-size:.75rem;color:#889;border:1px solid #445;border-radius:99px;padding:.1rem .6rem;margin-left:.5rem}
</style></head><body>
<h1>Sydney Small-Business Concept Demos</h1>
<p>Internal review index — each link is a concept site prepared for outreach. Not linked from anywhere public.</p>
<ul>
${businesses.map(b => `<li><a href="/${b.slug}/">${esc(b.name)}</a><span class="tag">${esc(b.theme)} · ${esc(b.suburb)}</span></li>`).join("\n")}
</ul>
</body></html>`;
fs.writeFileSync(path.join(OUT, "index.html"), index);
console.log("built review index");
