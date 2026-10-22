import { useEffect, useLayoutEffect, useState } from 'react';

const QUERY_REDUCED = '(prefers-reduced-motion: reduce)';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * Whether to render the rich Shmack OS desktop. It's DOM/CSS only (no WebGL),
 * so it runs on phones too — we only step aside for reduced-motion users.
 *
 * Starts false so the first client render matches the prerendered HTML (the
 * server cannot evaluate matchMedia), then upgrades before paint.
 */
const shouldAllowRich = (): boolean => {
  if (typeof window === 'undefined') return false;
  return !window.matchMedia(QUERY_REDUCED).matches;
};

export const useJourneyPrefs = (): boolean => {
  const [allowRich, setAllowRich] = useState(false);

  useIsomorphicLayoutEffect(() => {
    const update = () => setAllowRich(shouldAllowRich());
    update();
    const reduced = window.matchMedia(QUERY_REDUCED);
    reduced.addEventListener('change', update);
    return () => reduced.removeEventListener('change', update);
  }, []);

  return allowRich;
};
