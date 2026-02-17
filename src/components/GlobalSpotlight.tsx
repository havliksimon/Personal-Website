import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

// Theme colors for each section - carefully tuned for subtlety
export const sectionThemes: Record<string, { primary: string; secondary: string; accent: string }> = {
  hero: {
    primary: 'rgba(148, 163, 184, 0.30)',   // Slate blue-gray - ethereal
    secondary: 'rgba(167, 139, 250, 0.15)', // Soft purple
    accent: '#64748b',
  },
  about: {
    primary: 'rgba(59, 130, 246, 0.22)',    // Blue - professional
    secondary: 'rgba(99, 102, 241, 0.12)',  // Indigo
    accent: '#3b82f6',
  },
  journey: {
    primary: 'rgba(16, 185, 129, 0.22)',    // Emerald - growth
    secondary: 'rgba(59, 130, 246, 0.12)',  // Blue
    accent: '#10b981',
  },
  skills: {
    primary: 'rgba(139, 92, 246, 0.22)',    // Purple - creative
    secondary: 'rgba(236, 72, 153, 0.12)',  // Pink
    accent: '#8b5cf6',
  },
  projects: {
    primary: 'rgba(6, 182, 212, 0.22)',     // Cyan - tech
    secondary: 'rgba(59, 130, 246, 0.12)',  // Blue
    accent: '#06b6d4',
  },
  analyses: {
    primary: 'rgba(245, 158, 11, 0.22)',    // Amber - analytical
    secondary: 'rgba(249, 115, 22, 0.12)',  // Orange
    accent: '#f59e0b',
  },
  china: {
    primary: 'rgba(220, 38, 38, 0.20)',     // Red - bold
    secondary: 'rgba(239, 68, 68, 0.10)',   // Light red
    accent: '#dc2626',
  },
  contact: {
    primary: 'rgba(236, 72, 153, 0.20)',    // Pink - warm
    secondary: 'rgba(168, 85, 247, 0.10)',  // Purple
    accent: '#ec4899',
  },
};

/**
 * GlobalSpotlight - Website-wide interactive spotlight effect
 * 
 * Creates a mouse-following spotlight that:
 * 1. Follows the cursor with smooth, lagging animation (6% lerp factor)
 * 2. Changes colors based on the current section
 * 3. Adds ambient floating orbs for visual depth
 * 4. Includes subtle noise texture for premium feel
 * 5. Disables automatically on mobile/touch devices
 */
export const GlobalSpotlight: React.FC = () => {
  const spotlightRef = useRef<HTMLDivElement>(null);
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const currentSectionRef = useRef('hero');
  const rafId = useRef<number | undefined>(undefined);
  const [currentSection, setCurrentSection] = useState('hero');
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Check for mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Track active section based on scroll
  useEffect(() => {
    const sections = Object.keys(sectionThemes);
    
    const observers = sections.map((id) => {
      const element = document.getElementById(id);
      if (!element) return null;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
              setCurrentSection(id);
              currentSectionRef.current = id;
            }
          });
        },
        { threshold: [0, 0.3, 0.5, 1], rootMargin: '-10% 0px -10% 0px' }
      );

      observer.observe(element);
      return observer;
    });

    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  // Update spotlight colors when section changes
  useEffect(() => {
    const theme = sectionThemes[currentSection];
    if (!theme || !spotlightRef.current) return;

    // Smooth color transition using GSAP
    gsap.to(spotlightRef.current, {
      background: `radial-gradient(circle at center, ${theme.primary} 0%, ${theme.secondary} 40%, transparent 70%)`,
      duration: 0.8,
      ease: 'power2.out',
    });

    // Update ambient orbs with new colors
    if (orb1Ref.current) {
      gsap.to(orb1Ref.current, {
        background: `radial-gradient(circle, ${theme.secondary} 0%, transparent 70%)`,
        duration: 1,
        ease: 'power2.out',
      });
    }
    if (orb2Ref.current) {
      gsap.to(orb2Ref.current, {
        background: `radial-gradient(circle, ${theme.primary} 0%, transparent 70%)`,
        duration: 1,
        ease: 'power2.out',
      });
    }
  }, [currentSection]);

  // Mouse tracking animation
  useEffect(() => {
    if (isMobile) return;

    const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;

    const animate = () => {
      // Smooth follow with 6% lerp factor for elegant lag
      pos.current.x = lerp(pos.current.x, target.current.x, 0.06);
      pos.current.y = lerp(pos.current.y, target.current.y, 0.06);

      if (spotlightRef.current) {
        spotlightRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px) translate(-50%, -50%)`;
      }

      // Animate ambient orbs with gentle floating motion
      const time = Date.now() * 0.0003;
      if (orb1Ref.current) {
        const x = Math.sin(time) * 80;
        const y = Math.cos(time * 0.7) * 40;
        orb1Ref.current.style.transform = `translate(${x}px, ${y}px)`;
      }
      if (orb2Ref.current) {
        const x = Math.cos(time * 0.8) * 60;
        const y = Math.sin(time * 0.6) * 50;
        orb2Ref.current.style.transform = `translate(${x}px, ${y}px)`;
      }

      rafId.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    rafId.current = requestAnimationFrame(animate);
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isMobile, isVisible]);

  if (isMobile) return null;

  const theme = sectionThemes[currentSection] || sectionThemes.hero;

  return (
    <>
      {/* Noise texture overlay for premium feel */}
      <div 
        className="fixed inset-0 pointer-events-none z-[3] opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      />

      {/* Main spotlight - large, soft, follows cursor */}
      <div
        ref={spotlightRef}
        className="fixed top-0 left-0 pointer-events-none z-[4]"
        style={{
          width: 800,
          height: 800,
          background: `radial-gradient(circle at center, ${theme.primary} 0%, ${theme.secondary} 40%, transparent 70%)`,
          filter: 'blur(90px)',
          opacity: isVisible ? 0.85 : 0,
          transition: 'opacity 0.5s ease-out',
          willChange: 'transform, opacity',
          mixBlendMode: 'screen',
        }}
      />

      {/* Ambient orb 1 - upper right, slow drift */}
      <div
        ref={orb1Ref}
        className="fixed top-[15%] right-[20%] pointer-events-none z-[3]"
        style={{
          width: 600,
          height: 600,
          background: `radial-gradient(circle, ${theme.secondary} 0%, transparent 70%)`,
          filter: 'blur(120px)',
          opacity: isVisible ? 0.4 : 0,
          transition: 'opacity 0.8s ease-out',
          willChange: 'transform',
          mixBlendMode: 'screen',
        }}
      />

      {/* Ambient orb 2 - lower left, counter-drift */}
      <div
        ref={orb2Ref}
        className="fixed bottom-[20%] left-[15%] pointer-events-none z-[3]"
        style={{
          width: 500,
          height: 500,
          background: `radial-gradient(circle, ${theme.primary} 0%, transparent 70%)`,
          filter: 'blur(100px)',
          opacity: isVisible ? 0.35 : 0,
          transition: 'opacity 0.8s ease-out',
          willChange: 'transform',
          mixBlendMode: 'screen',
        }}
      />

      {/* Vignette overlay for depth */}
      <div 
        className="fixed inset-0 pointer-events-none z-[2]"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, transparent 50%, rgba(0,0,0,0.03) 100%)',
        }}
      />
    </>
  );
};

export default GlobalSpotlight;
