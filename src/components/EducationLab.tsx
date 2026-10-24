import { useEffect, useRef, useState } from 'react';

/**
 * Skills gained — five stages, and at each one the capabilities that were
 * actually acquired, with the method or tool named beside them. The institution
 * is a caption, not the subject: what a reader should take away is the skill.
 */

type Capability = { skill: string; method: string };

type Stage = {
  id: string;
  place: string;
  years: string;
  capabilities: Capability[];
  proof?: string;
};

const STAGES: Stage[] = [
  {
    id: 'vse',
    place: 'VŠE Prague',
    years: '2024 — now',
    capabilities: [
      { skill: 'Econometric modelling', method: 'R · regression · time series' },
      { skill: 'Statistical inference', method: 'testing · sampling · distributions' },
      { skill: 'Applied micro & macro', method: 'market structure · policy effects' },
    ],
    proof: 'top 9.4% of cohort',
  },
  {
    id: 'klub',
    place: 'Klub Investorů',
    years: '2024 — now',
    capabilities: [
      { skill: 'Valuation modelling', method: 'DCF · trading comps · SOTP' },
      { skill: 'Equity research writing', method: 'thesis · risks · memo structure' },
      { skill: 'Defending a position', method: 'committee Q&A · assumptions' },
    ],
    proof: '7 published pieces',
  },
  {
    id: 'xjtlu',
    place: 'XJTLU, Suzhou',
    years: '2026',
    capabilities: [
      { skill: 'Working in English', method: 'seminars · written assessment' },
      { skill: 'Cross-border analysis', method: 'Chinese market data · filings' },
    ],
    proof: 'semester abroad',
  },
  {
    id: 'china',
    place: 'BFSU & Donghua',
    years: '2025 — 2026',
    capabilities: [
      { skill: 'Mandarin', method: 'HSK3 certified · business press' },
      { skill: 'Reading primary sources', method: 'Chinese-language material' },
    ],
    proof: 'HSK1 → HSK3 in ten months',
  },
  {
    id: 'gym',
    place: 'Gymnázium Karla Sladkovského',
    years: '2015 — 2024',
    capabilities: [
      { skill: 'Research writing', method: 'thesis · argument · citation' },
      { skill: 'Quantitative basics', method: 'calculus · statistics' },
    ],
    proof: 'national thesis competition — placed',
  },
];

const EducationLab = () => {
  const hostRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
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
    const id = window.setInterval(() => setActive((a) => (a + 1) % STAGES.length), 4200);
    return () => window.clearInterval(id);
  }, [live, reduce, paused]);

  return (
    <aside
      ref={hostRef}
      className="hidden lg:block lg:sticky lg:top-24 lg:self-start"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label="Skills gained at each stage"
    >
      <div className="border-t border-gray-300 pt-3 pr-2">
        <div className="flex items-baseline justify-between">
          <p className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-gray-500">Skills gained</p>
          <p className="font-mono text-[7px] uppercase tracking-[0.12em] text-gray-400">
            {reduce ? 'static' : paused ? 'paused' : 'advancing'}
          </p>
        </div>

        <ol className="mt-3">
          {STAGES.map((stage, index) => {
            const open = index === active;
            return (
              <li key={stage.id} className="border-t border-gray-200 first:border-t-0">
                <button
                  type="button"
                  onClick={() => setActive(index)}
                  aria-expanded={open}
                  className="w-full py-2 text-left"
                >
                  <span className="flex items-baseline justify-between gap-3">
                    <span className="flex items-baseline gap-2">
                      <span
                        className={`font-mono text-[8px] tabular-nums transition-colors ${
                          open ? 'text-gray-900' : 'text-gray-300'
                        }`}
                      >
                        0{index + 1}
                      </span>
                      <span
                        className={`text-[10px] font-medium uppercase tracking-[0.06em] transition-colors ${
                          open ? 'text-gray-900' : 'text-gray-400'
                        }`}
                      >
                        {stage.place}
                      </span>
                    </span>
                    <span className="shrink-0 font-mono text-[7px] uppercase tracking-[0.08em] text-gray-400">
                      {stage.years}
                    </span>
                  </span>

                  <span className="relative mt-1 block h-[2px] overflow-hidden bg-gray-200">
                    <span
                      key={`${stage.id}-${open}`}
                      className="absolute inset-y-0 left-0 bg-gray-900"
                      style={{
                        width: open && !reduce ? '100%' : open ? '100%' : '0%',
                        transition: open && !reduce ? 'width 4.2s linear' : 'none',
                        animation: open && !reduce ? 'rail 4.2s linear both' : 'none',
                      }}
                    />
                  </span>

                  <span className="mt-1 grid overflow-hidden" style={{ gridTemplateRows: open ? '1fr' : '0fr' }}>
                    <span className="min-h-0">
                      <span className="block space-y-[3px]">
                        {stage.capabilities.map((capability) => (
                          <span key={capability.skill} className="flex items-baseline justify-between gap-3">
                            <span className="text-[11.5px] leading-tight text-gray-900">{capability.skill}</span>
                            <span className="shrink-0 text-right font-mono text-[8px] uppercase leading-tight tracking-[0.05em] text-gray-400">
                              {capability.method}
                            </span>
                          </span>
                        ))}
                      </span>
                      {stage.proof && (
                        <span className="mt-1.5 block border-t border-dashed border-gray-200 pt-1 font-mono text-[7.5px] uppercase tracking-[0.08em] text-gray-500">
                          {stage.proof}
                        </span>
                      )}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        <p className="mt-2 border-t border-gray-200 pt-2 font-mono text-[7px] uppercase tracking-[0.1em] text-gray-400">
          5 stages · 12 capabilities named
        </p>
      </div>

      <style>{`
        @keyframes rail { from { width: 0%; } to { width: 100%; } }
        @media (prefers-reduced-motion: reduce) {
          aside span { animation: none !important; transition: none !important; }
        }
      `}</style>
    </aside>
  );
};

export default EducationLab;
