import { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * SkillsEffects - Purple/pink creative theme ambient effects
 * 
 * Creates a creative, knowledge-based atmosphere with:
 * - Floating particles with varying sizes
 * - Purple and pink gradient orbs
 * - Rotating subtle elements
 */
const SkillsEffects = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isMobile = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768;
    if (isMobile || !sectionRef.current) return;

    const section = sectionRef.current;

    const ctx = gsap.context(() => {
      // Create floating particles with mixed purple/pink hues
      if (particlesRef.current) {
        for (let i = 0; i < 35; i++) {
          const particle = document.createElement('div');
          const size = Math.random() * 7 + 2;
          const isPink = Math.random() > 0.5;
          const color1 = isPink ? '236, 72, 153' : '139, 92, 246';
          const color2 = isPink ? '168, 85, 247' : '99, 102, 241';
          
          particle.className = 'absolute rounded-full';
          particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            background: radial-gradient(circle, rgba(${color1}, ${0.5 + Math.random() * 0.3}) 0%, rgba(${color2}, 0.2) 50%, transparent 100%);
            box-shadow: 0 0 ${size * 2}px rgba(${color1}, 0.5);
          `;
          particlesRef.current.appendChild(particle);

          // Floating animation with rotation
          gsap.to(particle, {
            y: -120 - Math.random() * 180,
            x: (Math.random() - 0.5) * 120,
            rotation: Math.random() * 360,
            opacity: 0,
            duration: 7 + Math.random() * 9,
            repeat: -1,
            ease: 'none',
            delay: Math.random() * 6,
          });
        }
      }

      // Create purple/pink gradient orbs
      const orbsContainer = document.createElement('div');
      orbsContainer.className = 'absolute inset-0 pointer-events-none overflow-hidden';
      orbsContainer.style.zIndex = '0';
      section.appendChild(orbsContainer);

      for (let i = 0; i < 5; i++) {
        const orb = document.createElement('div');
        const size = 380 + Math.random() * 250;
        const isPink = i % 2 === 0;
        const color = isPink ? '236, 72, 153' : '139, 92, 246';
        
        orb.className = 'absolute rounded-full';
        orb.style.cssText = `
          width: ${size}px;
          height: ${size}px;
          left: ${Math.random() * 100}%;
          top: ${Math.random() * 100}%;
          background: radial-gradient(circle, rgba(${color}, ${0.07 + Math.random() * 0.04}) 0%, transparent 70%);
          filter: blur(85px);
        `;
        orbsContainer.appendChild(orb);

        // Floating animation
        gsap.to(orb, {
          x: (Math.random() - 0.5) * 130,
          y: (Math.random() - 0.5) * 110,
          scale: 1.08 + Math.random() * 0.18,
          duration: 14 + Math.random() * 10,
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

      {/* Top gradient fade for smooth transition from gray-50 */}
      <div
        className="absolute inset-x-0 top-0 h-48 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(249,250,251,0.9) 0%, rgba(249,250,251,0.5) 50%, transparent 100%)',
          zIndex: 3,
        }}
      />

      {/* Purple atmospheric overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 40% 25%, rgba(139, 92, 246, 0.04) 0%, transparent 50%), radial-gradient(ellipse at 60% 75%, rgba(236, 72, 153, 0.03) 0%, transparent 50%)',
          zIndex: 1,
        }}
      />
    </div>
  );
};

export default SkillsEffects;
