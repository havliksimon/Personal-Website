import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Menu, X } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface NavigationProps {
  onNavigate: (section: string) => void;
}

const Navigation = ({ onNavigate }: NavigationProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  const navItems = [
    { label: 'About', section: 'about' },
    { label: 'Timeline', section: 'timeline' },
    { label: 'Skills', section: 'skills' },
    { label: 'Projects', section: 'projects' },
    { label: 'Analyses', section: 'analyses' },
    { label: 'China', section: 'china' },
    { label: 'Education', section: 'education' },
    { label: 'Contact', section: 'contact' }
  ];

  useEffect(() => {
    // Show nav after scrolling past hero
    ScrollTrigger.create({
      trigger: document.body,
      start: '100vh top',
      onEnter: () => setIsVisible(true),
      onLeaveBack: () => setIsVisible(false)
    });

    return () => {
      ScrollTrigger.getAll().forEach(st => {
        if (st.vars.trigger === document.body) st.kill();
      });
    };
  }, []);

  useEffect(() => {
    if (navRef.current) {
      gsap.to(navRef.current, {
        y: isVisible ? 0 : -100,
        opacity: isVisible ? 1 : 0,
        duration: 0.4,
        ease: 'power2.out'
      });
    }
  }, [isVisible]);

  const handleNavClick = (section: string) => {
    onNavigate(section);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-50 hidden md:block"
        style={{ opacity: 0, transform: 'translateY(-100px)' }}
      >
        <div className="nav-blur">
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
            {/* Wordmark */}
            <button 
              onClick={() => handleNavClick('hero')}
              className="text-white font-semibold text-lg hover:text-[#FF3B3B] transition-colors"
              data-cursor-hover
            >
              Šimon Havlík
            </button>

            {/* Status indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-white/60 text-xs font-mono">Open to opportunities</span>
            </div>

            {/* Nav Links */}
            <div className="flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.section}
                  onClick={() => handleNavClick(item.section)}
                  className="px-4 py-2 text-white/60 hover:text-white text-sm transition-colors rounded-lg hover:bg-white/5"
                  data-cursor-hover
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="w-12 h-12 rounded-full bg-black/80 backdrop-blur-xl border border-white/10 flex items-center justify-center"
          data-cursor-hover
        >
          {isMobileOpen ? (
            <X className="w-5 h-5 text-white" />
          ) : (
            <Menu className="w-5 h-5 text-white" />
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center">
          <div className="space-y-6">
            {navItems.map((item) => (
              <button
                key={item.section}
                onClick={() => handleNavClick(item.section)}
                className="block text-2xl text-white/80 hover:text-white transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Persistent Wordmark (always visible on mobile) */}
      <div className="md:hidden fixed top-4 left-4 z-40">
        <span className="text-white font-semibold text-sm">ŠH</span>
      </div>
    </>
  );
};

export default Navigation;
