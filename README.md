# Šimon Havlík — Personal Website

Personal portfolio of **Šimon Havlík** (Simon Havlik, Prague, Czechia) — financial analyst and economics student at VŠE Prague. Live at [havliksimon.eu](https://havliksimon.eu/).

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS, GSAP, Framer Motion
- Deployed on Cloudflare Pages (auto-deploys from `main`)

## Local Development

```bash
npm install
npm run dev      # dev server
npm run build    # production build (tsc + vite)
npm run preview  # preview production build
```

## Project Structure

```
├── dist/               # Production build output (generated)
├── functions/          # Cloudflare Pages Functions (SEO routes)
├── public/             # Static assets (favicons, sitemaps, robots.txt, analyses, CV)
├── src/
│   ├── components/     # Reusable UI components
│   ├── sections/       # Page sections (Hero, About, Journey, Skills, Projects, Analyses, China, Contact)
│   ├── hooks/          # Custom React hooks
│   ├── data/           # JSON data files
│   ├── App.tsx         # Main app component
│   └── main.tsx        # Entry point
├── index.html          # Head tags, meta + JSON-LD structured data
├── package.json
├── vite.config.ts
└── wrangler.jsonc
```

## SEO Notes

- Bilingual CZ/EN positioning: financial analyst / finanční analytik, economics student (VŠE), Prague.
- Structured data (Person, WebSite, ProfessionalService) lives in `index.html`.
- Sitemaps in `public/` (`sitemap-index.xml` is the master index submitted to search consoles).
- `robots.txt` allows all crawlers, including AI bots.
- `functions/seo-routes.js` serves lightweight landing pages for name/topic routes (`/simon-havlik`, `/financni-analytik`, …).

## License

© 2026 Šimon Havlík. All rights reserved.
