import { useMemo, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Ambient three.js field behind the portrait: a slow constellation shell with a
 * faint polyhedral frame. Deliberately low contrast so the portrait stays the
 * subject; it is skipped on small screens and when the user prefers reduced
 * motion, and it stops rendering when the hero leaves the viewport.
 */

function Constellation() {
  const pointsRef = useRef<THREE.Points>(null);
  const shellRef = useRef<THREE.LineSegments>(null);

  const geometry = useMemo(() => {
    const count = 420;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const y = 1 - (i / (count - 1)) * 2;
      const radius = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = i * 2.399963229728653;
      const shell = 2.2 + Math.random() * 0.6;
      positions[i * 3] = Math.cos(theta) * radius * shell;
      positions[i * 3 + 1] = y * shell * 0.82;
      positions[i * 3 + 2] = Math.sin(theta) * radius * shell;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (pointsRef.current) {
      pointsRef.current.rotation.y = t * 0.035;
      pointsRef.current.rotation.x = Math.sin(t * 0.12) * 0.06;
    }
    if (shellRef.current) {
      shellRef.current.rotation.y = -t * 0.02;
      shellRef.current.rotation.z = Math.sin(t * 0.09) * 0.05;
    }
  });

  return (
    <group>
      <points ref={pointsRef} geometry={geometry}>
        <pointsMaterial size={0.028} color="#6b7397" transparent opacity={0.55} sizeAttenuation depthWrite={false} />
      </points>
      <lineSegments ref={shellRef}>
        <wireframeGeometry args={[new THREE.IcosahedronGeometry(2.65, 1)]} />
        <lineBasicMaterial color="#8f96b8" transparent opacity={0.14} depthWrite={false} />
      </lineSegments>
    </group>
  );
}

const HeroBackdrop = () => {
  const hostRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 769px)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setEnabled(desktop && !reduced);
  }, []);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || !enabled || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => setVisible(entries[0].isIntersecting),
      { threshold: 0.05 },
    );
    observer.observe(host);
    return () => observer.disconnect();
  }, [enabled]);

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    >
      {enabled && (
        <Canvas
          camera={{ position: [0, 0, 6.4], fov: 45 }}
          dpr={[1, 1.6]}
          frameloop={visible ? 'always' : 'demand'}
          gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
          style={{ position: 'absolute', inset: 0 }}
        >
          <Constellation />
        </Canvas>
      )}
    </div>
  );
};

export default HeroBackdrop;
