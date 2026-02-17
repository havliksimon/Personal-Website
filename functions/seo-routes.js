// Cloudflare Pages Function - SEO Optimized Route Handler
// This function enhances SEO by providing structured data and handling specific queries

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const path = url.pathname;
  
  // Handle specific SEO routes
  if (path === '/konzultant-pro-cinu' || path === '/cinsky-poradce') {
    return new Response(generateSEOPage('konzultant'), {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
        'X-Robots-Tag': 'all'
      }
    });
  }
  
  if (path === '/investice-do-ciny' || path === '/cinske-investice') {
    return new Response(generateSEOPage('investice'), {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
        'X-Robots-Tag': 'all'
      }
    });
  }
  
  if (path === '/analytik-cinskych-trhu') {
    return new Response(generateSEOPage('analytik'), {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
        'X-Robots-Tag': 'all'
      }
    });
  }
  
  // Continue to static site for all other routes
  return context.next();
}

function generateSEOPage(type) {
  const pages = {
    konzultant: {
      title: 'Konzultant pro čínské investice | Šimon Havlík | Praha',
      description: 'Profesionální konzultant pro investice do Číny. Specialista na čínské trhy, akcie a APAC strategie. Pomáhám českým investorům orientovat se v čínských investicích.',
      heading: 'Konzultant pro čínské investice',
      content: `
        <h1>Konzultant pro čínské investice v Praze</h1>
        <p>Hledáte <strong>dobrého čínského poradce</strong>? Jsem Šimon Havlík, konzultant specializující se na čínské trhy a investice do Číny.</p>
        
        <h2>Proč investovat do Číny?</h2>
        <ul>
          <li>Druhá největší ekonomika světa</li>
          <li>Rychle rostoucí technologický sektor</li>
          <li>Přístup k inovativním společnostem (Tencent, Alibaba, Bilibili)</li>
          <li>Diverzifikace investičního portfolia</li>
        </ul>
        
        <h2>Služby konzultanta</h2>
        <ul>
          <li>Analýza čínských akcií a trhů</li>
          <li>Portfolio strategie pro APAC region</li>
          <li>Výzkum čínských technologických společností</li>
          <li>Rizikové zhodnocení čínských investic</li>
          <li>Pravidelné investiční reporty</li>
        </ul>
        
        <h2>Kontaktujte mě</h2>
        <p>Email: havlik.simon@post.cz<br>
        Telefon: +420 776 341 621<br>
        Lokalita: Praha, Česká republika</p>
        
        <p><a href="/">Zpět na hlavní stránku</a></p>
      `
    },
    investice: {
      title: 'Investice do Číny | Průvodce čínskými trhy | Šimon Havlík',
      description: 'Kompletní průvodce investicemi do Číny. Analýza čínských akcií, strategie pro začátečníky i pokročilé investory. Expert na čínské trhy z Prahy.',
      heading: 'Investice do Číny - kompletní průvodce',
      content: `
        <h1>Investice do Číny - kompletní průvodce</h1>
        <p>Chcete začít investovat do Číny? Jako <strong>analytik čínských trhů</strong> vám pomohu orientovat se v komplexním čínském investičním prostředí.</p>
        
        <h2>Jak začít investovat do Číny?</h2>
        <ol>
          <li><strong>Vzdělání:</strong> Pochopte čínský tržní kontext</li>
          <li><strong>Platforma:</strong> Vyberte správného brokera</li>
          <li><strong>Výběr:</strong> Identifikujte kvalitní čínské společnosti</li>
          <li><strong>Diverzifikace:</strong> Vyvážené portfolio</li>
          <li><strong>Monitoring:</strong> Pravidelná analýza</li>
        </ol>
        
        <h2>Nejlepší čínské akcie pro rok 2026</h2>
        <ul>
          <li><strong>Tencent (0700.HK)</strong> - Technologický gigant</li>
          <li><strong>Alibaba (BABA)</strong> - E-commerce lídr</li>
          <li><strong>Bilibili (BILI)</strong> - Mladá generace platforma</li>
          <li><strong>Tuya Smart (TUYA)</strong> - IoT inovace</li>
        </ul>
        
        <h2>Rizika čínských investic</h2>
        <p>Investice do Číny nesou specifická rizika:</p>
        <ul>
          <li>Regulační změny</li>
          <li>Geopolitické napětí</li>
          <li>Měnové riziko</li>
          <li>Transparence firem</li>
        </ul>
        
        <p><a href="/">Zpět na hlavní stránku</a></p>
      `
    },
    analytik: {
      title: 'Analytik čínských trhů | Šimon Havlík | Praha',
      description: 'Profesionální analytik čínských trhů z Prahy. Specializace na čínské akcie, APAC equity research a čínské technologické společnosti.',
      heading: 'Analytik čínských trhů',
      content: `
        <h1>Analytik čínských trhů - Šimon Havlík</h1>
        <p>Jsem profesionální <strong>analytik čínských trhů</strong> se specializací na čínské akcie a asijsko-pacifické investice.</p>
        
        <h2>Moje expertiza</h2>
        <ul>
          <li>Čínský akciový trh (A-shares, H-shares, ADRs)</li>
          <li>Hong Kong Stock Exchange</li>
          <li>Čínské technologické společnosti</li>
          <li>Asijsko-pacifické trhy (APAC)</li>
          <li>BRICS ekonomiky</li>
        </ul>
        
        <h2>Publikované analýzy</h2>
        <ul>
          <li><a href="/analyses/EM_BILI_Havlik.docx.pdf">Bilibili Inc. - Equity Research</a></li>
          <li><a href="/analyses/EM_TUYA_Havlik.pdf">Tuya Smart - Investment Analysis</a></li>
          <li><a href="/presentations/presentation_Tencent.pdf">Tencent Holdings - Market Analysis</a></li>
          <li><a href="/presentations/presentation_Chagee.pdf">Chagee (霸王茶姬) - IPO Analysis</a></li>
        </ul>
        
        <h2>Vzdělání a zkušenosti</h2>
        <ul>
          <li>Student VŠE Praha - Fakulta podnikohospodářská</li>
          <li>Člen Klubu Investorů</li>
          <li>Specializace na emerging markets</li>
          <li>Expertíza v kvantitativní analýze</li>
        </ul>
        
        <p><a href="/">Zpět na hlavní stránku</a></p>
      `
    }
  };
  
  const page = pages[type] || pages.konzultant;
  
  return `<!DOCTYPE html>
<html lang="cs">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${page.title}</title>
    <meta name="description" content="${page.description}">
    <meta name="keywords" content="čínský analytik, čínský poradce, konzultant čína, investice čína, čínské akcie, analytik praha">
    <meta name="author" content="Šimon Havlík">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="https://havliksimon.eu${type === 'konzultant' ? '/konzultant-pro-cinu' : type === 'investice' ? '/investice-do-ciny' : '/analytik-cinskych-trhu'}">
    <link rel="stylesheet" href="/styles.css">
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; color: #333; }
        h1 { color: #1a1a2e; border-bottom: 3px solid #e94560; padding-bottom: 10px; }
        h2 { color: #16213e; margin-top: 30px; }
        a { color: #e94560; }
        a:hover { text-decoration: underline; }
        ul, ol { padding-left: 20px; }
        li { margin-bottom: 8px; }
        .contact-info { background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0; }
    </style>
</head>
<body>
    ${page.content}
    
    <footer style="margin-top: 50px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 14px;">
        <p>© 2026 Šimon Havlík | Konzultant pro čínské investice | Praha</p>
        <p>Kontakt: havlik.simon@post.cz | +420 776 341 621</p>
    </footer>
</body>
</html>`;
}
