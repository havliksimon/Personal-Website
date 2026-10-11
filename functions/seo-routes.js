// Cloudflare Pages Function - SEO Route Handler
// Serves lightweight bilingual (CZ/EN) landing pages for key person + topic
// queries. Every page canonicals to itself and links back to the main site.

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const path = url.pathname;

  const routes = {
    // Personal-name routes (highest priority: "šimon havlík", "simon havlik prague")
    '/simon-havlik': 'osoba',
    '/simon-havlik-prague': 'osoba',
    '/simon-prague': 'osoba',
    '/simon-czechia': 'osoba',
    // Finance / analyst routes (CZ + EN)
    '/financni-analytik': 'analytik',
    '/ekonom-vse': 'analytik',
    '/investor': 'analytik',
    '/financial-analyst': 'analytik',
    '/equity-research': 'analytik',
    // Kept for backlinks: China research interest (no consulting claims)
    '/konzultant-pro-cinu': 'cina',
    '/cinsky-poradce': 'cina',
    '/investice-do-ciny': 'cina',
    '/cinske-investice': 'cina',
    '/analytik-cinskych-trhu': 'cina',
  };

  const page = routes[path];
  if (page) {
    return new Response(generateSEOPage(page, path), {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  }

  // Continue to static site for all other routes
  return context.next();
}

function layout({ title, description, canonical, body, extraHead = '' }) {
  return `<!DOCTYPE html>
<html lang="cs">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <meta name="description" content="${description}">
    <meta name="author" content="Šimon Havlík">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="https://simonhavlik.com${canonical}">
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; color: #333; }
        h1 { color: #1a1a2e; border-bottom: 3px solid #2563eb; padding-bottom: 10px; }
        h2 { color: #16213e; margin-top: 30px; }
        a { color: #2563eb; }
        a:hover { text-decoration: underline; }
        ul, ol { padding-left: 20px; }
        li { margin-bottom: 8px; }
    </style>
    ${extraHead}
</head>
<body>
    ${body}
    <footer style="margin-top: 50px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 14px;">
        <p>© 2026 Šimon Havlík – Financial Analyst, Prague | Finanční analytik, Praha</p>
        <p>Kontakt: havlik.simon@post.cz · <a href="https://linkedin.com/in/havliksimon">LinkedIn: Šimon Havlík</a> · <a href="/">simonhavlik.com</a></p>
    </footer>
</body>
</html>`;
}

function generateSEOPage(type, path) {
  if (type === 'osoba') {
    return layout({
      title: 'Šimon Havlík (Simon Havlik) – Financial Analyst, Prague | Finanční analytik VŠE',
      description: 'Šimon Havlík (Simon Havlik, Simon Prague, Simon Czechia) – financial analyst and economics student at VŠE Prague. Investor, equity research, finance. LinkedIn: havliksimon.',
      canonical: path,
      extraHead: `<script type="application/ld+json">{"@context":"https://schema.org","@type":"Person","name":"Šimon Havlík","alternateName":["Simon Havlik","Simon Prague","Simon Czechia"],"jobTitle":["Financial Analyst","Economics Student","Finanční analytik"],"url":"https://simonhavlik.com/","sameAs":["https://linkedin.com/in/havliksimon","https://github.com/havliksimon"],"address":{"@type":"PostalAddress","addressLocality":"Prague","addressCountry":"CZ"},"alumniOf":{"@type":"EducationalOrganization","name":"Prague University of Economics and Business (VŠE)"}}</script>`,
      body: `
        <h1>Šimon Havlík – Financial Analyst, Prague</h1>
        <p><strong>Šimon Havlík</strong> (also searched as <strong>Simon Havlik</strong>, Simon Prague, Simon Czechia) is a financial analyst and economics student at the Prague University of Economics and Business (VŠE). Investor focused on equity research, finance, valuation and data-driven investment analysis. Based in Prague, Czech Republic.</p>
        <h2>Šimon Havlík – finanční analytik, ekonom (VŠE Praha)</h2>
        <p><strong>Šimon Havlík</strong> (Šimon investor, Šimon Havlík ekonom, Šimon Havlík VŠE) je finanční analytik a student ekonomie na Vysoké škole ekonomické v Praze. Věnuje se akciovým analýzám, financím, valuaci a datové analýze. Působí v Klubu Investorů.</p>
        <h2>Links / Odkazy</h2>
        <ul>
          <li><a href="/">Main site – simonhavlik.com</a></li>
          <li><a href="https://linkedin.com/in/havliksimon">Šimon Havlík on LinkedIn</a></li>
          <li><a href="https://github.com/havliksimon">Šimon Havlík on GitHub</a></li>
          <li><a href="/#analyses">Equity research – analýzy</a></li>
          <li><a href="/#contact">Contact – kontakt</a></li>
        </ul>
      `,
    });
  }

  if (type === 'analytik') {
    return layout({
      title: 'Šimon Havlík – Finanční analytik & Financial Analyst (VŠE Prague)',
      description: 'Šimon Havlík – finanční analytik a student ekonomie na VŠE v Praze. Akciové analýzy, valuace, finance. Financial analyst: equity research, valuation, Prague.',
      canonical: path,
      body: `
        <h1>Šimon Havlík – finanční analytik (VŠE Praha) / Financial Analyst</h1>
        <p>Jsem <strong>Šimon Havlík</strong>, finanční analytik a student ekonomie na Vysoké škole ekonomické v Praze (VŠE). Věnuji se akciovým analýzám (equity research), valuaci firem (DCF, multiplikátory), správě portfolia a datové analýze v Pythonu a SQL. Působím v Klubu Investorů, Praha.</p>
        <p>I am <strong>Simon Havlik</strong>, a financial analyst and economics student at VŠE Prague. My work covers equity research, company valuation, portfolio analysis and data-driven investing.</p>
        <h2>Publikované analýzy / Published research</h2>
        <ul>
          <li><a href="/analyses/EM_BILI_Havlik.docx.pdf">Bilibili Inc. – Equity Research</a></li>
          <li><a href="/analyses/EM_TUYA_Havlik.pdf">Tuya Smart – Investment Analysis</a></li>
          <li><a href="/analyses/GOOGL_Havlik.pdf">Alphabet (Google) – Analysis</a></li>
          <li><a href="/presentations/presentation_Tencent.pdf">Tencent Holdings – Market Analysis</a></li>
        </ul>
        <p><a href="/">Zpět na hlavní stránku / Back to main site</a> · <a href="https://linkedin.com/in/havliksimon">LinkedIn</a></p>
      `,
    });
  }

  // type === 'cina' – kept for existing backlinks; framed as research interest
  return layout({
    title: 'Šimon Havlík – China Markets Research Interest | Čína jako výzkumné téma',
    description: 'China (Čína) as a research interest of Šimon Havlík, financial analyst (VŠE Prague): equity research on Chinese tech companies, field experience, Mandarin HSK3.',
    canonical: path,
    body: `
      <h1>China as a research interest – Šimon Havlík</h1>
      <p>China (Čína) is one of my research interests as a financial analyst and economics student at VŠE Prague — alongside broader equity research, valuation and portfolio analysis. This page preserves older links; my current focus is finance and economics.</p>
      <h2>Výzkum čínských trhů</h2>
      <ul>
        <li>Equity research čínských technologických společností (Bilibili, Tencent, Alibaba, Tuya)</li>
        <li>Terénní zkušenost ze studijních pobytů v Číně, mandarínština HSK3</li>
        <li>Publikované analýzy: <a href="/analyses/EM_BILI_Havlik.docx.pdf">Bilibili</a>, <a href="/analyses/EM_TUYA_Havlik.pdf">Tuya</a>, <a href="/presentations/presentation_Tencent.pdf">Tencent</a></li>
      </ul>
      <p><a href="/">Zpět na hlavní stránku / Back to main site</a> · <a href="https://linkedin.com/in/havliksimon">LinkedIn</a></p>
    `,
  });
}
