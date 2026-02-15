import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const CustomCursor = () => {
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorOutlineRef = useRef<HTMLDivElement>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const isVisible = useRef(true);
  const isHovering = useRef(false);
  const mousePos = useRef({ x: 0, y: 0 });
  const outlinePos = useRef({ x: 0, y: 0 });
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
    const outline = cursorOutlineRef.current;
    if (!dot || !outline) return;

    // Make visible immediately
    gsap.set([dot, outline], { opacity: 1 });

    const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;

    const animate = () => {
      // Dot follows precisely
      dot.style.transform = `translate(${mousePos.current.x}px, ${mousePos.current.y}px) translate(-50%, -50%)`;

      // Outline follows with smooth lag
      outlinePos.current.x = lerp(outlinePos.current.x, mousePos.current.x, 0.12);
      outlinePos.current.y = lerp(outlinePos.current.y, mousePos.current.y, 0.12);
      outline.style.transform = `translate(${outlinePos.current.x}px, ${outlinePos.current.y}px) translate(-50%, -50%)`;

      rafId.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      
      if (!isVisible.current) {
        isVisible.current = true;
        gsap.to([dot, outline], { opacity: 1, duration: 0.2 });
      }
    };

    const handleMouseDown = () => {
      gsap.to(dot, { scale: 0.5, duration: 0.1 });
      gsap.to(outline, { scale: 0.8, duration: 0.1 });
    };

    const handleMouseUp = () => {
      gsap.to(dot, { scale: 1, duration: 0.25, ease: 'elastic.out(1, 0.5)' });
      gsap.to(outline, { scale: isHovering.current ? 1.8 : 1, duration: 0.25, ease: 'elastic.out(1, 0.5)' });
    };

    const handleMouseLeave = () => {
      isVisible.current = false;
      gsap.to([dot, outline], { opacity: 0, duration: 0.2 });
    };

    const handleMouseEnter = () => {
      isVisible.current = true;
      gsap.to([dot, outline], { opacity: 1, duration: 0.2 });
    };

    // Setup hover effects
    const setupHover = () => {
      const elements = document.querySelectorAll('a, button, [data-cursor-hover], input, textarea, select, [role="button"], .cursor-pointer, label');

      const onEnter = () => {
        isHovering.current = true;
        gsap.to(outline, { 
          scale: 1.8, 
          borderWidth: '1px',
          borderColor: 'rgba(0, 0, 0, 0.35)',
          duration: 0.25, 
          ease: 'power2.out' 
        });
      };

      const onLeave = () => {
        isHovering.current = false;
        gsap.to(outline, { 
          scale: 1, 
          borderWidth: '1.5px',
          borderColor: 'rgba(0, 0, 0, 0.25)',
          duration: 0.25, 
          ease: 'power2.out' 
        });
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
      {/* Central black dot - precise position */}
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 w-[5px] h-[5px] bg-black rounded-full pointer-events-none z-[10000]"
        style={{
          willChange: 'transform',
          opacity: 0,
        }}
      />

      {/* Expanding outline - follows with lag */}
      <div
        ref={cursorOutlineRef}
        className="fixed top-0 left-0 w-7 h-7 rounded-full pointer-events-none z-[9999]"
        style={{
          border: '1.5px solid rgba(0, 0, 0, 0.25)',
          willChange: 'transform',
          opacity: 0,
        }}
      />
    </>
  );
};

export default CustomCursor;
