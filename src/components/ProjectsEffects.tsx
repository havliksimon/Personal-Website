import { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * ProjectsEffects - Cyan/tech theme ambient effects
 * 
 * Creates a tech/innovation atmosphere with:
 * - Digital-style floating particles
 * - Cyan and blue gradient orbs
 * - Grid-like subtle patterns
 */
const ProjectsEffects = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isMobile = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768;
    if (isMobile || !sectionRef.current) return;

    const section = sectionRef.current;

    const ctx = gsap.context(() => {
      // Create tech-style particles (more uniform, grid-like movement)
      if (particlesRef.current) {
        for (let i = 0; i < 40; i++) {
          const particle = document.createElement('div');
          const size = Math.random() * 4 + 1;
          const isCyan = Math.random() > 0.4;
          const color = isCyan ? '6, 182, 212' : '59, 130, 246';
          
          particle.className = 'absolute rounded-full';
          particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            background: radial-gradient(circle, rgba(${color}, ${0.6 + Math.random() * 0.3}) 0%, transparent 100%);
            box-shadow: 0 0 ${size * 3}px rgba(${color}, 0.6);
          `;
          particlesRef.current.appendChild(particle);

          // Tech-style movement (more linear)
          const tl = gsap.timeline({ repeat: -1, delay: Math.random() * 5 });
          tl.to(particle, {
            y: -150 - Math.random() * 200,
            x: (Math.random() - 0.5) * 80,
            opacity: 0,
            duration: 6 + Math.random() * 6,
            ease: 'none',
          });
        }
      }

      // Create cyan/blue gradient orbs
      const orbsContainer = document.createElement('div');
      orbsContainer.className = 'absolute inset-0 pointer-events-none overflow-hidden';
      orbsContainer.style.zIndex = '0';
      section.appendChild(orbsContainer);

      for (let i = 0; i < 5; i++) {
        const orb = document.createElement('div');
        const size = 420 + Math.random() * 280;
        const isCyan = i % 2 === 0;
        const color = isCyan ? '6, 182, 212' : '59, 130, 246';
        
        orb.className = 'absolute rounded-full';
        orb.style.cssText = `
          width: ${size}px;
          height: ${size}px;
          left: ${Math.random() * 100}%;
          top: ${Math.random() * 100}%;
          background: radial-gradient(circle, rgba(${color}, ${0.08 + Math.random() * 0.04}) 0%, transparent 70%);
          filter: blur(90px);
        `;
        orbsContainer.appendChild(orb);

        // Tech pulse animation
        gsap.to(orb, {
          x: (Math.random() - 0.5) * 100,
          y: (Math.random() - 0.5) * 90,
          scale: 1.05 + Math.random() * 0.2,
          duration: 8 + Math.random() * 8,
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

      {/* Cyan atmospheric overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 25% 30%, rgba(6, 182, 212, 0.04) 0%, transparent 50%), radial-gradient(ellipse at 75% 70%, rgba(59, 130, 246, 0.03) 0%, transparent 50%)',
          zIndex: 1,
        }}
      />
    </div>
  );
};

export default ProjectsEffects;
