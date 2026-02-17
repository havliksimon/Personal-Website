import { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * ChinaEffects - Atmospheric red lightning and storm effects
 * 
 * Creates a dramatic red lightning atmosphere with:
 * - Random lightning flashes across the section
 * - Red ember particles floating upward
 * - Storm cloud orbs with red tint
 * - Subtle thunder flash overlay
 */
const ChinaEffects = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const lightningRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const embersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isMobile = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768;
    if (isMobile || !sectionRef.current) return;

    const section = sectionRef.current;
    const lightning = lightningRef.current;
    const flash = flashRef.current;
    const embers = embersRef.current;

    if (!lightning || !flash || !embers) return;

    const ctx = gsap.context(() => {
      // Lightning bolt animation
      const triggerLightning = () => {
        // Random lightning path
        const paths = [
          'M200,0 L180,100 L220,150 L190,250 L210,350 L200,400',
          'M600,0 L620,80 L580,160 L610,240 L590,350 L600,450',
          'M400,0 L380,120 L420,200 L390,300 L410,400',
          'M800,0 L780,90 L820,180 L790,280 L810,380',
          'M100,0 L120,70 L80,140 L110,220 L90,320',
        ];
        
        const randomPath = paths[Math.floor(Math.random() * paths.length)];
        lightning.innerHTML = `
          <svg class="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 600">
            <path d="${randomPath}" stroke="rgba(220, 38, 38, 0.8)" stroke-width="3" fill="none" 
              filter="drop-shadow(0 0 10px rgba(220, 38, 38, 0.8)) drop-shadow(0 0 20px rgba(239, 68, 68, 0.6))"/>
            <path d="${randomPath}" stroke="rgba(255, 200, 200, 0.9)" stroke-width="1" fill="none"/>
          </svg>
        `;

        // Flash timeline
        const tl = gsap.timeline();
        
        // Quick flash
        tl.to(flash, { opacity: 0.15, duration: 0.05, ease: 'power1.out' })
          .to(flash, { opacity: 0, duration: 0.1, ease: 'power1.in' })
          .to(flash, { opacity: 0.08, duration: 0.03, ease: 'power1.out' })
          .to(flash, { opacity: 0, duration: 0.15, ease: 'power1.in' });

        // Lightning bolt flash
        tl.to(lightning, { opacity: 1, duration: 0.02 }, 0)
          .to(lightning, { opacity: 0.3, duration: 0.05 })
          .to(lightning, { opacity: 1, duration: 0.02 })
          .to(lightning, { opacity: 0, duration: 0.2 });

        // Schedule next lightning
        const nextDelay = 3 + Math.random() * 7; // 3-10 seconds
        gsap.delayedCall(nextDelay, triggerLightning);
      };

      // Start lightning loop
      gsap.delayedCall(2, triggerLightning);

      // Create floating red embers
      for (let i = 0; i < 30; i++) {
        const ember = document.createElement('div');
        const size = Math.random() * 4 + 2;
        ember.className = 'absolute rounded-full';
        ember.style.cssText = `
          width: ${size}px;
          height: ${size}px;
          left: ${Math.random() * 100}%;
          bottom: -20px;
          background: radial-gradient(circle, rgba(239, 68, 68, 0.9) 0%, rgba(220, 38, 38, 0.6) 50%, transparent 100%);
          box-shadow: 0 0 ${size * 2}px rgba(239, 68, 68, 0.8), 0 0 ${size * 4}px rgba(220, 38, 38, 0.4);
        `;
        embers.appendChild(ember);

        // Float animation
        gsap.to(ember, {
          y: -600 - Math.random() * 400,
          x: (Math.random() - 0.5) * 200,
          opacity: 0,
          scale: 0.5,
          duration: 4 + Math.random() * 4,
          repeat: -1,
          ease: 'none',
          delay: Math.random() * 5,
        });

        // Pulse glow
        gsap.to(ember, {
          boxShadow: `0 0 ${size * 3}px rgba(239, 68, 68, 1), 0 0 ${size * 6}px rgba(220, 38, 38, 0.6)`,
          duration: 0.5 + Math.random() * 0.5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      }

      // Red storm clouds
      const stormContainer = document.createElement('div');
      stormContainer.className = 'absolute inset-0 pointer-events-none overflow-hidden';
      stormContainer.style.zIndex = '0';
      section.appendChild(stormContainer);

      for (let i = 0; i < 5; i++) {
        const cloud = document.createElement('div');
        const size = 400 + Math.random() * 300;
        cloud.className = 'absolute rounded-full';
        cloud.style.cssText = `
          width: ${size}px;
          height: ${size}px;
          left: ${Math.random() * 100}%;
          top: ${Math.random() * 60}%;
          background: radial-gradient(circle, rgba(220, 38, 38, ${0.08 + Math.random() * 0.05}) 0%, rgba(185, 28, 28, 0.03) 40%, transparent 70%);
          filter: blur(80px);
        `;
        stormContainer.appendChild(cloud);

        gsap.to(cloud, {
          x: (Math.random() - 0.5) * 150,
          y: (Math.random() - 0.5) * 100,
          scale: 1.1 + Math.random() * 0.2,
          duration: 10 + Math.random() * 10,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: Math.random() * 3,
        });
      }

      return () => {
        stormContainer.remove();
      };
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Thunder flash overlay */}
      <div
        ref={flashRef}
        className="absolute inset-0 bg-red-500/20"
        style={{ opacity: 0, mixBlendMode: 'overlay', zIndex: 5 }}
      />
      
      {/* Lightning bolts */}
      <div
        ref={lightningRef}
        className="absolute inset-0"
        style={{ opacity: 0, zIndex: 4 }}
      />
      
      {/* Floating embers */}
      <div
        ref={embersRef}
        className="absolute inset-0 overflow-hidden"
        style={{ zIndex: 3 }}
      />

      {/* Red atmospheric gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(220, 38, 38, 0.05) 0%, transparent 60%)',
          zIndex: 1,
        }}
      />
    </div>
  );
};

export default ChinaEffects;
