import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Check if touch device
    const checkTouch = () => {
      setIsTouchDevice(window.matchMedia('(pointer: coarse)').matches);
    };
    checkTouch();
    window.addEventListener('resize', checkTouch);

    return () => window.removeEventListener('resize', checkTouch);
  }, []);

  useEffect(() => {
    if (isTouchDevice) return;

    const cursor = cursorRef.current;
    const cursorDot = cursorDotRef.current;
    if (!cursor || !cursorDot) return;

    let mouseX = 0;
    let mouseY = 0;
    let isActive = true;
    let rafId: number;

    const moveCursor = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      if (!isActive) {
        isActive = true;
        animate();
      }
    };

    const animate = () => {
      if (!isActive) return;

      gsap.to(cursor, {
        x: mouseX,
        y: mouseY,
        duration: 0.08,
        ease: 'power2.out'
      });

      gsap.to(cursorDot, {
        x: mouseX,
        y: mouseY,
        duration: 0.02,
        ease: 'none'
      });

      rafId = requestAnimationFrame(animate);
    };

    const handleMouseEnter = () => {
      gsap.to([cursor, cursorDot], { 
        scale: 1, 
        opacity: 1, 
        duration: 0.2 
      });
    };

    const handleMouseLeave = () => {
      gsap.to([cursor, cursorDot], { 
        scale: 0, 
        opacity: 0, 
        duration: 0.2 
      });
    };

    // Start animation
    animate();

    document.addEventListener('mousemove', moveCursor, { passive: true });
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Hover effects for interactive elements
    const addHoverEffects = () => {
      const interactiveElements = document.querySelectorAll('a, button, [data-cursor-hover], input, textarea');
      
      const handleElementHover = () => {
        gsap.to(cursor, { scale: 1.8, duration: 0.2 });
      };

      const handleElementLeave = () => {
        gsap.to(cursor, { scale: 1, duration: 0.2 });
      };

      interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', handleElementHover);
        el.addEventListener('mouseleave', handleElementLeave);
      });

      return () => {
        interactiveElements.forEach(el => {
          el.removeEventListener('mouseenter', handleElementHover);
          el.removeEventListener('mouseleave', handleElementLeave);
        });
      };
    };

    // Add hover effects after a short delay to ensure DOM is ready
    const timeoutId = setTimeout(addHoverEffects, 500);

    return () => {
      isActive = false;
      cancelAnimationFrame(rafId);
      clearTimeout(timeoutId);
      document.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isTouchDevice]);

  if (isTouchDevice) return null;

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-10 h-10 rounded-full pointer-events-none z-[9999] mix-blend-difference"
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          transform: 'translate(-50%, -50%)',
        }}
      />
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full pointer-events-none z-[9999]"
        style={{
          background: '#FF3B3B',
          transform: 'translate(-50%, -50%)',
        }}
      />
    </>
  );
};

export default CustomCursor;
