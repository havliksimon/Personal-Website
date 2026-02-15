import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';

const CustomCursor = () => {
  const cursorContainerRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorOutlineRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  
  const mousePos = useRef({ x: 0, y: 0 });
  const targetPos = useRef({ x: 0, y: 0 });
  const rafId = useRef<number | undefined>(undefined);
  const isHovering = useRef(false);
  const isClicking = useRef(false);

  useEffect(() => {
    const checkTouch = () => {
      setIsTouchDevice(window.matchMedia('(pointer: coarse)').matches);
    };
    checkTouch();
    window.addEventListener('resize', checkTouch);
    return () => window.removeEventListener('resize', checkTouch);
  }, []);

  const lerp = (start: number, end: number, factor: number) => {
    return start + (end - start) * factor;
  };

  const animate = useCallback(() => {
    if (isTouchDevice) return;

    // Smooth follow for container (slight lag for fluid feel)
    targetPos.current.x = lerp(targetPos.current.x, mousePos.current.x, 0.15);
    targetPos.current.y = lerp(targetPos.current.y, mousePos.current.y, 0.15);

    const container = cursorContainerRef.current;
    const ring = cursorRingRef.current;

    if (container) {
      container.style.transform = `translate(${targetPos.current.x}px, ${targetPos.current.y}px) translate(-50%, -50%)`;
    }

    // Dot follows precisely with no lag
    const dot = cursorDotRef.current;
    if (dot) {
      dot.style.transform = `translate(${mousePos.current.x}px, ${mousePos.current.y}px) translate(-50%, -50%)`;
    }

    // Ring has more lag for playful trailing effect
    if (ring && !isHovering.current) {
      const ringX = lerp(parseFloat(ring.dataset.x || '0'), mousePos.current.x, 0.08);
      const ringY = lerp(parseFloat(ring.dataset.y || '0'), mousePos.current.y, 0.08);
      ring.dataset.x = String(ringX);
      ring.dataset.y = String(ringY);
      ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    }

    rafId.current = requestAnimationFrame(animate);
  }, [isTouchDevice]);

  useEffect(() => {
    if (isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseDown = () => {
      isClicking.current = true;
      gsap.to(cursorDotRef.current, { 
        scale: 0.6, 
        duration: 0.1,
        ease: 'power2.out'
      });
      gsap.to(cursorOutlineRef.current, { 
        scale: 0.85, 
        duration: 0.1,
        ease: 'power2.out'
      });
    };

    const handleMouseUp = () => {
      isClicking.current = false;
      gsap.to(cursorDotRef.current, { 
        scale: 1, 
        duration: 0.3,
        ease: 'elastic.out(1, 0.5)'
      });
      gsap.to(cursorOutlineRef.current, { 
        scale: isHovering.current ? 1.5 : 1, 
        duration: 0.3,
        ease: 'elastic.out(1, 0.5)'
      });
    };

    const handleMouseEnter = () => {
      gsap.to([cursorContainerRef.current, cursorDotRef.current, cursorOutlineRef.current, cursorRingRef.current], {
        opacity: 1,
        duration: 0.2
      });
    };

    const handleMouseLeave = () => {
      gsap.to([cursorContainerRef.current, cursorDotRef.current, cursorOutlineRef.current, cursorRingRef.current], {
        opacity: 0,
        duration: 0.2
      });
    };

    // Start animation loop
    rafId.current = requestAnimationFrame(animate);

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Hover effects
    const setupHoverEffects = () => {
      const interactiveElements = document.querySelectorAll(
        'a, button, [data-cursor-hover], input, textarea, select, [role="button"], .cursor-pointer'
      );

      const onEnter = () => {
        isHovering.current = true;
        
        // Expand outline
        gsap.to(cursorOutlineRef.current, {
          scale: 1.5,
          borderColor: 'rgba(0, 0, 0, 0.4)',
          borderWidth: '1px',
          duration: 0.25,
          ease: 'power2.out'
        });

        // Dot stays same size but becomes more prominent
        gsap.to(cursorDotRef.current, {
          scale: 1,
          backgroundColor: '#000000',
          duration: 0.2
        });

        // Ring fades out on hover
        gsap.to(cursorRingRef.current, {
          scale: 0,
          opacity: 0,
          duration: 0.2
        });
      };

      const onLeave = () => {
        isHovering.current = false;
        
        gsap.to(cursorOutlineRef.current, {
          scale: 1,
          borderColor: 'rgba(0, 0, 0, 0.25)',
          borderWidth: '1.5px',
          duration: 0.25,
          ease: 'power2.out'
        });

        gsap.to(cursorDotRef.current, {
          scale: 1,
          backgroundColor: '#000000',
          duration: 0.2
        });

        gsap.to(cursorRingRef.current, {
          scale: 1,
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out'
        });
      };

      interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
      });

      return { onEnter, onLeave, elements: interactiveElements };
    };

    let hoverSetup = setupHoverEffects();
    
    // Refresh hover effects periodically
    const refreshInterval = setInterval(() => {
      hoverSetup.elements.forEach(el => {
        el.removeEventListener('mouseenter', hoverSetup.onEnter);
        el.removeEventListener('mouseleave', hoverSetup.onLeave);
      });
      hoverSetup = setupHoverEffects();
    }, 2000);

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      clearInterval(refreshInterval);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      hoverSetup.elements.forEach(el => {
        el.removeEventListener('mouseenter', hoverSetup.onEnter);
        el.removeEventListener('mouseleave', hoverSetup.onLeave);
      });
    };
  }, [isTouchDevice, animate]);

  if (isTouchDevice) return null;

  return (
    <>
      {/* Precise black dot - exact cursor position */}
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 w-[6px] h-[6px] bg-black rounded-full pointer-events-none z-[10000] opacity-0"
        style={{
          willChange: 'transform',
        }}
      />

      {/* Outer outline circle - expands on hover */}
      <div
        ref={cursorOutlineRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[9999] opacity-0"
        style={{
          border: '1.5px solid rgba(0, 0, 0, 0.25)',
          willChange: 'transform',
        }}
      />

      {/* Trailing ring - playful lag effect */}
      <div
        ref={cursorRingRef}
        data-x="0"
        data-y="0"
        className="fixed top-0 left-0 w-12 h-12 rounded-full pointer-events-none z-[9998] opacity-0"
        style={{
          border: '1px solid rgba(0, 0, 0, 0.1)',
          willChange: 'transform',
        }}
      />

      {/* Container for any additional cursor elements */}
      <div
        ref={cursorContainerRef}
        className="fixed top-0 left-0 pointer-events-none z-[9997] opacity-0"
      />
    </>
  );
};

export default CustomCursor;
