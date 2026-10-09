import { useEffect, useState } from 'react';

const QUERY_REDUCED = '(prefers-reduced-motion: reduce)';

/**
 * Whether to render the rich Shmack OS desktop. It's DOM/CSS only (no WebGL),
 * so it runs on phones too — we only step aside for reduced-motion users.
 */
const shouldAllowRich = (): boolean => {
  if (typeof window === 'undefined') return false;
  return !window.matchMedia(QUERY_REDUCED).matches;
};

export const useJourneyPrefs = (): boolean => {
  const [allowRich, setAllowRich] = useState<boolean>(shouldAllowRich);

  useEffect(() => {
    const update = () => setAllowRich(shouldAllowRich());
    const reduced = window.matchMedia(QUERY_REDUCED);
    reduced.addEventListener('change', update);
    return () => reduced.removeEventListener('change', update);
  }, []);

  return allowRich;
};
