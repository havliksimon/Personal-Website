import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Code2, ExternalLink, Github, TrendingUp, 
  Sparkles, X, Loader2, Globe, MousePointer2,
  Maximize2, Layers, Box, ArrowUpRight
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface Project {
  id: number;
  title: string;
  shortTitle: string;
  description: string;
  icon: React.ElementType;
  tags: string[];
  color: string;
  gradientBg: string;
  previewUrl: string;  // For iframe preview
  liveUrl: string;     // For external links
  github: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: 'KI AM Portfolio Tracking Platform',
    shortTitle: 'KI AM Platform',
    description: 'Production-grade analyst performance tracking for investment clubs with real-time stock prices, benchmark comparisons, board voting system, and AI-assisted workflows.',
    icon: TrendingUp,
    tags: ['Python', 'Flask', 'SQLAlchemy', 'Bootstrap'],
    color: 'blue',
    gradientBg: 'from-blue-500 via-cyan-500 to-blue-600',
    previewUrl: 'https://ki.verxl.com/',
    liveUrl: 'https://ki.verxl.com/',
    github: 'https://github.com/havliksimon/ki-asset-management'
  },
  {
    id: 2,
    title: 'Portfolio Optimizer',
    shortTitle: 'Optimizer',
    description: 'Quantitative portfolio optimization with Modern Portfolio Theory, Risk Parity, Black-Litterman, Extreme Value Theory, and Monte Carlo simulation.',
    icon: Sparkles,
    tags: ['Python', 'Flask', 'CVXPY', 'Plotly'],
    color: 'emerald',
    gradientBg: 'from-emerald-500 via-teal-500 to-emerald-600',
    previewUrl: 'https://optimizer.havliksimon.eu/',
    liveUrl: 'https://optimizer.havliksimon.eu/',
    github: 'https://github.com/havliksimon/Portfolio-Optimization-Model'
  }
];

// Fullscreen Modal for expanded view
interface FullscreenModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title: string;
}

const FullscreenModal = ({ isOpen, onClose, url, title }: FullscreenModalProps) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setIsLoading(true);
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-[95vw] h-[92vh] bg-white rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <button 
                onClick={onClose}
                className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors"
              />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <div className="h-4 w-px bg-gray-700 mx-2" />
            <Globe className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-300 font-medium">
              {title}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Open in new tab
            </a>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>
        
        {/* Iframe */}
        <div className="relative w-full h-[calc(100%-52px)] bg-gray-100">
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900">
              <Loader2 className="w-10 h-10 text-gray-500 animate-spin mb-4" />
              <span className="text-sm text-gray-400">Loading website...</span>
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
  const headerRef = useRef<HTMLDivElement>(null);
  const leftColumnRef = useRef<HTMLDivElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  
  const [activeProject, setActiveProject] = useState<Project>(projects[1]);
  const [iframeLoading, setIframeLoading] = useState(true);
  const [fullscreenModal, setFullscreenModal] = useState<{ isOpen: boolean; url: string; title: string }>({
    isOpen: false,
    url: '',
    title: ''
  });

  const openFullscreen = (url: string, title: string) => {
    setFullscreenModal({ isOpen: true, url, title });
  };

  const closeFullscreen = () => {
    setFullscreenModal({ isOpen: false, url: '', title: '' });
  };

  const switchProject = (project: Project) => {
    setActiveProject(project);
    setIframeLoading(true);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation
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

      // Left column animation
      gsap.fromTo(leftColumnRef.current,
        { x: -80, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.9,
          delay: 0.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: leftColumnRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Preview container animation
      gsap.fromTo(previewContainerRef.current,
        { x: 80, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.9,
          delay: 0.3,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: previewContainerRef.current,
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
        className="relative py-20 md:py-28 bg-gray-50/80 backdrop-blur-sm overflow-hidden"
      >
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-100/50 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-tl from-emerald-100/50 to-transparent rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-[1600px] mx-auto">
          
          {/* FULL WIDTH HEADER */}
          <div ref={headerRef} className="px-6 md:px-12 lg:px-16 mb-12">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              {/* Left: Title */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200 shadow-sm">
                    <Layers className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-mono text-gray-500 uppercase tracking-wider">Live Preview</span>
                  </div>
                  <div className="h-px flex-1 max-w-[100px] bg-gradient-to-r from-gray-300 to-transparent" />
                </div>
                
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Featured{' '}
                  <span className="relative inline-block">
                    <span className="relative z-10 bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
                      Projects
                    </span>
                    <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                      <path d="M2 8C50 2 150 2 198 8" stroke="currentColor" strokeWidth="3" className="text-red-200" strokeLinecap="round"/>
                    </svg>
                  </span>
                </h2>
              </div>

              {/* Right: Description */}
              <div className="lg:max-w-md lg:text-right">
                <p className="text-lg text-gray-600 leading-relaxed">
                  Interactive web applications combining{' '}
                  <span className="text-gray-900 font-medium">financial expertise</span>{' '}
                  with modern web development. Click to explore live previews.
                </p>
                <div className="mt-4 flex items-center gap-4 lg:justify-end">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Box className="w-4 h-4" />
                    <span>2 Live Apps</span>
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Globe className="w-4 h-4" />
                    <span>Production Ready</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SPLIT LAYOUT - Extended to edges */}
          <div className="flex flex-col lg:flex-row">
            
            {/* LEFT: Project Cards - Narrower, pushed to edge */}
            <div 
              ref={leftColumnRef} 
              className="w-full lg:w-[380px] xl:w-[420px] flex-shrink-0 px-6 md:px-12 lg:pl-12 lg:pr-6"
            >
              <div className="space-y-5">
                {projects.map((project, index) => {
                  const Icon = project.icon;
                  const isActive = activeProject.id === project.id;
                  
                  return (
                    <div
                      key={project.id}
                      onClick={() => switchProject(project)}
                      className={`gloss-card group relative bg-white rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer ${
                        isActive 
                          ? 'ring-2 ring-gray-900 shadow-2xl scale-[1.02]' 
                          : 'ring-1 ring-gray-200 hover:ring-gray-400 hover:shadow-xl'
                      }`}
                    >
                      {/* Header with gradient */}
                      <div className={`h-28 bg-gradient-to-r ${project.gradientBg} relative overflow-hidden`}>
                        <div className="absolute inset-0 bg-black/10" />
                        
                        {/* Pattern overlay */}
                        <div className="absolute inset-0 opacity-20" style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        }} />
                        
                        <div className="absolute top-4 left-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center backdrop-blur-md border transition-all ${
                            isActive 
                              ? 'bg-white/30 border-white/50' 
                              : 'bg-white/20 border-white/30'
                          }`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                        </div>
                        
                        <div className="absolute top-4 right-4">
                          <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-md border transition-all ${
                            isActive 
                              ? 'bg-white/30 text-white border-white/50' 
                              : 'bg-white/20 text-white/90 border-white/30'
                          }`}>
                            {isActive && <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />}
                            {isActive ? 'Live Preview' : `Project ${index + 1}`}
                          </span>
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="p-5">
                        <h3 className={`text-lg font-bold mb-2 transition-colors ${
                          isActive ? 'text-gray-900' : 'text-gray-700 group-hover:text-gray-900'
                        }`}>
                          {project.title}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                          {project.description}
                        </p>
                        
                        {/* Tags */}
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {project.tags.map((tag, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 rounded-md text-xs text-gray-600 font-medium"
                            >
                              <Code2 className="w-3 h-3" />
                              {tag}
                            </span>
                          ))}
                        </div>
                        
                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openFullscreen(project.previewUrl, project.title);
                            }}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                              isActive 
                                ? 'bg-gray-900 text-white hover:bg-gray-800' 
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            <Maximize2 className="w-4 h-4" />
                            Fullscreen
                          </button>
                          
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-2.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                            title="View on GitHub"
                          >
                            <Github className="w-5 h-5 text-gray-700" />
                          </a>
                          
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-2.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                            title="Open in new tab"
                          >
                            <ArrowUpRight className="w-5 h-5 text-gray-700" />
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RIGHT: Live Preview - Extended full width */}
            <div 
              ref={previewContainerRef} 
              className="flex-1 mt-8 lg:mt-0 lg:pl-4 pr-0"
            >
              <div className="bg-white shadow-2xl overflow-hidden h-full min-h-[600px] lg:min-h-[700px] xl:min-h-[750px] flex flex-col">
                {/* Window Header - Dark theme */}
                <div className="flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    <div className="h-4 w-px bg-gray-700 mx-2" />
                    <Globe className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-300 font-medium">
                      {activeProject.shortTitle}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openFullscreen(activeProject.previewUrl, activeProject.title)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Expand</span>
                    </button>
                    <a
                      href={activeProject.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">New Tab</span>
                    </a>
                  </div>
                </div>
                
                {/* Iframe Container - Tall */}
                <div className="relative flex-1 bg-gray-100 min-h-[500px] lg:min-h-0">
                  {iframeLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 z-10">
                      <div className="relative">
                        <div className={`w-16 h-16 rounded-full border-4 border-gray-700 border-t-${activeProject.color}-500 animate-spin`} />
                      </div>
                      <span className="mt-4 text-sm text-gray-400">Loading {activeProject.shortTitle}...</span>
                    </div>
                  )}
                  <iframe
                    key={activeProject.id}
                    src={activeProject.previewUrl}
                    className="w-full h-full border-0"
                    onLoad={() => setIframeLoading(false)}
                    sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                    title={activeProject.title}
                  />
                </div>
                
                {/* Footer bar */}
                <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MousePointer2 className="w-4 h-4" />
                    <span>Scroll to explore</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <span>Click cards on the left to switch projects</span>
                    <div className="flex gap-1">
                      {projects.map((p) => (
                        <div 
                          key={p.id}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            p.id === activeProject.id ? 'bg-gray-900' : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Fullscreen Modal */}
      <FullscreenModal
        isOpen={fullscreenModal.isOpen}
        onClose={closeFullscreen}
        url={fullscreenModal.url}
        title={fullscreenModal.title}
      />
    </>
  );
};

export default Projects;
