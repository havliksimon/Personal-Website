import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface SpotlightBackgroundProps {
  /** Primary color of the spotlight (default: blue-gray) */
  primaryColor?: string;
  /** Secondary color for gradient effect (default: purple-gray) */
  secondaryColor?: string;
  /** Size of the spotlight in pixels (default: 600) */
  size?: number;
  /** Opacity of the spotlight (default: 0.15) */
  opacity?: number;
  /** Blur amount in pixels (default: 100) */
  blur?: number;
  /** Whether to enable the spotlight effect (default: true) */
  enabled?: boolean;
  /** Additional CSS class for the container */
  className?: string;
  /** Whether to show floating ambient orbs (default: true) */
  showOrbs?: boolean;
  /** Number of ambient orbs (default: 3) */
  orbCount?: number;
  /** Children content */
  children?: React.ReactNode;
}

/**
 * SpotlightBackground - Interactive mouse-following spotlight effect
 * 
 * Creates a modern, cool spotlight that follows the cursor with a smooth,
 * lagging animation. Perfect for adding visual interest to sections.
 * 
 * Usage:
 * <SpotlightBackground primaryColor="rgba(59, 130, 246, 0.3)" secondaryColor="rgba(139, 92, 246, 0.2)">
 *   <YourContent />
 * </SpotlightBackground>
 */
const SpotlightBackground: React.FC<SpotlightBackgroundProps> = ({
  primaryColor = 'rgba(100, 116, 139, 0.25)',
  secondaryColor = 'rgba(139, 92, 246, 0.15)',
  size = 600,
  opacity = 1,
  blur = 100,
  enabled = true,
  className = '',
  showOrbs = true,
  orbCount = 3,
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const spotlightPos = useRef({ x: 0, y: 0 });
  const targetPos = useRef({ x: 0, y: 0 });
  const rafId = useRef<number | undefined>(undefined);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile on mount
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!enabled || isMobile) return;

    const container = containerRef.current;
    const spotlight = spotlightRef.current;
    if (!container || !spotlight) return;

    // Set initial position off-screen
    gsap.set(spotlight, { opacity: 0 });

    const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;

    const animate = () => {
      // Smooth interpolation for lag effect
      spotlightPos.current.x = lerp(spotlightPos.current.x, targetPos.current.x, 0.08);
      spotlightPos.current.y = lerp(spotlightPos.current.y, targetPos.current.y, 0.08);

      spotlight.style.transform = `translate(${spotlightPos.current.x}px, ${spotlightPos.current.y}px) translate(-50%, -50%)`;

      rafId.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      targetPos.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseEnter = () => {
      gsap.to(spotlight, { opacity: opacity, duration: 0.4, ease: 'power2.out' });
    };

    const handleMouseLeave = () => {
      gsap.to(spotlight, { opacity: 0, duration: 0.4, ease: 'power2.out' });
    };

    // Start animation loop
    rafId.current = requestAnimationFrame(animate);

    // Event listeners
    container.addEventListener('mousemove', handleMouseMove, { passive: true });
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [enabled, isMobile, opacity, primaryColor, secondaryColor]);

  // Generate ambient orbs
  const orbs = showOrbs && !isMobile ? Array.from({ length: orbCount }, (_, i) => ({
    id: i,
    size: 300 + Math.random() * 200,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: 15 + Math.random() * 10,
    delay: i * 2,
  })) : [];

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ isolation: 'isolate' }}
    >
      {/* Ambient background orbs */}
      {orbs.map((orb) => (
        <div
          key={orb.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: orb.size,
            height: orb.size,
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            background: `radial-gradient(circle, ${primaryColor} 0%, ${secondaryColor} 40%, transparent 70%)`,
            filter: `blur(${blur * 1.5}px)`,
            opacity: 0.5,
            animation: `floatOrb ${orb.duration}s ease-in-out infinite`,
            animationDelay: `${orb.delay}s`,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}

      {/* Interactive spotlight that follows cursor */}
      {!isMobile && enabled && (
        <div
          ref={spotlightRef}
          className="absolute top-0 left-0 pointer-events-none"
          style={{
            width: size,
            height: size,
            background: `radial-gradient(circle, ${primaryColor} 0%, ${secondaryColor} 40%, transparent 70%)`,
            filter: `blur(${blur}px)`,
            opacity: 0,
            willChange: 'transform, opacity',
            zIndex: 0,
          }}
        />
      )}

      {/* Content layer */}
      <div className="relative z-10">{children}</div>

      {/* Keyframes for ambient orbs */}
      <style>{`
        @keyframes floatOrb {
          0%, 100% { 
            transform: translate(-50%, -50%) translate(0, 0) scale(1); 
          }
          25% { 
            transform: translate(-50%, -50%) translate(30px, -20px) scale(1.05); 
          }
          50% { 
            transform: translate(-50%, -50%) translate(-20px, 30px) scale(1.02); 
          }
          75% { 
            transform: translate(-50%, -50%) translate(20px, 20px) scale(1.03); 
          }
        }
      `}</style>
    </div>
  );
};

export default SpotlightBackground;
