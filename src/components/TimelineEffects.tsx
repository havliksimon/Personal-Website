import { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * TimelineEffects - Emerald/growth theme ambient effects
 * 
 * Creates a journey/progression atmosphere with:
 * - Floating emerald particles rising upward
 * - Soft gradient orbs
 * - Subtle trail effects
 */
const TimelineEffects = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isMobile = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768;
    if (isMobile || !sectionRef.current) return;

    const section = sectionRef.current;

    const ctx = gsap.context(() => {
      // Create floating emerald particles (rising up like growth)
      if (particlesRef.current) {
        for (let i = 0; i < 30; i++) {
          const particle = document.createElement('div');
          const size = Math.random() * 5 + 2;
          particle.className = 'absolute rounded-full';
          particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${Math.random() * 100}%;
            bottom: -20px;
            background: radial-gradient(circle, rgba(16, 185, 129, ${0.5 + Math.random() * 0.3}) 0%, rgba(59, 130, 246, 0.2) 50%, transparent 100%);
            box-shadow: 0 0 ${size * 2}px rgba(16, 185, 129, 0.5);
          `;
          particlesRef.current.appendChild(particle);

          // Rising animation (growth metaphor)
          gsap.to(particle, {
            y: -window.innerHeight - 100,
            x: (Math.random() - 0.5) * 150,
            opacity: 0,
            scale: 0.5,
            duration: 8 + Math.random() * 10,
            repeat: -1,
            ease: 'none',
            delay: Math.random() * 8,
          });
        }
      }

      // Create emerald gradient orbs
      const orbsContainer = document.createElement('div');
      orbsContainer.className = 'absolute inset-0 pointer-events-none overflow-hidden';
      orbsContainer.style.zIndex = '0';
      section.appendChild(orbsContainer);

      for (let i = 0; i < 4; i++) {
        const orb = document.createElement('div');
        const size = 400 + Math.random() * 200;
        orb.className = 'absolute rounded-full';
        orb.style.cssText = `
          width: ${size}px;
          height: ${size}px;
          left: ${Math.random() * 100}%;
          top: ${Math.random() * 100}%;
          background: radial-gradient(circle, rgba(16, 185, 129, ${0.06 + Math.random() * 0.04}) 0%, rgba(59, 130, 246, 0.03) 40%, transparent 70%);
          filter: blur(90px);
        `;
        orbsContainer.appendChild(orb);

        // Gentle floating
        gsap.to(orb, {
          x: (Math.random() - 0.5) * 120,
          y: (Math.random() - 0.5) * 100,
          scale: 1.05 + Math.random() * 0.15,
          duration: 15 + Math.random() * 12,
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

      {/* Emerald atmospheric overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 20% 30%, rgba(16, 185, 129, 0.03) 0%, transparent 40%), radial-gradient(ellipse at 80% 70%, rgba(59, 130, 246, 0.02) 0%, transparent 40%)',
          zIndex: 1,
        }}
      />
    </div>
  );
};

export default TimelineEffects;
