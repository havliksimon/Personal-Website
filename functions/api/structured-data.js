// Cloudflare Pages Function - API endpoint for structured data
// This provides JSON-LD data for SEO purposes

export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const type = url.searchParams.get('type') || 'person';
  
  const structuredData = {
    person: {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Šimon Havlík",
      "jobTitle": ["Konzultant pro čínské investice", "Analytik čínských trhů", "China Investment Analyst"],
      "description": "Profesionální konzultant pro investice do Číny a analytik čínských trhů z Prahy",
      "url": "https://havliksimon.eu/",
      "email": "havlik.simon@post.cz",
      "telephone": "+420-776-341-621",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Praha",
        "addressCountry": "CZ"
      },
      "knowsAbout": [
        "Čínské investice",
        "Čínské akcie",
        "Asijsko-pacifické trhy",
        "APAC investice",
        "Čínský trh",
        "Investiční analýza"
      ]
    },
    
    service: {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "name": "Konzultace pro čínské investice",
      "provider": {
        "@type": "Person",
        "name": "Šimon Havlík"
      },
      "areaServed": {
        "@type": "City",
        "name": "Praha"
      },
      "serviceType": [
        "Konzultace pro čínské investice",
        "Analýza čínských akcií",
        "APAC investiční strategie",
        "Investiční poradenství Čína"
      ],
      "description": "Profesionální konzultační služby pro investice do Číny a čínských akcií"
    },
    
    faq: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Kde najít dobrého čínského poradce?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Šimon Havlík je konzultant pro čínské investice z Prahy specializující se na čínské akcie a APAC trhy. Nabízí profesionální analýzy a investiční poradenství pro české investory."
          }
        },
        {
          "@type": "Question",
          "name": "Jak začít investovat do Číny?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Pro začátek investování do Číny doporučuji: 1) Naučit se základy čínského trhu, 2) Vybrat spolehlivého brokera, 3) Začít s diversifikovaným portfoliem, 4) Pravidelně sledovat trh. Jako konzultant vám mohu pomoci s každým krokem."
          }
        },
        {
          "@type": "Question",
          "name": "Jaká jsou rizika investic do Číny?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Hlavní rizika čínských investic zahrnují: regulační změny, geopolitické napětí, měnové riziko a nižší transparentnost některých firem. Důležitá je diversifikace a pravidelná analýza."
          }
        },
        {
          "@type": "Question",
          "name": "Které čínské akcie jsou nejlepší?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Mezi zajímavé čínské akcie patří: Tencent (technologie), Alibaba (e-commerce), Bilibili (mladá generace), Tuya Smart (IoT). Konkrétní doporučení závisí na vašich investičních cílech a toleranci rizika."
          }
        }
      ]
    }
  };
  
  return new Response(JSON.stringify(structuredData[type] || structuredData.person), {
    headers: {
      'Content-Type': 'application/ld+json',
      'Cache-Control': 'public, max-age=86400',
      'Access-Control-Allow-Origin': '*'
    }
  });
}
