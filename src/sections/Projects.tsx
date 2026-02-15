import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Code2, ExternalLink, Github, TrendingUp, Database, 
  Sparkles, ArrowRight, X, Loader2, Globe, MousePointer2
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface Project {
  id: number;
  title: string;
  description: string;
  icon: React.ElementType;
  tags: string[];
  categories: string[];
  featured: boolean;
  link: string;
  github?: string;
  liveUrl?: string;
  color: string;
  previewImage?: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: 'KI AM Portfolio Tracking Platform',
    description: 'Production-grade analyst performance tracking platform for investment clubs. Features real-time stock prices with benchmark comparisons, democratic portfolio construction via board voting, AI-assisted workflows for smart ticker matching, and comprehensive performance analytics. Built for Klub Investorů asset management team with enterprise-grade security.',
    icon: TrendingUp,
    tags: ['Python', 'Flask', 'SQLAlchemy', 'Bootstrap', 'Tailwind'],
    categories: ['web-development', 'finance', 'python'],
    featured: true,
    link: 'https://ki.verxl.com/',
    github: 'https://github.com/havliksimon/ki-asset-management',
    liveUrl: 'https://ki.verxl.com/',
    color: 'from-blue-500 to-cyan-400',
    previewImage: '/ki-preview.jpg'
  },
  {
    id: 2,
    title: 'Portfolio Optimizer',
    description: 'Comprehensive quantitative portfolio optimization platform implementing cutting-edge financial mathematics. Features Modern Portfolio Theory, Risk Parity, Black-Litterman model, Extreme Value Theory for tail risk, Monte Carlo simulation with 5,000 paths, distribution fitting with AIC/BIC selection, and Fama-French factor analysis. Bridges academic rigor with practical implementation.',
    icon: Sparkles,
    tags: ['Python', 'Flask', 'CVXPY', 'Tailwind', 'Plotly'],
    categories: ['web-development', 'finance', 'optimization'],
    featured: true,
    link: 'https://optimizer.havliksimon.eu/',
    liveUrl: 'https://optimizer.havliksimon.eu/',
    color: 'from-emerald-500 to-teal-400',
    previewImage: '/optimizer-preview.jpg'
  },
  {
    id: 4,
    title: 'Portfolio Optimization Model',
    description: 'Python implementation of Modern Portfolio Theory with risk parity allocation for emerging market portfolios using CVXPY optimization.',
    icon: Database,
    tags: ['Python', 'pandas', 'numpy', 'CVXPY'],
    categories: ['finance', 'python', 'optimization'],
    featured: false,
    link: '#',
    github: 'https://github.com/havliksimon/Portfolio-Optimization-Model',
    color: 'from-violet-500 to-purple-400'
  }
];

const categoryColors: Record<string, string> = {
  'web-development': 'bg-blue-100 text-blue-700',
  'finance': 'bg-green-100 text-green-700',
  'python': 'bg-yellow-100 text-yellow-700',
  'data-analysis': 'bg-purple-100 text-purple-700',
  'r': 'bg-cyan-100 text-cyan-700',
  'macro': 'bg-orange-100 text-orange-700',
  'optimization': 'bg-pink-100 text-pink-700'
};

// Website Preview Modal Component
interface WebsitePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title: string;
}

const WebsitePreviewModal = ({ isOpen, onClose, url, title }: WebsitePreviewModalProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [showHint, setShowHint] = useState(true);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setIsLoading(true);
      setShowHint(true);
      const timer = setTimeout(() => setShowHint(false), 4000);
      return () => {
        document.body.style.overflow = 'unset';
        clearTimeout(timer);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Container - PDF-like appearance */}
      <div className="relative w-full max-w-6xl h-[85vh] bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        {/* Header - PDF-like toolbar */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-3">
            {/* Window dots */}
            <div className="flex items-center gap-1.5">
              <button 
                onClick={onClose}
                className="w-3 h-3 rounded-full bg-red-400 hover:bg-red-500 transition-colors"
              />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <div className="h-4 w-px bg-gray-300 mx-2" />
            <Globe className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600 font-medium truncate max-w-[200px] md:max-w-md">
              {title}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Open in new tab
            </a>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
        
        {/* Scroll hint */}
        {showHint && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-10 animate-in fade-in slide-in-from-top-2 duration-500">
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-900/90 text-white text-sm rounded-full shadow-lg">
              <MousePointer2 className="w-4 h-4" />
              <span>Scroll to explore</span>
            </div>
          </div>
        )}
        
        {/* Iframe Container */}
        <div className="relative w-full h-[calc(100%-52px)] bg-gray-100">
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50">
              <Loader2 className="w-8 h-8 text-gray-400 animate-spin mb-3" />
              <span className="text-sm text-gray-500">Loading website...</span>
            </div>
          )}
          <iframe
            src={url}
            className="w-full h-full border-0"
            onLoad={() => setIsLoading(false)}
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            title={title}
          />
        </div>
      </div>
    </div>
  );
};

const Projects = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [previewModal, setPreviewModal] = useState<{ isOpen: boolean; url: string; title: string }>({
    isOpen: false,
    url: '',
    title: ''
  });

  const openPreview = (url: string, title: string) => {
    setPreviewModal({ isOpen: true, url, title });
  };

  const closePreview = () => {
    setPreviewModal({ isOpen: false, url: '', title: '' });
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(titleRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Cards animation
      cardsRef.current.forEach((card, i) => {
        if (card) {
          gsap.fromTo(card,
            { y: 50, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              delay: i * 0.15,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
              }
            }
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const featuredProjects = projects.filter(p => p.featured);
  const otherProjects = projects.filter(p => !p.featured);

  return (
    <>
      <section
        ref={sectionRef}
        id="projects"
        className="section bg-gray-50"
      >
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          {/* Title */}
          <div ref={titleRef} className="text-center mb-16">
            <span className="text-sm font-mono uppercase tracking-wider text-gray-400 mb-4 block">Technical Work</span>
            <h2 className="section-title">
              Featured <span className="text-red-600">Projects</span>
            </h2>
            <p className="section-subtitle mx-auto">
              Interactive web applications that combine financial expertise with modern web development.
              Click to explore them live!
            </p>
          </div>

          {/* Featured Projects - Large Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {featuredProjects.map((project, index) => {
              const Icon = project.icon;
              
              return (
                <div
                  key={project.id}
                  ref={el => { cardsRef.current[index] = el; }}
                  className="group relative bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
                >
                  {/* Gradient Header */}
                  <div className={`h-32 bg-gradient-to-r ${project.color} relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-white/10" />
                    <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/20 rounded-full blur-2xl" />
                    <div className="absolute top-4 left-4">
                      <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium text-white border border-white/30">
                        Live App
                      </span>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-5">
                      {project.description}
                    </p>
                    
                    {/* Tech Tags */}
                    <div className="flex flex-wrap gap-2 mb-5">
                      {project.tags.slice(0, 4).map((tag, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-700"
                        >
                          <Code2 className="w-3 h-3" />
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    {/* CTA Buttons */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => openPreview(project.liveUrl || project.link, project.title)}
                        className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-all group/btn"
                      >
                        <Globe className="w-4 h-4" />
                        Explore Live App
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                      
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                          title="View on GitHub"
                        >
                          <Github className="w-5 h-5 text-gray-700" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Other Projects - Compact Cards */}
          {otherProjects.length > 0 && (
            <div className="grid md:grid-cols-2 gap-6">
              {otherProjects.map((project, index) => {
                const Icon = project.icon;
                
                return (
                  <div
                    key={project.id}
                    ref={el => { cardsRef.current[featuredProjects.length + index] = el; }}
                    className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gray-900 flex items-center justify-center">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {project.github && (
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                            title="View on GitHub"
                          >
                            <Github className="w-4 h-4 text-gray-600" />
                          </a>
                        )}
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {project.description}
                    </p>

                    {/* Tech Tags */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {project.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-700"
                        >
                          <Code2 className="w-3 h-3" />
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Category Tags */}
                    <div className="flex flex-wrap gap-2">
                      {project.categories.map((cat, i) => (
                        <span
                          key={i}
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium ${categoryColors[cat] || 'bg-gray-100 text-gray-700'}`}
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Website Preview Modal */}
      <WebsitePreviewModal
        isOpen={previewModal.isOpen}
        onClose={closePreview}
        url={previewModal.url}
        title={previewModal.title}
      />
    </>
  );
};

export default Projects;
