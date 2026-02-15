import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Code2, ExternalLink, Github, TrendingUp, 
  Sparkles, ArrowRight, X, Loader2, Globe, MousePointer2
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

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
  const kiCardRef = useRef<HTMLDivElement>(null);
  const optimizerCardRef = useRef<HTMLDivElement>(null);
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

      // KI Card animation
      gsap.fromTo(kiCardRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          delay: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: kiCardRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Optimizer Card animation
      gsap.fromTo(optimizerCardRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          delay: 0.25,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: optimizerCardRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

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

          {/* Bento Grid Layout */}
          <div className="grid md:grid-cols-12 gap-6">
            
            {/* KI AM - Left Side (spans 7 columns) */}
            <div
              ref={kiCardRef}
              onClick={() => openPreview('https://ki.verxl.com/', 'KI AM Portfolio Tracking Platform')}
              className="md:col-span-7 group relative bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 cursor-pointer"
            >
              {/* Gradient Header */}
              <div className="h-40 bg-gradient-to-r from-blue-500 to-cyan-400 relative overflow-hidden">
                <div className="absolute inset-0 bg-white/10" />
                <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-white/20 rounded-full blur-2xl" />
                <div className="absolute top-5 left-5">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="absolute top-5 right-5">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium text-white border border-white/30">
                    Live App
                  </span>
                </div>
                {/* Hover indicator */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg text-white text-sm">
                    <Globe className="w-4 h-4" />
                    Click to explore
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  KI AM Portfolio Tracking Platform
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Production-grade analyst performance tracking platform for investment clubs. Features real-time stock prices with benchmark comparisons, democratic portfolio construction via board voting, AI-assisted workflows for smart ticker matching, and comprehensive performance analytics.
                </p>
                
                {/* Tech Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {['Python', 'Flask', 'SQLAlchemy', 'Bootstrap', 'Tailwind'].map((tag, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-700"
                    >
                      <Code2 className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                </div>
                
                {/* CTA Row */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openPreview('https://ki.verxl.com/', 'KI AM Portfolio Tracking Platform');
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-all group/btn"
                  >
                    <Globe className="w-4 h-4" />
                    Explore Live App
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                  
                  <a
                    href="https://github.com/havliksimon/ki-asset-management"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                    title="View on GitHub"
                  >
                    <Github className="w-5 h-5 text-gray-700" />
                  </a>
                </div>
              </div>
            </div>

            {/* Portfolio Optimizer - Right Side (spans 5 columns) */}
            <div
              ref={optimizerCardRef}
              onClick={() => openPreview('https://optimizer.havliksimon.eu/', 'Portfolio Optimizer')}
              className="md:col-span-5 group relative bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 cursor-pointer flex flex-col"
            >
              {/* Gradient Header */}
              <div className="h-32 bg-gradient-to-r from-emerald-500 to-teal-400 relative overflow-hidden">
                <div className="absolute inset-0 bg-white/10" />
                <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/20 rounded-full blur-2xl" />
                <div className="absolute top-4 left-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                    <Sparkles className="w-7 h-7 text-white" />
                  </div>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium text-white border border-white/30">
                    Live App
                  </span>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                  Portfolio Optimizer
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-1">
                  Comprehensive quantitative portfolio optimization platform implementing Modern Portfolio Theory, Risk Parity, Black-Litterman model, Extreme Value Theory, and Monte Carlo simulation with 5,000 paths.
                </p>
                
                {/* Tech Tags */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {['Python', 'Flask', 'CVXPY', 'Plotly'].map((tag, i) => (
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
                    onClick={(e) => {
                      e.stopPropagation();
                      openPreview('https://optimizer.havliksimon.eu/', 'Portfolio Optimizer');
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-all group/btn"
                  >
                    <Globe className="w-4 h-4" />
                    Explore
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                  
                  <a
                    href="https://github.com/havliksimon/Portfolio-Optimization-Model"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                    title="View on GitHub"
                  >
                    <Github className="w-5 h-5 text-gray-700" />
                  </a>
                </div>
              </div>
            </div>

          </div>
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
