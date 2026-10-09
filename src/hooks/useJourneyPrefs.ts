import { useEffect, useState } from 'react';

const QUERY_REDUCED = '(prefers-reduced-motion: reduce)';
const QUERY_COARSE = '(pointer: coarse)';

const shouldAllowRich = (): boolean => {
  if (typeof window === 'undefined') return false;
  const reduced = window.matchMedia(QUERY_REDUCED).matches;
  const coarse = window.matchMedia(QUERY_COARSE).matches || window.innerWidth < 768;
  return !reduced && !coarse;
};

export const useJourneyPrefs = (): boolean => {
  const [allowRich, setAllowRich] = useState<boolean>(shouldAllowRich);

  useEffect(() => {
    const update = () => setAllowRich(shouldAllowRich());
    const reduced = window.matchMedia(QUERY_REDUCED);
    const coarse = window.matchMedia(QUERY_COARSE);
    reduced.addEventListener('change', update);
    coarse.addEventListener('change', update);
    window.addEventListener('resize', update);
    return () => {
      reduced.removeEventListener('change', update);
      coarse.removeEventListener('change', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return allowRich;
};
