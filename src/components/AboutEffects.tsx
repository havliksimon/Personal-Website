import { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * AboutEffects - Professional blue theme ambient effects
 * 
 * Creates a calm, professional atmosphere with:
 * - Floating blue particles
 * - Soft gradient orbs
 * - Subtle wave animations
 */
const AboutEffects = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isMobile = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768;
    if (isMobile || !sectionRef.current) return;

    const section = sectionRef.current;

    const ctx = gsap.context(() => {
      // Create floating blue particles
      if (particlesRef.current) {
        for (let i = 0; i < 25; i++) {
          const particle = document.createElement('div');
          const size = Math.random() * 6 + 2;
          particle.className = 'absolute rounded-full';
          particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            background: radial-gradient(circle, rgba(59, 130, 246, ${0.4 + Math.random() * 0.3}) 0%, rgba(99, 102, 241, 0.2) 50%, transparent 100%);
            box-shadow: 0 0 ${size * 2}px rgba(59, 130, 246, 0.4);
          `;
          particlesRef.current.appendChild(particle);

          // Gentle floating animation
          gsap.to(particle, {
            y: -100 - Math.random() * 150,
            x: (Math.random() - 0.5) * 100,
            opacity: 0,
            duration: 6 + Math.random() * 8,
            repeat: -1,
            ease: 'none',
            delay: Math.random() * 5,
          });
        }
      }

      // Create soft blue gradient orbs
      const orbsContainer = document.createElement('div');
      orbsContainer.className = 'absolute inset-0 pointer-events-none overflow-hidden';
      orbsContainer.style.zIndex = '0';
      section.appendChild(orbsContainer);

      for (let i = 0; i < 4; i++) {
        const orb = document.createElement('div');
        const size = 350 + Math.random() * 250;
        orb.className = 'absolute rounded-full';
        orb.style.cssText = `
          width: ${size}px;
          height: ${size}px;
          left: ${Math.random() * 100}%;
          top: ${Math.random() * 100}%;
          background: radial-gradient(circle, rgba(59, 130, 246, ${0.08 + Math.random() * 0.04}) 0%, rgba(99, 102, 241, 0.03) 40%, transparent 70%);
          filter: blur(80px);
        `;
        orbsContainer.appendChild(orb);

        // Slow drift animation
        gsap.to(orb, {
          x: (Math.random() - 0.5) * 100,
          y: (Math.random() - 0.5) * 80,
          scale: 1.1 + Math.random() * 0.2,
          duration: 12 + Math.random() * 10,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: Math.random() * 3,
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
      
      {/* Top gradient fade for smooth transition from white (Hero ends in white) */}
      <div
        className="absolute inset-x-0 top-0 h-48 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.6) 50%, transparent 100%)',
          zIndex: 3,
        }}
      />

      {/* Blue atmospheric gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 30% 20%, rgba(59, 130, 246, 0.04) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(99, 102, 241, 0.03) 0%, transparent 50%)',
          zIndex: 1,
        }}
      />
    </div>
  );
};

export default AboutEffects;
