import { useEffect, useRef, useState } from 'react';

/**
 * Learning path — the journey on one line, and what was gained at each stop
 * underneath it.
 *
 * The story a recruiter is looking for here is a progression with proof:
 * quantitative foundation, economics core, applied valuation, working across
 * markets, and tools built by hand. The strip shows when, the detail shows what,
 * and every stop carries one hard number that can be checked.
 */

type Stop = {
  id: string;
  year: string;
  place: string;
  span: string;
  theme: string;
  gained: { skill: string; method: string }[];
  proof: string;
};

const STOPS: Stop[] = [
  {
    id: 'gym',
    year: 'Foundation',
    place: 'Gymnázium Karla Sladkovského',
    span: '2015 — 2024',
    theme: 'Quantitative foundation',
    gained: [
      { skill: 'Research writing', method: 'thesis · argument · citation' },
      { skill: 'Mathematics', method: 'calculus · statistics' },
    ],
    proof: 'national thesis competition — placed',
  },
  {
    id: 'vse',
    year: 'Core',
    place: 'VŠE Prague',
    span: '2024 — now',
    theme: 'Economics core',
    gained: [
      { skill: 'Econometrics', method: 'R · regression · time series' },
      { skill: 'Statistics', method: 'inference · sampling' },
      { skill: 'Applied micro & macro', method: 'markets · policy effects' },
    ],
    proof: 'top 9.4% of cohort · average 1.67',
  },
  {
    id: 'klub',
    year: 'Applied',
    place: 'Klub Investorů',
    span: '2024 — now',
    theme: 'Applied valuation',
    gained: [
      { skill: 'DCF modelling', method: 'FCFF · WACC · terminal · sensitivity' },
      { skill: 'Trading comps & SOTP', method: 'peer sets · segment EV' },
      { skill: 'Equity research writing', method: 'memo · thesis · risks' },
    ],
    proof: '7 published analyses & decks',
  },
  {
    id: 'china',
    year: 'Abroad',
    place: 'BFSU · XJTLU · Donghua',
    span: '2025 — 2026',
    theme: 'Working across markets',
    gained: [
      { skill: 'Mandarin', method: 'HSK3 certified · business press' },
      { skill: 'English-taught coursework', method: 'seminars · written assessment' },
      { skill: 'Cross-border analysis', method: 'Chinese filings · market data' },
    ],
    proof: 'HSK1 → HSK3 in ten months',
  },
  {
    id: 'build',
    year: 'Built',
    place: 'Self-directed',
    span: '2025 — now',
    theme: 'Shipping tools',
    gained: [
      { skill: 'Python & pandas', method: 'data pipelines · models' },
      { skill: 'SQL', method: 'queries · joins · aggregation' },
      { skill: 'Product delivery', method: 'two live web applications' },
    ],
    proof: 'portfolio optimiser · analyst tracker',
  },
];

const EducationLab = () => {
  const hostRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(1);
  const [paused, setPaused] = useState(false);
  const [live, setLive] = useState(false);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    setReduce(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || typeof IntersectionObserver === 'undefined') {
      setLive(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => setLive(entry.isIntersecting), { threshold: 0.12 });
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!live || reduce || paused) return;
    const id = window.setInterval(() => setActive((a) => (a + 1) % STOPS.length), 4400);
    return () => window.clearInterval(id);
  }, [live, reduce, paused]);

  const stop = STOPS[active];
  const progress = (active / (STOPS.length - 1)) * 100;

  return (
    <aside
      ref={hostRef}
      className="hidden lg:block lg:sticky lg:top-24 lg:self-start"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label="Learning path"
    >
      <div className="border-t border-gray-300 pt-3 pr-1">
        <div className="flex items-baseline justify-between">
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-gray-500">Learning path</p>
          <p className="font-mono text-[7px] uppercase tracking-[0.12em] text-gray-400">2015 — 2026</p>
        </div>

        {/* the journey, on one line */}
        <div className="relative mt-3">
          <span className="absolute left-0 right-0 top-[3px] h-px bg-gray-200" aria-hidden="true" />
          <span
            className="absolute left-0 top-[3px] h-px bg-gray-900 transition-[width] duration-700 ease-out"
            style={{ width: `${progress}%` }}
            aria-hidden="true"
          />
          <ol className="relative flex justify-between px-[5px]">
            {STOPS.map((item, index) => {
              const on = index === active;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => setActive(index)}
                    aria-label={`${item.place}, ${item.span}`}
                    className={`group flex flex-col ${
                      index === 0 ? 'items-start' : index === STOPS.length - 1 ? 'items-end' : 'items-center'
                    }`}
                  >
                    <span
                      className={`h-[7px] w-[7px] rounded-full border transition-all duration-300 ${
                        on ? 'scale-[1.35] border-gray-900 bg-gray-900' : 'border-gray-300 bg-white group-hover:border-gray-500'
                      }`}
                    />
                    <span
                      className={`mt-1.5 font-mono text-[8px] tabular-nums transition-colors ${
                        on ? 'text-gray-900' : 'text-gray-500'
                      }`}
                    >
                      {item.year}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>

        {/* what was gained there */}
        <div
          key={stop.id}
          className="mt-3.5 border-t border-gray-200 pt-2.5"
          style={{ animation: reduce ? 'none' : 'stopIn 380ms ease-out both' }}
        >
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-[13px] font-semibold leading-tight text-gray-900">{stop.theme}</p>
            <p className="shrink-0 text-right font-mono text-[7px] uppercase tracking-[0.08em] text-gray-400">
              {stop.place} · {stop.span}
            </p>
          </div>

          <ul className="mt-1.5 space-y-1">
            {stop.gained.map((item) => (
              <li key={item.skill} className="flex items-baseline justify-between gap-3">
                <span className="text-[12px] font-medium leading-tight text-gray-900">{item.skill}</span>
                <span className="shrink-0 text-right font-mono text-[8px] uppercase leading-tight tracking-[0.05em] text-gray-500">
                  {item.method}
                </span>
              </li>
            ))}
          </ul>

          <p className="mt-2 border-t border-dashed border-gray-200 pt-1.5 font-mono text-[8px] uppercase tracking-[0.07em] text-gray-600">
            {stop.proof}
          </p>
        </div>

        <p className="mt-2 font-mono text-[7px] uppercase tracking-[0.1em] text-gray-400">
          {reduce ? 'static' : paused ? 'paused' : 'advancing'} · click a year
        </p>
      </div>

      <style>{`
        @keyframes stopIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          aside span, aside div { animation: none !important; transition: none !important; }
        }
      `}</style>
    </aside>
  );
};

export default EducationLab;
