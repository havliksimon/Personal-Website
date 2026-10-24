# Šimon Havlík — Personal Website

Personal site of **Šimon Havlík** (Simon Havlik) — economics student at VŠE Prague and equity analyst at Klub Investorů. Live at **[simonhavlik.com](https://simonhavlik.com)**.

The site is a working portfolio rather than a landing page: published equity research and investment cases you can open in place, a browser-based Mac desktop holding the full document set, and live links to the two tools I build and run.

---

## What is on it

| Section | What it does |
|---|---|
| **Hero** | Portrait, positioning, and a tape of index levels along the fold |
| **About** | The short version: VŠE, Klub Investorů, Asia focus |
| **Journey** | Shmack OS — a macOS-style desktop in the browser. The terminal prints the education log; Finder opens the complete document set; Safari opens the optimiser; Settings swaps the wallpaper |
| **Skills** | The full inventory in nine categories — quantitative, programming, AI/ML, finance, economic theory, policy, Asia-Pacific, design, languages |
| **Projects** | Two production tools with live embedded previews and source links |
| **Analyses** | Nine published pieces — equity notes on Bilibili, Tuya, Alphabet, Chagee, Lyft and Geely, and investment-case decks on Bilibili, Chagee and Tencent — each readable in an embedded viewer |
| **Field research** | Signage and street-level observations from Shanghai, Suzhou, Hangzhou, Wuhan and Chongqing, with notes on hover |
| **China** | The macro case in one dense strip: GDP (PPP), listed companies, middle class, green investment, FDI, chips, EV share |

## Stack

- **React 19** + **TypeScript**, built with **Vite 7**
- **Tailwind CSS** for layout and typography, custom CSS for the desktop and the signage wall
- **GSAP** + **ScrollTrigger** for section reveals, **Framer Motion** for micro-interaction
- **three.js** via `@react-three/fiber` for the desktop wallpaper, isolated in its own deferred chunk
- **Recharts** for the China charts
- Server-rendered shell (Vite SSR entry) so first paint is static HTML, hydrated on the client
- **Cloudflare Pages** serves the build; a Pages Function handles the SEO routes

## Performance and SEO

- The three.js bundle (~875 kB) is code-split and only fetched when the desktop wallpaper mounts; the main bundle stays around 980 kB / 283 kB gzipped
- Prerendered HTML (~227 kB) with structured data (`Person`, `ProfilePage`, `sameAs`) in `index.html`
- Charts and the document wall are lazy-loaded; the tape and marquees are CSS-only and pause on hover, and every animation switches off under `prefers-reduced-motion`
- The China storm effects run on pointer-capable devices only

## Local development

```bash
npm install
npm run dev        # Vite dev server
npm run build      # type-check + client build + SSR prerender
npm run preview    # serve the production build
```

## Deployment

Pushes to `main` build and deploy automatically on Cloudflare Pages. The build output is `dist/`; `wrangler.jsonc` points the asset directory there and `functions/seo-routes.js` renders the crawler-facing pages.

## Repository layout

```
src/
  sections/            one component per page section
  components/          desktop (Shmack OS), effects, navigation
  components/journey/  window manager, apps, document registry
  data/                skills and timeline content
public/
  analyses/            published research (PDF)
  presentations/       investment-case decks (PDF)
  field/               field-research photography
functions/             Cloudflare Pages SEO routes
index.html             shell, fonts, structured data
```

## Contact

[LinkedIn](https://www.linkedin.com/in/simonhavlik) · [GitHub](https://github.com/simonhavlik) · [havlik.simon@post.cz](mailto:havlik.simon@post.cz)
