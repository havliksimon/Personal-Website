import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { 
  Home, User, Route, Wrench, Briefcase, 
  FileText, Globe, Mail, ChevronUp
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
}

const navItems: NavItem[] = [
  { id: 'hero', label: 'Home', icon: Home, color: 'bg-gray-900' },
  { id: 'about', label: 'About', icon: User, color: 'bg-blue-500' },
  { id: 'timeline', label: 'Journey', icon: Route, color: 'bg-emerald-500' },
  { id: 'skills', label: 'Skills', icon: Wrench, color: 'bg-violet-500' },
  { id: 'projects', label: 'Projects', icon: Briefcase, color: 'bg-cyan-500' },
  { id: 'analyses', label: 'Analyses', icon: FileText, color: 'bg-amber-500' },
  { id: 'china', label: 'China', icon: Globe, color: 'bg-red-500' },
  { id: 'contact', label: 'Contact', icon: Mail, color: 'bg-pink-500' },
];

const InteractiveNav = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Show nav after scrolling past hero
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsVisible(scrollY > window.innerHeight * 0.5);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Intersection Observer to track active section
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3, rootMargin: '-10% 0px -10% 0px' }
    );

    navItems.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Animate nav visibility
    if (navRef.current) {
      gsap.to(navRef.current, {
        x: isVisible ? 0 : 100,
        opacity: isVisible ? 1 : 0,
        duration: 0.4,
        ease: 'power2.out'
      });
    }
  }, [isVisible]);

  useEffect(() => {
    // Animate menu expansion
    if (menuRef.current) {
      if (isExpanded) {
        gsap.to(menuRef.current, {
          scale: 1,
          opacity: 1,
          duration: 0.3,
          ease: 'back.out(1.7)'
        });
        // Stagger animate menu items
        gsap.fromTo(
          menuRef.current.querySelectorAll('.nav-item'),
          { x: 20, opacity: 0 },
          { x: 0, opacity: 1, stagger: 0.05, duration: 0.3, ease: 'power2.out' }
        );
      } else {
        gsap.to(menuRef.current, {
          scale: 0.8,
          opacity: 0,
          duration: 0.2,
          ease: 'power2.in'
        });
      }
    }
  }, [isExpanded]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsExpanded(false);
    }
  };

  const activeItem = navItems.find(item => item.id === activeSection);

  return (
    <div
      ref={navRef}
      className="fixed right-4 bottom-8 z-[100] hidden md:flex flex-col items-end gap-3"
      style={{ opacity: 0, transform: 'translateX(100px)' }}
    >
      {/* Expanded Menu - positioned above the toggle button */}
      <div
        ref={menuRef}
        className="bg-white rounded-2xl shadow-2xl border border-gray-100 py-3 px-2 min-w-[180px] mb-2"
        style={{ opacity: 0, transform: 'scale(0.8)', transformOrigin: 'bottom right', pointerEvents: isExpanded ? 'auto' : 'none' }}
        onMouseLeave={() => setIsExpanded(false)}
      >
        {/* Header */}
        <div className="px-3 pb-2 mb-2 border-b border-gray-100">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Jump to</p>
        </div>

        {/* Nav Items */}
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 group ${
                  isActive 
                    ? 'bg-gray-50' 
                    : 'hover:bg-gray-50'
                }`}
                data-cursor-hover
              >
                {/* Icon with color indicator */}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                  isActive ? item.color : 'bg-gray-100 group-hover:bg-white'
                }`}>
                  <Icon className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-white' : 'text-gray-500'
                  }`} />
                </div>
                
                {/* Label */}
                <div className="flex-1">
                  <span className={`text-sm font-medium transition-colors ${
                    isActive ? 'text-gray-900' : 'text-gray-600'
                  }`}>
                    {item.label}
                  </span>
                </div>
                
                {/* Active indicator */}
                {isActive && (
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-900" />
                )}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-2 pt-2 border-t border-gray-100 px-3">
          <button
            onClick={() => scrollToSection('hero')}
            className="flex items-center gap-2 text-xs text-gray-400 hover:text-gray-600 transition-colors"
            data-cursor-hover
          >
            <ChevronUp className="w-3 h-3" />
            Back to top
          </button>
        </div>
      </div>

      {/* Main Toggle Button - at the bottom */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        onMouseEnter={() => setIsExpanded(true)}
        className="relative w-12 h-12 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center hover:shadow-xl transition-shadow group"
        data-cursor-hover
      >
        {/* Active indicator dot */}
        <div className={`absolute inset-1.5 rounded-full ${activeItem?.color || 'bg-gray-900'} opacity-20 group-hover:opacity-30 transition-opacity`} />
        
        {/* Icon */}
        <div className="relative">
          {activeItem && <activeItem.icon className="w-5 h-5 text-gray-700" />}
        </div>
        
        {/* Pulse animation */}
        <div className={`absolute inset-0 rounded-full ${activeItem?.color || 'bg-gray-900'} opacity-20 animate-ping`} style={{ animationDuration: '2s' }} />
        
        {/* Tooltip on hover when collapsed */}
        {!isExpanded && (
          <div className="absolute right-14 top-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-gray-900 text-white text-xs font-medium px-3 py-1.5 rounded-lg whitespace-nowrap">
              {activeItem?.label}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 w-2 h-2 bg-gray-900 rotate-45" />
            </div>
          </div>
        )}
      </button>
    </div>
  );
};

export default InteractiveNav;
