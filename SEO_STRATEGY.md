# SEO Strategy — Šimon Havlík (havliksimon.eu)

## Goal

Rank #1 for personal-name queries, in both Czech and English:

- "šimon havlík", "simon havlik", "simon havlik prague", "simon prague", "simon czechia"
- "šimon investor", "šimon havlík ekonom", "šimon havlík linkedin", "šimon havlík vše"
- "financial analyst prague šimon havlík", "finanční analytik praha havlík"

Positioning: **financial analyst & economics student (VŠE Prague)**. China is kept as a
research-interest section, not a consulting service.

## What's Implemented

### Head (`index.html`)

- Title ≤ 60 chars, name first: `Šimon Havlík | Financial Analyst & Economics Student (VŠE Prague)`
- Bilingual meta description (~155 chars, CZ + EN, name variants included)
- `keywords` meta kept concise — ignored by Google but still read by Seznam.cz
- Canonical, hreflang self-reference (`cs` / `en` / `x-default`), geo tags (Prague, CZ)
- OG + Twitter cards pointing at a real `og-image.png` (1200×630)
- Valid JSON-LD: `ProfilePage` + `Person` (financial-analyst job titles, VŠE alumniOf,
  LinkedIn/GitHub sameAs), `WebSite`, `ProfessionalService` (Prague)
- `<noscript>` fallback with indexable bilingual bio (the app is client-rendered)
- Preconnect to fonts + preload of hero portrait

### On-page (invisible only — no visible copy changes)

- `sr-only` bilingual keyword paragraphs in Hero and About (name variants CZ/EN)
- Descriptive image `alt` text (portraits)

### Edge routes (`functions/seo-routes.js`)

Lightweight server-rendered landing pages with self-canonicals and Person schema:

- `/simon-havlik`, `/simon-havlik-prague`, `/simon-prague`, `/simon-czechia` → person page
- `/financni-analytik`, `/ekonom-vse`, `/investor`, `/financial-analyst`, `/equity-research` → analyst page
- Legacy China paths (`/konzultant-pro-cinu`, `/investice-do-ciny`, …) → kept alive for
  backlinks, framed as research interest

### Redirects (`public/_redirects`)

Name/finance aliases plus all legacy China URLs (link equity preserved).

### Crawlers (`public/robots.txt`)

All allowed: `* → Allow: /`, explicit allows for Google, Bing, Seznam, Apple, Baidu —
and all AI bots (GPTBot, ChatGPT-User, OAI-SearchBot, Google-Extended, Claude-Web,
PerplexityBot, CCBot, Meta-ExternalAgent, MistralAI-User, YouBot, …).

### Sitemaps (`public/sitemap*.xml`)

Master index: `sitemap-index.xml`. Home priority 1.0; China demoted to 0.8 (interest, not service).
`robots.txt` advertises both `sitemap.xml` and `sitemap-index.xml`.

## After Deploy (manual, ~15 min)

1. **Google Search Console** — add property, submit `sitemap-index.xml`, request indexing of `/`.
   Set geographic target if offered; verify with the DNS/HTML method and keep the token in `index.html`.
2. **Bing Webmaster Tools** — same (covers DuckDuckGo/Yahoo too).
3. **Seznam Webmaster** (`webmaster.seznam.cz`) — submit sitemap; important for Czech queries.
4. **LinkedIn headline** — mirror the title: "Financial Analyst | Economics Student @ VŠE Prague" +
   link to havliksimon.eu (strong entity signal for name queries).
5. **Google Business / Mapy.cz** — optional; only if offering services publicly.
6. **Backlinks** — link the site from GitHub profile README, LinkedIn featured section,
   VŠE/Klub Investorů profiles, email signature.

## KPIs

- Impressions/clicks for "šimon havlík" and "simon havlik *" in Search Console (expect #1 within weeks — near-zero competition)
- OG card renders correctly (test: LinkedIn Post Inspector, X Card Validator)
- Zero soft-404s: every sitemap URL returns 200
- PageSpeed green on mobile (single biggest ranking lever left after relevance)
