import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const CustomCursor = () => {
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const cursorTrailRef = useRef<HTMLDivElement>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const isVisible = useRef(true);
  const isHovering = useRef(false);
  const mousePos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const rafId = useRef<number | undefined>(undefined);

  useEffect(() => {
    const checkTouch = () => {
      setIsTouchDevice(window.matchMedia('(pointer: coarse)').matches);
    };
    checkTouch();
    window.addEventListener('resize', checkTouch);
    return () => window.removeEventListener('resize', checkTouch);
  }, []);

  useEffect(() => {
    if (isTouchDevice) return;

    const dot = cursorDotRef.current;
    const ring = cursorRingRef.current;
    const trail = cursorTrailRef.current;
    if (!dot || !ring || !trail) return;

    // Make visible immediately
    gsap.set([dot, ring, trail], { opacity: 1 });

    const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;

    const animate = () => {
      // Dot follows precisely
      dot.style.transform = `translate(${mousePos.current.x}px, ${mousePos.current.y}px) translate(-50%, -50%)`;

      // Ring follows with smooth lag
      ringPos.current.x = lerp(ringPos.current.x, mousePos.current.x, 0.1);
      ringPos.current.y = lerp(ringPos.current.y, mousePos.current.y, 0.1);
      ring.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px) translate(-50%, -50%)`;

      // Trail follows with more lag
      const trailX = lerp(parseFloat(trail.dataset.x || '0'), mousePos.current.x, 0.05);
      const trailY = lerp(parseFloat(trail.dataset.y || '0'), mousePos.current.y, 0.05);
      trail.dataset.x = String(trailX);
      trail.dataset.y = String(trailY);
      trail.style.transform = `translate(${trailX}px, ${trailY}px) translate(-50%, -50%)`;

      rafId.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      
      if (!isVisible.current) {
        isVisible.current = true;
        gsap.to([dot, ring, trail], { opacity: 1, duration: 0.2 });
      }
    };

    const handleMouseDown = () => {
      gsap.to(dot, { scale: 0.6, duration: 0.1 });
      gsap.to(ring, { scale: 0.85, duration: 0.1 });
      gsap.to(trail, { scale: 0.9, duration: 0.1 });
    };

    const handleMouseUp = () => {
      gsap.to(dot, { scale: 1, duration: 0.3, ease: 'elastic.out(1, 0.5)' });
      gsap.to(ring, { scale: isHovering.current ? 2 : 1, duration: 0.3, ease: 'elastic.out(1, 0.5)' });
      gsap.to(trail, { scale: 1, duration: 0.3 });
    };

    const handleMouseLeave = () => {
      isVisible.current = false;
      gsap.to([dot, ring, trail], { opacity: 0, duration: 0.2 });
    };

    const handleMouseEnter = () => {
      isVisible.current = true;
      gsap.to([dot, ring, trail], { opacity: 1, duration: 0.2 });
    };

    // Setup hover effects
    const setupHover = () => {
      const elements = document.querySelectorAll('a, button, [data-cursor-hover], input, textarea, select, [role="button"], .cursor-pointer, label, [onclick]');

      const onEnter = () => {
        isHovering.current = true;
        gsap.to(ring, { 
          scale: 2, 
          borderWidth: '3px',
          duration: 0.25, 
          ease: 'power2.out' 
        });
        gsap.to(dot, { scale: 1.3, duration: 0.2 });
        gsap.to(trail, { opacity: 0, scale: 0.5, duration: 0.2 });
      };

      const onLeave = () => {
        isHovering.current = false;
        gsap.to(ring, { 
          scale: 1, 
          borderWidth: '2px',
          duration: 0.25, 
          ease: 'power2.out' 
        });
        gsap.to(dot, { scale: 1, duration: 0.2 });
        gsap.to(trail, { opacity: 0.4, scale: 1, duration: 0.2 });
      };

      elements.forEach(el => {
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
      });

      return { onEnter, onLeave, elements };
    };

    // Start animation
    rafId.current = requestAnimationFrame(animate);

    // Event listeners
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    let hoverSetup = setupHover();
    const intervalId = setInterval(() => {
      hoverSetup.elements.forEach(el => {
        el.removeEventListener('mouseenter', hoverSetup.onEnter);
        el.removeEventListener('mouseleave', hoverSetup.onLeave);
      });
      hoverSetup = setupHover();
    }, 2000);

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      clearInterval(intervalId);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      hoverSetup.elements.forEach(el => {
        el.removeEventListener('mouseenter', hoverSetup.onEnter);
        el.removeEventListener('mouseleave', hoverSetup.onLeave);
      });
    };
  }, [isTouchDevice]);

  if (isTouchDevice) return null;

  return (
    <>
      {/* Trail - subtle following effect */}
      <div
        ref={cursorTrailRef}
        data-x="0"
        data-y="0"
        className="fixed top-0 left-0 w-16 h-16 rounded-full pointer-events-none z-[9997] opacity-0"
        style={{
          background: 'radial-gradient(circle, rgba(220, 38, 38, 0.08) 0%, transparent 70%)',
          willChange: 'transform',
        }}
      />

      {/* Main ring - with mix-blend-mode for cool effect */}
      <div
        ref={cursorRingRef}
        className="fixed top-0 left-0 w-10 h-10 rounded-full pointer-events-none z-[9998] opacity-0 mix-blend-difference"
        style={{
          border: '2px solid white',
          backgroundColor: 'transparent',
          willChange: 'transform',
        }}
      />

      {/* Central dot - also with mix-blend-mode */}
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 w-3 h-3 bg-white rounded-full pointer-events-none z-[9999] opacity-0 mix-blend-difference"
        style={{
          willChange: 'transform',
        }}
      />
    </>
  );
};

export default CustomCursor;
