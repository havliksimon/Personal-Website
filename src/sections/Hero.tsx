import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Linkedin, Mail } from 'lucide-react';

const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if mobile - skip heavy animations on mobile
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    
    const ctx = gsap.context(() => {
      // Only run heavy animations on desktop
      if (!isMobile) {
        // Floating particles
        const particles = particlesRef.current;
        if (particles) {
          for (let i = 0; i < 150; i++) {
            const particle = document.createElement('div');
            particle.className = 'absolute rounded-full';
            const size = Math.random() * 8 + 2;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            const hue = Math.random() > 0.5 ? 200 + Math.random() * 60 : 260 + Math.random() * 40;
            particle.style.background = `hsla(${hue}, 80%, 70%, ${Math.random() * 0.6 + 0.3})`;
            particle.style.boxShadow = `0 0 ${size * 3}px hsla(${hue}, 80%, 70%, 0.8), 0 0 ${size * 6}px hsla(${hue}, 80%, 70%, 0.4)`;
            particles.appendChild(particle);

            gsap.to(particle, {
              y: -400 - Math.random() * 500,
              x: (Math.random() - 0.5) * 300,
              opacity: 0,
              duration: 8 + Math.random() * 12,
              repeat: -1,
              ease: 'none',
              delay: Math.random() * 10
            });
          }
        }

        // Smoke clouds
        const smokeContainer = document.createElement('div');
        smokeContainer.className = 'absolute inset-0 pointer-events-none';
        smokeContainer.style.zIndex = '0';
        sectionRef.current?.appendChild(smokeContainer);
        
        for (let i = 0; i < 15; i++) {
          const cloud = document.createElement('div');
          cloud.className = 'absolute rounded-full';
          const size = 300 + Math.random() * 500;
          cloud.style.width = `${size}px`;
          cloud.style.height = `${size}px`;
          cloud.style.left = `${Math.random() * 100}%`;
          cloud.style.bottom = `${Math.random() * 50}%`;
          cloud.style.background = `radial-gradient(circle, rgba(180,200,255,${0.3 + Math.random() * 0.2}) 0%, rgba(200,180,255,${0.15}) 40%, transparent 70%)`;
          cloud.style.filter = 'blur(80px)';
          smokeContainer.appendChild(cloud);

          gsap.to(cloud, {
            y: -200 - Math.random() * 300,
            x: (Math.random() - 0.5) * 200,
            scale: 1.3,
            duration: 15 + Math.random() * 15,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: Math.random() * 5
          });
        }

        // Rain drops
        const rainContainer = document.createElement('div');
        rainContainer.className = 'absolute inset-0 pointer-events-none';
        rainContainer.style.zIndex = '1';
        sectionRef.current?.appendChild(rainContainer);
        
        for (let i = 0; i < 60; i++) {
          const drop = document.createElement('div');
          drop.className = 'absolute';
          drop.style.width = '1px';
          drop.style.height = `${Math.random() * 25 + 15}px`;
          drop.style.left = `${Math.random() * 100}%`;
          drop.style.top = '-50px';
          drop.style.background = `linear-gradient(to bottom, transparent, rgba(180,200,255,${Math.random() * 0.5 + 0.3}))`;
          drop.style.borderRadius = '1px';
          rainContainer.appendChild(drop);

          gsap.to(drop, {
            y: window.innerHeight + 100,
            duration: 0.6 + Math.random() * 0.4,
            repeat: -1,
            ease: 'none',
            delay: Math.random() * 3
          });
        }
      }

      // Portrait animation - run on both
      gsap.fromTo(portraitRef.current,
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.8, ease: 'power3.out', delay: 0.3 }
      );

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden"
      style={{ 
        background: 'linear-gradient(180deg, #e8eaf0 0%, #f0f2f5 30%, #f5f7fa 60%, #fafbfc 100%)'
      }}
    >
      {/* Background orbs - hidden on mobile */}
      <div className="hidden md:block absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${500 + i * 150}px`,
              height: `${500 + i * 150}px`,
              left: `${-20 + i * 20}%`,
              top: `${-30 + i * 8}%`,
              background: `radial-gradient(circle, rgba(200,210,255,0.25) 0%, rgba(220,200,255,0.15) 40%, transparent 70%)`,
              filter: 'blur(80px)',
              animation: `floatOrb ${20 + i * 4}s ease-in-out infinite`,
              animationDelay: `${i * 2}s`
            }}
          />
        ))}
      </div>

      {/* Floating particles - hidden on mobile */}
      <div ref={particlesRef} className="hidden md:block absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }} />

      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-50 px-8 py-6 flex items-center justify-between">
        <span className="text-lg font-medium text-gray-900">Šimon Havlík</span>
        
        <div className="hidden md:flex items-center gap-8">
          <a href="#about" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">About</a>
          <a href="#timeline" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Journey</a>
          <a href="#skills" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Skills</a>
          <a href="#projects" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Projects</a>
          <a href="#analyses" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Analyses</a>
          <a href="#china" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">China</a>
          <a href="#education" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Education</a>
          <a href="#contact" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Contact</a>
        </div>
        
        <a
          href="https://linkedin.com/in/havliksimon"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors"
        >
          <Linkedin className="w-4 h-4" />
          LinkedIn
        </a>
      </nav>

      {/* Desktop Layout */}
      <div className="hidden md:block absolute inset-0">
        {/* Portrait - Desktop */}
        <div
          ref={portraitRef}
          className="absolute flex justify-center items-end"
          style={{ 
            zIndex: 10, 
            bottom: '0',
            left: '50%',
            transform: 'translateX(-50%)',
            height: '90vh',
            width: '100%'
          }}
        >
          <img
            src="./images/hero-portrait.png"
            alt="Šimon Havlík"
            style={{ 
              height: '100%',
              width: 'auto',
              maxWidth: '100%',
              objectFit: 'contain',
              objectPosition: 'bottom center'
            }}
          />
        </div>

        {/* Gradient blur - Desktop only */}
        <div 
          className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{ 
            zIndex: 15,
            height: '50vh',
            backdropFilter: 'blur(0px)',
            WebkitBackdropFilter: 'blur(0px)',
            background: 'linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0.95) 10%, rgba(255,255,255,0.8) 25%, rgba(255,255,255,0.5) 45%, rgba(255,255,255,0.2) 65%, rgba(255,255,255,0.05) 80%, transparent 100%)'
          }}
        />

        {/* Desktop Content */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 20 }}>
          {/* Left side - at 6% from left */}
          <div 
            className="absolute pointer-events-auto text-left"
            style={{ 
              bottom: '18vh', 
              maxWidth: '420px',
              left: '6%'
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm text-gray-500 font-mono uppercase tracking-wider">Investment Analyst</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-semibold text-gray-900 leading-tight">
              Economics student<br />
              specializing in <span className="italic">Asia-Pacific</span><br />
              markets and <span className="italic">data-driven</span><br />
              analysis
            </h1>
          </div>

          {/* Right side - at 6% from right */}
          <div 
            className="absolute text-right pointer-events-auto"
            style={{ 
              bottom: '18vh', 
              maxWidth: '280px',
              right: '6%'
            }}
          >
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              VŠE Prague · Klub Investorů · Python · SQL · R · Mandarin (HSK3)
            </p>
            <a 
              href="#contact" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors"
            >
              <Mail className="w-4 h-4" />
              Get in Touch
            </a>
          </div>
        </div>
      </div>

      {/* Mobile Layout - Flex column */}
      <div className="md:hidden relative flex flex-col min-h-screen" style={{ zIndex: 10 }}>
        {/* Spacer for nav */}
        <div className="h-20 shrink-0" />
        
        {/* Portrait container with gradient overlay */}
        <div className="relative shrink-0" style={{ height: '58vh' }}>
          <div
            ref={portraitRef}
            className="flex justify-center items-end h-full w-full"
          >
            <img
              src="./images/hero-portrait.png"
              alt="Šimon Havlík"
              style={{ 
                height: '100%',
                width: 'auto',
                maxWidth: '100%',
                objectFit: 'contain',
                objectPosition: 'bottom center'
              }}
            />
          </div>
          
          {/* Strong blur gradient overlay on portrait bottom */}
          <div 
            className="absolute bottom-0 left-0 right-0 pointer-events-none"
            style={{ 
              zIndex: 15,
              height: '35%',
              background: 'linear-gradient(to top, rgba(250,251,252,1) 0%, rgba(250,251,252,0.9) 20%, rgba(250,251,252,0.6) 50%, rgba(250,251,252,0.2) 80%, transparent 100%)'
            }}
          />
        </div>

        {/* Content - Mobile with matching background */}
        <div className="flex-1 flex flex-col justify-start px-6 pb-8" style={{ background: '#fafbfc' }}>
          <div className="pointer-events-auto w-full text-center pt-2">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-gray-500 font-mono uppercase tracking-wider">Investment Analyst</span>
            </div>
            <h1 className="text-lg font-semibold text-gray-900 leading-tight">
              Economics student<br />
              specializing in <span className="italic">Asia-Pacific</span><br />
              markets and <span className="italic">data-driven</span><br />
              analysis
            </h1>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes floatOrb {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(40px, -30px) scale(1.05); }
        }
      `}</style>
    </section>
  );
};

export default Hero;
