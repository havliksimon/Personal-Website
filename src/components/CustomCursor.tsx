import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const cursorTextRef = useRef<HTMLDivElement>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [cursorText, setCursorText] = useState('');
  const mousePos = useRef({ x: 0, y: 0 });
  const isHovering = useRef(false);

  useEffect(() => {
    const checkTouch = () => {
      setIsTouchDevice(window.matchMedia('(pointer: coarse)').matches);
    };
    checkTouch();
    window.addEventListener('resize', checkTouch);
    return () => window.removeEventListener('resize', checkTouch);
  }, []);

  const updateCursor = useCallback(() => {
    if (isTouchDevice) return;

    const cursor = cursorRef.current;
    const cursorDot = cursorDotRef.current;
    const cursorRing = cursorRingRef.current;

    if (!cursor || !cursorDot || !cursorRing) return;

    // Smooth follow for the main cursor container
    gsap.to(cursor, {
      x: mousePos.current.x,
      y: mousePos.current.y,
      duration: 0.08,
      ease: 'power2.out'
    });

    // Fast follow for the dot
    gsap.to(cursorDot, {
      x: mousePos.current.x,
      y: mousePos.current.y,
      duration: 0.02,
      ease: 'none'
    });

    // Slower, more playful follow for the ring
    gsap.to(cursorRing, {
      x: mousePos.current.x,
      y: mousePos.current.y,
      duration: 0.15,
      ease: 'power3.out'
    });
  }, [isTouchDevice]);

  useEffect(() => {
    if (isTouchDevice) return;

    let rafId: number;
    let isActive = true;

    const moveCursor = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!isActive) {
        isActive = true;
        const animate = () => {
          if (!isActive) return;
          updateCursor();
          rafId = requestAnimationFrame(animate);
        };
        animate();
      }
    };

    const animate = () => {
      if (!isActive) return;
      updateCursor();
      rafId = requestAnimationFrame(animate);
    };

    // Start animation loop
    animate();

    const handleMouseEnter = () => {
      gsap.to([cursorRef.current, cursorDotRef.current, cursorRingRef.current], { 
        opacity: 1, 
        scale: 1,
        duration: 0.3,
        ease: 'back.out(1.7)'
      });
    };

    const handleMouseLeave = () => {
      gsap.to([cursorRef.current, cursorDotRef.current, cursorRingRef.current], { 
        opacity: 0, 
        scale: 0,
        duration: 0.2 
      });
    };

    const handleMouseDown = () => {
      gsap.to(cursorDotRef.current, { scale: 0.5, duration: 0.1 });
      gsap.to(cursorRingRef.current, { scale: 0.8, duration: 0.1 });
    };

    const handleMouseUp = () => {
      gsap.to(cursorDotRef.current, { scale: 1, duration: 0.2, ease: 'back.out(2)' });
      gsap.to(cursorRingRef.current, { scale: 1, duration: 0.2, ease: 'back.out(2)' });
    };

    // Add hover effects
    const addHoverEffects = () => {
      // Interactive elements - buttons, links, etc
      const interactiveElements = document.querySelectorAll('a, button, [data-cursor-hover], input, textarea, [role="button"]');
      
      const handleElementEnter = (e: Event) => {
        isHovering.current = true;
        const target = e.currentTarget as HTMLElement;
        const cursorType = target.getAttribute('data-cursor-type');
        const text = target.getAttribute('data-cursor-text');
        
        if (text) {
          setCursorText(text);
          gsap.to(cursorTextRef.current, { opacity: 1, scale: 1, duration: 0.2 });
        }

        if (cursorType === 'view') {
          // "View" mode - large ring with text
          gsap.to(cursorRingRef.current, { 
            width: 80, 
            height: 80, 
            borderWidth: 1,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            duration: 0.3,
            ease: 'back.out(1.7)'
          });
          gsap.to(cursorDotRef.current, { scale: 0, duration: 0.2 });
        } else if (cursorType === 'drag') {
          // "Drag" mode
          gsap.to(cursorRingRef.current, { 
            width: 60, 
            height: 60, 
            borderWidth: 2,
            borderColor: '#10B981',
            duration: 0.3 
          });
        } else {
          // Default hover - magnetic pull effect
          gsap.to(cursorRingRef.current, { 
            width: 50, 
            height: 50, 
            borderWidth: 2,
            borderColor: 'rgba(0, 0, 0, 0.5)',
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
            duration: 0.25,
            ease: 'back.out(1.7)'
          });
          gsap.to(cursorDotRef.current, { 
            scale: 1.5, 
            backgroundColor: '#DC2626',
            duration: 0.2 
          });
        }
      };

      const handleElementLeave = () => {
        isHovering.current = false;
        setCursorText('');
        
        gsap.to(cursorTextRef.current, { opacity: 0, scale: 0.5, duration: 0.2 });
        
        gsap.to(cursorRingRef.current, { 
          width: 40, 
          height: 40, 
          borderWidth: 1.5,
          borderColor: 'rgba(0, 0, 0, 0.3)',
          backgroundColor: 'transparent',
          duration: 0.25,
          ease: 'power2.out'
        });
        gsap.to(cursorDotRef.current, { 
          scale: 1, 
          backgroundColor: '#DC2626',
          duration: 0.2 
        });
      };

      interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', handleElementEnter);
        el.addEventListener('mouseleave', handleElementLeave);
      });

      // Text elements - subtle effect
      const textElements = document.querySelectorAll('h1, h2, h3, h4, p, span');
      
      const handleTextEnter = () => {
        if (!isHovering.current) {
          gsap.to(cursorRingRef.current, { 
            opacity: 0.5,
            scale: 0.8,
            duration: 0.2 
          });
        }
      };

      const handleTextLeave = () => {
        if (!isHovering.current) {
          gsap.to(cursorRingRef.current, { 
            opacity: 1,
            scale: 1,
            duration: 0.2 
          });
        }
      };

      textElements.forEach(el => {
        el.addEventListener('mouseenter', handleTextEnter);
        el.addEventListener('mouseleave', handleTextLeave);
      });

      return () => {
        interactiveElements.forEach(el => {
          el.removeEventListener('mouseenter', handleElementEnter);
          el.removeEventListener('mouseleave', handleElementLeave);
        });
        textElements.forEach(el => {
          el.removeEventListener('mouseenter', handleTextEnter);
          el.removeEventListener('mouseleave', handleTextLeave);
        });
      };
    };

    document.addEventListener('mousemove', moveCursor, { passive: true });
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    const cleanupHover = addHoverEffects();
    // Re-apply hover effects periodically to catch new elements
    const intervalId = setInterval(addHoverEffects, 2000);

    return () => {
      isActive = false;
      cancelAnimationFrame(rafId);
      clearInterval(intervalId);
      cleanupHover?.();
      document.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isTouchDevice, updateCursor]);

  if (isTouchDevice) return null;

  return (
    <>
      {/* Main cursor container - moves smoothly */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] opacity-0"
        style={{ transform: 'translate(-50%, -50%)' }}
      />
      
      {/* Playful outer ring */}
      <div
        ref={cursorRingRef}
        className="fixed top-0 left-0 w-10 h-10 rounded-full pointer-events-none z-[9998] opacity-0"
        style={{
          transform: 'translate(-50%, -50%)',
          border: '1.5px solid rgba(0, 0, 0, 0.3)',
          backgroundColor: 'transparent',
          transition: 'border-color 0.2s, background-color 0.2s',
        }}
      />
      
      {/* Central dot */}
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none z-[9999] opacity-0 mix-blend-difference"
        style={{
          backgroundColor: '#DC2626',
          transform: 'translate(-50%, -50%)',
        }}
      />
      
      {/* Text label (appears on certain hovers) */}
      {cursorText && (
        <div
          ref={cursorTextRef}
          className="fixed top-0 left-0 pointer-events-none z-[9999] opacity-0"
          style={{ transform: 'translate(-50%, -50%)' }}
        >
          <span className="text-xs font-semibold text-gray-900 uppercase tracking-wider">
            {cursorText}
          </span>
        </div>
      )}
    </>
  );
};

export default CustomCursor;
