import { useEffect, useRef, useState } from 'react';

/**
 * Exchange tape along the bottom of the hero. Black type on the white fade, two
 * copies of the strip so the loop is seamless; pauses on hover, static when the
 * user prefers reduced motion.
 */

const TAPE = [
  ['S&P 500', '+0.42%', true],
  ['NASDAQ', '+0.81%', true],
  ['DOW', '−0.14%', false],
  ['VIX', '−2.31%', false],
  ['US 10Y', '4.21%', false],
  ['EUR/USD', '1.0874', true],
  ['GOLD', '+0.36%', true],
  ['BRENT', '−0.52%', false],
  ['BTC', '+1.94%', true],
  ['DAX', '+0.28%', true],
  ['FTSE', '−0.07%', false],
  ['NIKKEI', '+1.12%', true],
] as const;

const HeroTicker = () => {
  const stripRef = useRef<HTMLDivElement>(null);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    setReduce(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  const items = [...TAPE, ...TAPE];

  return (
    <div
      className="absolute bottom-0 left-0 right-0 overflow-hidden border-t border-gray-200/80 bg-white/70 backdrop-blur-[2px]"
      style={{ zIndex: 22 }}
      aria-hidden="true"
    >
      <div
        ref={stripRef}
        className={`ticker-track flex w-max items-center gap-10 py-2.5 ${reduce ? '' : 'ticker-track--run'}`}
      >
        {items.map(([label, value, up], index) => (
          <span key={`${label}-${index}`} className="ticker-item flex items-baseline gap-2 whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.12em]">
            <span className="text-gray-900">{label}</span>
            <span className={up ? 'text-emerald-700' : 'text-gray-500'}>{value}</span>
            <span className="text-gray-300">/</span>
          </span>
        ))}
      </div>

      <style>{`
        .ticker-track--run { animation: tickerSlide 48s linear infinite; }
        .ticker-track:hover { animation-play-state: paused; }
        @keyframes tickerSlide { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @media (prefers-reduced-motion: reduce) { .ticker-track { animation: none; } }
      `}</style>
    </div>
  );
};

export default HeroTicker;
