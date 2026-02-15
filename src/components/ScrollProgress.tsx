import { useEffect, useState } from 'react';

const sections = [
  { id: 'hero', label: 'Start' },
  { id: 'about', label: 'About' },
  { id: 'journey', label: 'Journey' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'china', label: 'China' },
  { id: 'contact', label: 'Contact' },
];

const ScrollProgress = () => {
  const [progress, setProgress] = useState(0);
  const [activeSection, setActiveSection] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(Math.min(100, Math.max(0, scrollPercent)));

      // Determine active section
      const sectionElements = sections.map(s => document.getElementById(s.id)).filter(Boolean);
      const viewportCenter = window.innerHeight / 2;
      
      let currentSection = 0;
      sectionElements.forEach((el, index) => {
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= viewportCenter) {
            currentSection = index;
          }
        }
      });
      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Right Side - Progress Bar & Section Indicators */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-3">
        {/* Section dots */}
        <div className="flex flex-col gap-4">
          {sections.map((section, index) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="group relative flex items-center justify-center w-3 h-3"
              aria-label={`Go to ${section.label}`}
            >
              {/* Dot */}
              <span
                className={`block w-2 h-2 rounded-full transition-all duration-300 ${
                  index <= activeSection
                    ? 'bg-gray-900 scale-110'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
              
              {/* Label on hover */}
              <span
                className={`absolute right-5 whitespace-nowrap text-xs font-medium text-gray-600 transition-all duration-200 ${
                  hoveredIndex === index
                    ? 'opacity-100 translate-x-0'
                    : 'opacity-0 translate-x-2 pointer-events-none'
                }`}
              >
                {section.label}
              </span>
            </button>
          ))}
        </div>

        {/* Progress bar */}
        <div className="relative w-0.5 h-24 bg-gray-200 rounded-full mt-2 overflow-hidden">
          <div
            className="absolute bottom-0 left-0 w-full bg-gray-900 rounded-full transition-all duration-150 ease-out"
            style={{ height: `${progress}%` }}
          />
        </div>

        {/* Percentage */}
        <span className="text-[10px] font-mono text-gray-400 mt-1">
          {Math.round(progress)}%
        </span>
      </div>

      {/* Left Side - Vertical Section Names */}
      <div className="fixed left-6 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-start gap-6">
        {sections.map((section, index) => {
          const isActive = index === activeSection;
          const isPast = index < activeSection;
          
          return (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={`group flex items-center gap-3 transition-all duration-300 ${
                isActive ? 'opacity-100' : 'opacity-30 hover:opacity-60'
              }`}
            >
              {/* Number */}
              <span
                className={`text-[10px] font-mono transition-colors duration-300 ${
                  isActive || isPast ? 'text-gray-900' : 'text-gray-400'
                }`}
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              
              {/* Vertical text */}
              <span
                className={`text-[11px] font-medium tracking-widest uppercase transition-colors duration-300 [writing-mode:vertical-lr] rotate-180 ${
                  isActive ? 'text-gray-900' : 'text-gray-400'
                }`}
                style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
              >
                {section.label}
              </span>
              
              {/* Active indicator line */}
              <span
                className={`w-px h-8 transition-all duration-300 ${
                  isActive ? 'bg-gray-900 opacity-100' : 'bg-gray-300 opacity-0'
                }`}
                style={{ writingMode: 'vertical-rl' }}
              />
            </button>
          );
        })}
      </div>

      {/* Mobile/Tablet - Simple progress bar at top */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50 lg:hidden">
        <div
          className="h-full bg-gray-900 transition-all duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </>
  );
};

export default ScrollProgress;
