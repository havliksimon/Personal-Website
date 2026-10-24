import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Default Shmack OS wallpaper: a slow orbital field behind the desktop icons.
 * Lazy-loaded, paused when the desktop is off-screen, static for reduced
 * motion, and never mounted on small screens.
 */

function OrbitField() {
  const groupRef = useRef<THREE.Group>(null);
  const dustRef = useRef<THREE.Points>(null);

  const dust = useMemo(() => {
    const count = 520;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const radius = 2.4 + Math.random() * 4.2;
      const angle = Math.random() * Math.PI * 2;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 3.2;
      positions[i * 3 + 2] = Math.sin(angle) * radius * 0.55;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.z = Math.sin(t * 0.08) * 0.05;
      groupRef.current.rotation.x = 0.38 + Math.sin(t * 0.11) * 0.03;
      groupRef.current.rotation.y = t * 0.018;
    }
    if (dustRef.current) {
      dustRef.current.rotation.y = -t * 0.026;
    }
  });

  return (
    <group ref={groupRef}>
      <lineSegments>
        <wireframeGeometry args={[new THREE.TorusGeometry(3.1, 0.9, 18, 64)]} />
        <lineBasicMaterial color="#c8a15a" transparent opacity={0.18} depthWrite={false} />
      </lineSegments>
      <lineSegments>
        <wireframeGeometry args={[new THREE.IcosahedronGeometry(1.55, 1)]} />
        <lineBasicMaterial color="#7f9bc4" transparent opacity={0.26} depthWrite={false} />
      </lineSegments>
      <points ref={dustRef} geometry={dust}>
        <pointsMaterial size={0.02} color="#e8cd97" transparent opacity={0.55} sizeAttenuation depthWrite={false} />
      </points>
    </group>
  );
}

const DesktopWallpaper = () => {
  const hostRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 900px)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setEnabled(desktop && !reduced);
  }, []);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => setVisible(entries[0].isIntersecting),
      { threshold: 0.02 },
    );
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  if (!enabled) return null;

  return (
    <div ref={hostRef} aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ zIndex: 0 }}>
      <Canvas
        camera={{ position: [0, 0.6, 7.4], fov: 42 }}
        dpr={[1, 1.5]}
        frameloop={visible ? 'always' : 'demand'}
        gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
        style={{ position: 'absolute', inset: 0 }}
      >
        <OrbitField />
      </Canvas>
    </div>
  );
};

export default DesktopWallpaper;
