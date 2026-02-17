import { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * AnalysesEffects - Amber/orange analytical theme ambient effects
 * 
 * Creates a warm, analytical atmosphere with:
 * - Warm floating particles
 * - Amber and orange gradient orbs
 * - Subtle glow effects
 */
const AnalysesEffects = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isMobile = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768;
    if (isMobile || !sectionRef.current) return;

    const section = sectionRef.current;

    const ctx = gsap.context(() => {
      // Create warm amber/orange particles
      if (particlesRef.current) {
        for (let i = 0; i < 30; i++) {
          const particle = document.createElement('div');
          const size = Math.random() * 6 + 2;
          const isAmber = Math.random() > 0.4;
          const color = isAmber ? '245, 158, 11' : '249, 115, 22';
          
          particle.className = 'absolute rounded-full';
          particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            background: radial-gradient(circle, rgba(${color}, ${0.5 + Math.random() * 0.3}) 0%, transparent 100%);
            box-shadow: 0 0 ${size * 2}px rgba(${color}, 0.5);
          `;
          particlesRef.current.appendChild(particle);

          // Warm floating animation
          gsap.to(particle, {
            y: -100 - Math.random() * 160,
            x: (Math.random() - 0.5) * 110,
            opacity: 0,
            duration: 7 + Math.random() * 8,
            repeat: -1,
            ease: 'none',
            delay: Math.random() * 6,
          });
        }
      }

      // Create amber/orange gradient orbs
      const orbsContainer = document.createElement('div');
      orbsContainer.className = 'absolute inset-0 pointer-events-none overflow-hidden';
      orbsContainer.style.zIndex = '0';
      section.appendChild(orbsContainer);

      for (let i = 0; i < 5; i++) {
        const orb = document.createElement('div');
        const size = 400 + Math.random() * 250;
        const isAmber = i % 2 === 0;
        const color = isAmber ? '245, 158, 11' : '249, 115, 22';
        
        orb.className = 'absolute rounded-full';
        orb.style.cssText = `
          width: ${size}px;
          height: ${size}px;
          left: ${Math.random() * 100}%;
          top: ${Math.random() * 100}%;
          background: radial-gradient(circle, rgba(${color}, ${0.07 + Math.random() * 0.04}) 0%, transparent 70%);
          filter: blur(90px);
        `;
        orbsContainer.appendChild(orb);

        // Warm pulse animation
        gsap.to(orb, {
          x: (Math.random() - 0.5) * 110,
          y: (Math.random() - 0.5) * 90,
          scale: 1.06 + Math.random() * 0.16,
          duration: 13 + Math.random() * 10,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: Math.random() * 4,
        });
      }

      return () => {
        orbsContainer.remove();
      };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Particles container */}
      <div ref={particlesRef} className="absolute inset-0" style={{ zIndex: 2 }} />

      {/* Top gradient fade for smooth transition from gray-50 */}
      <div
        className="absolute inset-x-0 top-0 h-48 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(249,250,251,0.9) 0%, rgba(249,250,251,0.5) 50%, transparent 100%)',
          zIndex: 3,
        }}
      />

      {/* Amber atmospheric overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 35% 25%, rgba(245, 158, 11, 0.04) 0%, transparent 50%), radial-gradient(ellipse at 65% 75%, rgba(249, 115, 22, 0.03) 0%, transparent 50%)',
          zIndex: 1,
        }}
      />
    </div>
  );
};

export default AnalysesEffects;
