import { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * ContactEffects - Pink/purple warm theme ambient effects
 * 
 * Creates a warm, welcoming atmosphere with:
 * - Soft floating particles
 * - Pink and purple gradient orbs
 * - Gentle pulse effects
 */
const ContactEffects = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isMobile = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768;
    if (isMobile || !sectionRef.current) return;

    const section = sectionRef.current;

    const ctx = gsap.context(() => {
      // Create soft pink/purple particles
      if (particlesRef.current) {
        for (let i = 0; i < 25; i++) {
          const particle = document.createElement('div');
          const size = Math.random() * 6 + 2;
          const isPink = Math.random() > 0.4;
          const color = isPink ? '236, 72, 153' : '168, 85, 247';
          
          particle.className = 'absolute rounded-full';
          particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            background: radial-gradient(circle, rgba(${color}, ${0.45 + Math.random() * 0.25}) 0%, transparent 100%);
            box-shadow: 0 0 ${size * 2}px rgba(${color}, 0.4);
          `;
          particlesRef.current.appendChild(particle);

          // Soft floating animation
          gsap.to(particle, {
            y: -90 - Math.random() * 140,
            x: (Math.random() - 0.5) * 100,
            opacity: 0,
            duration: 8 + Math.random() * 9,
            repeat: -1,
            ease: 'none',
            delay: Math.random() * 7,
          });
        }
      }

      // Create pink/purple gradient orbs
      const orbsContainer = document.createElement('div');
      orbsContainer.className = 'absolute inset-0 pointer-events-none overflow-hidden';
      orbsContainer.style.zIndex = '0';
      section.appendChild(orbsContainer);

      for (let i = 0; i < 4; i++) {
        const orb = document.createElement('div');
        const size = 380 + Math.random() * 220;
        const isPink = i % 2 === 0;
        const color = isPink ? '236, 72, 153' : '168, 85, 247';
        
        orb.className = 'absolute rounded-full';
        orb.style.cssText = `
          width: ${size}px;
          height: ${size}px;
          left: ${Math.random() * 100}%;
          top: ${Math.random() * 100}%;
          background: radial-gradient(circle, rgba(${color}, ${0.06 + Math.random() * 0.04}) 0%, transparent 70%);
          filter: blur(85px);
        `;
        orbsContainer.appendChild(orb);

        // Gentle breathing animation
        gsap.to(orb, {
          x: (Math.random() - 0.5) * 100,
          y: (Math.random() - 0.5) * 80,
          scale: 1.05 + Math.random() * 0.15,
          duration: 12 + Math.random() * 10,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: Math.random() * 5,
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

      {/* Top gradient fade for smooth transition from gray-50 (China ends in gray-50) */}
      <div
        className="absolute inset-x-0 top-0 h-48 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(249,250,251,0.9) 0%, rgba(249,250,251,0.5) 50%, transparent 100%)',
          zIndex: 3,
        }}
      />

      {/* Pink atmospheric overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 45% 30%, rgba(236, 72, 153, 0.03) 0%, transparent 50%), radial-gradient(ellipse at 55% 70%, rgba(168, 85, 247, 0.02) 0%, transparent 50%)',
          zIndex: 1,
        }}
      />
    </div>
  );
};

export default ContactEffects;
