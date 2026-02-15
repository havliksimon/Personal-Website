import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  FileText, Presentation, Download, ExternalLink, 
  Loader2, ChevronRight, BookOpen, BarChart3,
  TrendingUp, Globe, Building2
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

type DocumentType = 'analysis' | 'presentation';

interface AnalysisDoc {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  type: DocumentType;
  date: string;
  pages: number;
  pdfUrl: string;
  thumbnailColor: string;
  icon: React.ElementType;
  tags: string[];
}

const analyses: AnalysisDoc[] = [
  {
    id: 1,
    title: 'Emerging Markets Equity Analysis',
    subtitle: 'Q4 2024 Market Outlook',
    description: 'Comprehensive analysis of emerging market equities focusing on Asia-Pacific region. Includes valuation metrics, risk factors, and portfolio allocation recommendations based on macroeconomic indicators.',
    type: 'analysis',
    date: 'Dec 2024',
    pages: 24,
    pdfUrl: '/analyses/emerging-markets-q4-2024.pdf',
    thumbnailColor: 'from-amber-500 to-orange-600',
    icon: Globe,
    tags: ['EM Equities', 'Valuation', 'Macro']
  },
  {
    id: 2,
    title: 'Portfolio Risk Assessment',
    subtitle: 'Risk Parity Strategy Deep Dive',
    description: 'Quantitative risk analysis of multi-asset portfolios using CVaR optimization, stress testing scenarios, and tail risk evaluation through Extreme Value Theory.',
    type: 'analysis',
    date: 'Nov 2024',
    pages: 18,
    pdfUrl: '/analyses/portfolio-risk-assessment.pdf',
    thumbnailColor: 'from-blue-500 to-indigo-600',
    icon: BarChart3,
    tags: ['Risk', 'CVaR', 'Stress Test']
  },
  {
    id: 3,
    title: 'China A-Shares Screening',
    subtitle: 'Fundamental Analysis of 50+ Companies',
    description: 'In-depth fundamental analysis of China A-share market with focus on consumer discretionary and technology sectors. Includes DCF models and relative valuation.',
    type: 'analysis',
    date: 'Oct 2024',
    pages: 32,
    pdfUrl: '/analyses/china-a-shares-screening.pdf',
    thumbnailColor: 'from-red-500 to-rose-600',
    icon: Building2,
    tags: ['China', 'Fundamental', 'DCF']
  },
  {
    id: 4,
    title: 'Investment Club Pitch Deck',
    subtitle: 'KI Asset Management Strategy',
    description: 'Strategic presentation for investment club covering portfolio construction methodology, performance attribution, and analyst selection framework.',
    type: 'presentation',
    date: 'Sep 2024',
    pages: 15,
    pdfUrl: '/presentations/ki-am-strategy.pdf',
    thumbnailColor: 'from-emerald-500 to-teal-600',
    icon: Presentation,
    tags: ['Strategy', 'Framework', 'Pitch']
  },
  {
    id: 5,
    title: 'Portfolio Optimization Workshop',
    subtitle: 'Modern Portfolio Theory in Practice',
    description: 'Educational presentation covering MPT implementation, efficient frontier construction, and hands-on optimization exercises using Python.',
    type: 'presentation',
    date: 'Aug 2024',
    pages: 28,
    pdfUrl: '/presentations/mpt-workshop.pdf',
    thumbnailColor: 'from-violet-500 to-purple-600',
    icon: BookOpen,
    tags: ['Education', 'MPT', 'Python']
  }
];

const Analyses = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<HTMLDivElement>(null);
  
  const [activeDoc, setActiveDoc] = useState<AnalysisDoc>(analyses[0]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'analysis' | 'presentation'>('all');

  const filteredDocs = analyses.filter(doc => 
    filter === 'all' ? true : doc.type === filter
  );

  const switchDocument = (doc: AnalysisDoc) => {
    setActiveDoc(doc);
    setIsLoading(true);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headerRef.current,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      gsap.fromTo(cardsContainerRef.current,
        { x: -80, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.9,
          delay: 0.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: cardsContainerRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      gsap.fromTo(viewerRef.current,
        { x: 80, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.9,
          delay: 0.3,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: viewerRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="analyses"
      className="relative py-20 md:py-28 bg-white overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-amber-50/60 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-blue-50/40 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-[1600px] mx-auto">
        {/* HEADER */}
        <div ref={headerRef} className="px-6 md:px-12 lg:px-16 mb-12">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
                  <FileText className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-mono text-gray-600 uppercase tracking-wider">Research</span>
                </div>
                <div className="h-px flex-1 max-w-[100px] bg-gradient-to-r from-gray-300 to-transparent" />
              </div>
              
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Featured{' '}
                <span className="relative inline-block">
                  <span className="relative z-10 bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                    Analyses
                  </span>
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                    <path d="M2 8C50 2 150 2 198 8" stroke="currentColor" strokeWidth="3" className="text-amber-200" strokeLinecap="round"/>
                  </svg>
                </span>
              </h2>
            </div>

            <div className="lg:max-w-md lg:text-right">
              <p className="text-lg text-gray-600 leading-relaxed">
                In-depth{' '}
                <span className="text-gray-900 font-medium">financial research</span>{' '}
                and presentations covering portfolio optimization, equity analysis, and risk assessment.
              </p>
              
              {/* Filter tabs */}
              <div className="mt-6 flex items-center gap-2 lg:justify-end">
                {(['all', 'analysis', 'presentation'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilter(type)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      filter === type
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {type === 'all' ? 'All' : type === 'analysis' ? 'Analyses' : 'Presentations'}
                    <span className="ml-2 text-xs opacity-70">
                      ({type === 'all' ? analyses.length : analyses.filter(d => d.type === type).length})
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SPLIT LAYOUT */}
        <div className="flex flex-col lg:flex-row gap-6 px-6 md:px-12 lg:px-16">
          
          {/* LEFT: Document Cards */}
          <div 
            ref={cardsContainerRef}
            className="w-full lg:w-[420px] xl:w-[450px] flex-shrink-0 space-y-4 max-h-[750px] overflow-y-auto pr-2 custom-scrollbar"
          >
            {filteredDocs.map((doc) => {
              const Icon = doc.icon;
              const isActive = activeDoc.id === doc.id;
              
              return (
                <div
                  key={doc.id}
                  onClick={() => switchDocument(doc)}
                  className={`group relative bg-gray-50 rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer ${
                    isActive 
                      ? 'ring-2 ring-gray-900 shadow-xl' 
                      : 'hover:shadow-lg hover:bg-gray-100'
                  }`}
                >
                  <div className="flex">
                    {/* Thumbnail */}
                    <div className={`w-24 h-full min-h-[140px] bg-gradient-to-br ${doc.thumbnailColor} relative flex-shrink-0`}>
                      <div className="absolute inset-0 bg-black/10" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Icon className="w-10 h-10 text-white/90" />
                      </div>
                      
                      {/* Page count badge */}
                      <div className="absolute bottom-2 left-2 right-2">
                        <div className="bg-white/90 backdrop-blur-sm rounded px-2 py-1 text-center">
                          <span className="text-xs font-bold text-gray-800">{doc.pages}p</span>
                        </div>
                      </div>

                      {/* Type badge */}
                      <div className="absolute top-2 left-2">
                        <div className={`rounded-full p-1.5 ${
                          doc.type === 'analysis' ? 'bg-blue-500/80' : 'bg-purple-500/80'
                        }`}>
                          {doc.type === 'analysis' ? (
                            <TrendingUp className="w-3 h-3 text-white" />
                          ) : (
                            <Presentation className="w-3 h-3 text-white" />
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">{doc.date}</p>
                          <h3 className={`font-bold leading-tight mb-1 transition-colors ${
                            isActive ? 'text-gray-900' : 'text-gray-700 group-hover:text-gray-900'
                          }`}>
                            {doc.title}
                          </h3>
                          <p className="text-xs text-gray-500">{doc.subtitle}</p>
                        </div>
                        
                        {isActive && (
                          <div className="w-6 h-6 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0">
                            <ChevronRight className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                        {doc.description}
                      </p>
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {doc.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 bg-white rounded text-[10px] font-medium text-gray-600 border border-gray-200"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT: PDF Viewer */}
          <div 
            ref={viewerRef}
            className="flex-1"
          >
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 h-full min-h-[600px] lg:min-h-[750px] flex flex-col">
              {/* Viewer Header */}
              <div className="flex items-center justify-between px-5 py-4 bg-gray-900">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <div className="h-5 w-px bg-gray-700" />
                  <div className="flex items-center gap-2">
                    {activeDoc.type === 'analysis' ? (
                      <FileText className="w-4 h-4 text-blue-400" />
                    ) : (
                      <Presentation className="w-4 h-4 text-purple-400" />
                    )}
                    <span className="text-sm text-gray-200 font-medium truncate max-w-[200px] sm:max-w-[300px]">
                      {activeDoc.title}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 hidden sm:inline">
                    {activeDoc.pages} pages
                  </span>
                  <div className="h-4 w-px bg-gray-700 hidden sm:block" />
                  <a
                    href={activeDoc.pdfUrl}
                    download
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Download</span>
                  </a>
                  <a
                    href={activeDoc.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span className="hidden sm:inline">Open</span>
                  </a>
                </div>
              </div>
              
              {/* PDF Viewer */}
              <div className="relative flex-1 bg-gray-100 min-h-[500px]">
                {isLoading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 z-10">
                    <Loader2 className="w-10 h-10 text-gray-500 animate-spin mb-4" />
                    <span className="text-sm text-gray-400">Loading PDF...</span>
                  </div>
                )}
                <iframe
                  key={activeDoc.id}
                  src={`${activeDoc.pdfUrl}#toolbar=1&navpanes=0`}
                  className="w-full h-full border-0"
                  onLoad={() => setIsLoading(false)}
                  title={activeDoc.title}
                />
              </div>
              
              {/* Footer */}
              <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <BookOpen className="w-4 h-4" />
                  <span>{activeDoc.subtitle}</span>
                </div>
                <div className="flex items-center gap-2">
                  {analyses.map((doc) => (
                    <button
                      key={doc.id}
                      onClick={() => switchDocument(doc)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        doc.id === activeDoc.id 
                          ? 'bg-gray-900 w-4' 
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                      title={doc.title}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Custom scrollbar styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </section>
  );
};

export default Analyses;
