import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Code2, ExternalLink, Github, TrendingUp, 
  Sparkles, X, Loader2, Globe, MousePointer2,
  Maximize2
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
  liveUrl: string;
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
    color: 'from-blue-500 to-cyan-400',
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
    color: 'from-emerald-500 to-teal-400',
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-7xl h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-3">
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
            <span className="text-sm text-gray-600 font-medium truncate max-w-[300px]">
              {title}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
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
        
        {/* Iframe */}
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
  const leftColumnRef = useRef<HTMLDivElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  
  const [activeProject, setActiveProject] = useState<Project>(projects[1]); // Default to Optimizer
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

      // Left column animation
      gsap.fromTo(leftColumnRef.current,
        { x: -50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
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
        { x: 50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
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
        className="section bg-gray-50 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Title */}
          <div ref={titleRef} className="text-center mb-12">
            <span className="text-sm font-mono uppercase tracking-wider text-gray-400 mb-4 block">Technical Work</span>
            <h2 className="section-title">
              Featured <span className="text-red-600">Projects</span>
            </h2>
            <p className="section-subtitle mx-auto">
              Click a project to view it in the live preview, or expand for fullscreen.
            </p>
          </div>

          {/* Split Layout */}
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT: Project Cards */}
            <div ref={leftColumnRef} className="lg:col-span-5 space-y-6">
              {projects.map((project) => {
                const Icon = project.icon;
                const isActive = activeProject.id === project.id;
                
                return (
                  <div
                    key={project.id}
                    onClick={() => switchProject(project)}
                    className={`group relative bg-white rounded-2xl overflow-hidden border-2 transition-all duration-300 cursor-pointer ${
                      isActive 
                        ? 'border-gray-900 shadow-xl scale-[1.02]' 
                        : 'border-gray-100 hover:border-gray-300 hover:shadow-lg'
                    }`}
                  >
                    {/* Header */}
                    <div className={`h-24 bg-gradient-to-r ${project.color} relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-white/10" />
                      <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/20 rounded-full blur-xl" />
                      
                      <div className="absolute top-4 left-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all ${
                          isActive 
                            ? 'bg-white/30 border-white/50' 
                            : 'bg-white/20 border-white/30'
                        }`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      
                      <div className="absolute top-4 right-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                          isActive 
                            ? 'bg-white/30 text-white border-white/50' 
                            : 'bg-white/20 text-white border-white/30'
                        }`}>
                          {isActive ? 'Now Previewing' : 'Click to View'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-5">
                      <h3 className={`text-lg font-semibold mb-2 transition-colors ${
                        isActive ? 'text-gray-900' : 'text-gray-700 group-hover:text-gray-900'
                      }`}>
                        {project.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed mb-4">
                        {project.description}
                      </p>
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 rounded-full text-xs text-gray-600"
                          >
                            <Code2 className="w-3 h-3" />
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      {/* Actions */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openFullscreen(project.liveUrl, project.title);
                          }}
                          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${
                            isActive 
                              ? 'bg-gray-900 text-white hover:bg-gray-800' 
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          <Maximize2 className="w-4 h-4" />
                          Expand View
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
                          <ExternalLink className="w-5 h-5 text-gray-700" />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* RIGHT: Live Preview Window */}
            <div ref={previewContainerRef} className="lg:col-span-7 lg:sticky lg:top-24">
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
                {/* Window Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <div className="w-3 h-3 rounded-full bg-yellow-400" />
                      <div className="w-3 h-3 rounded-full bg-green-400" />
                    </div>
                    <div className="h-4 w-px bg-gray-300 mx-2" />
                    <Globe className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600 font-medium">
                      {activeProject.shortTitle}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openFullscreen(activeProject.liveUrl, activeProject.title)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Fullscreen</span>
                    </button>
                    <a
                      href={activeProject.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">New Tab</span>
                    </a>
                  </div>
                </div>
                
                {/* Iframe Container */}
                <div className="relative w-full aspect-[4/3] lg:aspect-[16/10] bg-gray-100">
                  {iframeLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50">
                      <Loader2 className="w-10 h-10 text-gray-400 animate-spin mb-4" />
                      <span className="text-sm text-gray-500">Loading {activeProject.shortTitle}...</span>
                    </div>
                  )}
                  <iframe
                    key={activeProject.id} // Force remount on project switch
                    src={activeProject.liveUrl}
                    className="w-full h-full border-0"
                    onLoad={() => setIframeLoading(false)}
                    sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                    title={activeProject.title}
                  />
                </div>
                
                {/* Footer hint */}
                <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <MousePointer2 className="w-3.5 h-3.5" />
                    <span>Scroll to explore the live app</span>
                  </div>
                  <div className="text-xs text-gray-400">
                    Press a project on the left to switch
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
