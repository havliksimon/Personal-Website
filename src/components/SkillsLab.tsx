import { useEffect, useRef, useState } from 'react';

/**
 * Working method — four processes running at once, in the page's own language.
 *
 * 01 Equity research : price draws against a benchmark, a drawdown band fills,
 *                      an event pins, three KPIs count up.
 * 02 DCF build       : five stages advance on their own clock, then the bridge
 *                      resolves from EV to a per-share number.
 * 03 Model run       : a pandas cell executes and reports rows, quarters, time.
 * 04 Delivery        : a sprint board moves one card per cycle, backlog → shipped.
 * 05 Thesis          : four pages assemble, the active page lifting off the stack.
 *
 * One 100 ms clock drives every cadence so the panel stays cheap; motion is
 * transform/opacity only, it stops off-screen, and it is static under reduced
 * motion.
 */

const TICK = 100;

const KPIS = [
  { label: 'Rev CAGR', value: 18.4, suffix: '%' },
  { label: 'EBIT margin', value: 12.6, suffix: '%' },
  { label: 'FCF yield', value: 3.2, suffix: '%' },
];

const DCF_STEPS = [
  { label: 'Forecast', meta: '5y' },
  { label: 'FCFF', meta: 'NOPAT' },
  { label: 'WACC', meta: '9.4%' },
  { label: 'Terminal', meta: 'g 2.5%' },
  { label: 'Bridge', meta: 'EV→Eq' },
];

const BRIDGE = [
  { label: 'EV', value: 24.8 },
  { label: 'Net debt', value: -3.1 },
  { label: 'Equity', value: 21.7 },
  { label: 'Per share', value: 18.4 },
];

const CARDS = [
  { id: 'a', title: 'Peer set', tag: 'CCA' },
  { id: 'b', title: 'WACC build', tag: 'DCF' },
  { id: 'c', title: 'Unit economics', tag: 'Model' },
  { id: 'd', title: 'Sensitivity', tag: 'Risk' },
];

const COLUMNS = ['Backlog', 'Build', 'Review', 'Shipped'];

const SkillsLab = () => {
  const hostRef = useRef<HTMLDivElement>(null);
  const [t, setT] = useState(0);
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
    if (!live || reduce) return;
    const id = window.setInterval(() => setT((v) => v + 1), TICK);
    return () => window.clearInterval(id);
  }, [live, reduce]);

  const dcf = Math.floor(t / 24) % DCF_STEPS.length;          // 2.4s
  const bridge = Math.min(BRIDGE.length - 1, Math.floor(t / 24) % (BRIDGE.length + 2));
  const sprint = Math.floor(t / 30) % 4;                       // 3.0s
  const page = Math.floor(t / 42) % 4;                         // 4.2s
  const kpi = reduce ? 1 : Math.min(1, t / 42);

  const columnOf = (index: number) => (reduce ? (index + 1) % 4 : (index + sprint) % 4);

  return (
    <aside ref={hostRef} className="hidden lg:block" aria-label="Working method">
      <div className="border-t border-gray-300 pt-3">
        <div className="flex items-baseline justify-between">
          <p className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-gray-500">Working method</p>
          <p className="flex items-center gap-1.5 font-mono text-[8px] uppercase tracking-[0.12em] text-gray-400">
            <span className={`h-1 w-1 rounded-full ${live && !reduce ? 'bg-emerald-500' : 'bg-gray-300'}`} />
            {reduce ? 'static' : live ? 'live' : 'paused'}
          </p>
        </div>

        {/* 01 — equity research */}
        <figure className="mt-4 border-t border-gray-200 pt-3">
          <figcaption className="flex items-baseline justify-between gap-3">
            <span className="text-[12.5px] font-semibold tracking-[-0.01em] text-gray-900">Equity research</span>
            <span className="font-mono text-[7.5px] uppercase tracking-[0.1em] text-gray-400">price · benchmark</span>
          </figcaption>

          <svg viewBox="0 0 300 92" className="mt-1.5 w-full" role="img" aria-label="Price against benchmark, drawdown band and event marker">
            <defs>
              <linearGradient id="ddBand" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#111827" stopOpacity="0.13" />
                <stop offset="100%" stopColor="#111827" stopOpacity="0" />
              </linearGradient>
            </defs>

            {[8, 30, 52, 74].map((y) => (
              <line key={y} x1="0" y1={y} x2="300" y2={y} stroke="#eef0f3" strokeWidth="0.7" />
            ))}

            <path d="M0 74 L45 70 L90 71 L135 62 L180 63 L225 54 L270 50 L300 47" fill="none" stroke="#c7ccd4" strokeWidth="1.1" strokeDasharray="3 3" />

            <path d="M0 78 L28 71 L52 74 L78 63 L104 67 L130 50 L156 55 L182 39 L208 33 L234 38 L260 24 L286 20 L300 15" fill="none" stroke="#111827" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" pathLength={1}
              style={{ strokeDasharray: 1, strokeDashoffset: reduce ? 0 : 1, animation: reduce ? 'none' : 'drawLine 6.5s cubic-bezier(.35,0,.2,1) infinite' }} />

            <path d="M156 55 L182 39 L208 33 L208 46 L182 50 L156 63 Z" fill="url(#ddBand)" />
            <text x="160" y="70" fontSize="6.2" fontFamily="ui-monospace, monospace" fill="#9aa3ae">
              −12.4% dd
            </text>

            <circle cx="208" cy="33" r="2.4" fill="#111827" />
            <circle cx="208" cy="33" r="2.4" fill="none" stroke="#111827" strokeWidth="0.8">
              <animate attributeName="r" values="2.4;6;2.4" dur="2.6s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.45;0;0.45" dur="2.6s" repeatCount="indefinite" />
            </circle>
            <line x1="208" y1="33" x2="208" y2="16" stroke="#9aa3ae" strokeWidth="0.7" strokeDasharray="2 2" />
            <text x="203" y="14" fontSize="6.8" fontFamily="ui-monospace, monospace" fill="#4b5563" textAnchor="end">
              margin turn
            </text>
          </svg>

          <div className="mt-2 grid grid-cols-3 gap-3 border-t border-gray-100 pt-2">
            {KPIS.map((item) => (
              <div key={item.label}>
                <p className="font-mono text-[6.8px] uppercase tracking-[0.1em] text-gray-400">{item.label}</p>
                <p className="font-mono text-[13px] tabular-nums leading-tight text-gray-900">
                  {(item.value * kpi).toFixed(1)}
                  <span className="text-[9px] text-gray-500">{item.suffix}</span>
                </p>
              </div>
            ))}
          </div>
        </figure>

        {/* 02 — dcf */}
        <figure className="mt-4 border-t border-gray-200 pt-3">
          <figcaption className="flex items-baseline justify-between gap-3">
            <span className="text-[12.5px] font-semibold tracking-[-0.01em] text-gray-900">DCF build</span>
            <span className="font-mono text-[7.5px] uppercase tracking-[0.1em] text-gray-400">
              {DCF_STEPS[dcf].label} · {DCF_STEPS[dcf].meta}
            </span>
          </figcaption>

          <ol className="mt-2 flex gap-1">
            {DCF_STEPS.map((step, index) => {
              const done = index < dcf;
              const current = index === dcf;
              return (
                <li key={step.label} className="flex-1">
                  <span
                    className={`block h-[3px] rounded-full transition-colors duration-300 ${
                      current ? 'bg-gray-900' : done ? 'bg-gray-500' : 'bg-gray-200'
                    }`}
                  />
                  <span
                    className={`mt-1 block font-mono text-[7.5px] uppercase leading-none tracking-[0.06em] transition-colors duration-300 ${
                      current ? 'text-gray-900' : done ? 'text-gray-500' : 'text-gray-400'
                    }`}
                  >
                    {step.label}
                  </span>
                </li>
              );
            })}
          </ol>

          <div className="mt-2.5 grid grid-cols-4 gap-1 border-t border-gray-100 pt-2">
            {BRIDGE.map((item, index) => (
              <span key={item.label} className="flex flex-col">
                <span className="font-mono text-[6.8px] uppercase tracking-[0.08em] text-gray-400">{item.label}</span>
                <span
                  className={`font-mono text-[12px] tabular-nums leading-tight transition-opacity duration-300 ${
                    index <= bridge ? 'text-gray-900 opacity-100' : 'text-gray-900 opacity-20'
                  }`}
                >
                  {item.value.toFixed(1)}
                </span>
              </span>
            ))}
          </div>
        </figure>

        {/* 03 — model run */}
        <figure className="mt-4 border-t border-gray-200 pt-3">
          <figcaption className="flex items-baseline justify-between gap-3">
            <span className="text-[12.5px] font-semibold tracking-[-0.01em] text-gray-900">Model run</span>
            <span className="font-mono text-[7.5px] uppercase tracking-[0.1em] text-gray-400">python · pandas</span>
          </figcaption>

          <div className="mt-2 rounded-[3px] border border-gray-200 bg-gray-50/80 px-2 py-1.5">
            <p className="truncate font-mono text-[8.5px] leading-relaxed text-gray-700">
              <span className="text-gray-400">›</span> df.pivot_table(index=<span className="text-emerald-700">&apos;quarter&apos;</span>, columns=<span className="text-emerald-700">&apos;segment&apos;</span>)
            </p>
            <p className="mt-0.5 flex items-center gap-1 font-mono text-[8.5px] leading-relaxed text-gray-500">
              <span className="text-emerald-600">✓</span> 18 quarters · 4 segments · 0.8s
              <span className={`ml-0.5 inline-block h-[8px] w-[3px] bg-gray-700 ${reduce ? 'opacity-0' : 'animate-pulse'}`} />
            </p>
          </div>
        </figure>

        {/* 04 — delivery */}
        <figure className="mt-4 border-t border-gray-200 pt-3">
          <figcaption className="flex items-baseline justify-between gap-3">
            <span className="text-[12.5px] font-semibold tracking-[-0.01em] text-gray-900">Delivery</span>
            <span className="font-mono text-[7.5px] uppercase tracking-[0.1em] text-gray-400">sprint 3 · 2-week cadence</span>
          </figcaption>

          <div className="mt-2 grid grid-cols-4 gap-1.5">
            {COLUMNS.map((column, columnIndex) => {
              const cards = CARDS.filter((_, index) => columnOf(index) === columnIndex);
              return (
                <div key={column} className="min-h-[52px]">
                  <p className="mb-1 font-mono text-[6.6px] uppercase tracking-[0.08em] text-gray-400">{column}</p>
                  <div className="space-y-1">
                    {cards.map((card) => (
                      <p
                        key={card.id}
                        className="rounded-[2px] border border-gray-200 bg-white px-1 py-1 text-[7.5px] leading-tight text-gray-700 shadow-[0_1px_0_rgba(0,0,0,.03)] transition-all duration-500"
                      >
                        {card.title}
                        <span className="mt-0.5 block font-mono text-[6px] uppercase tracking-[0.06em] text-gray-400">
                          {card.tag}
                        </span>
                      </p>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </figure>

        {/* 05 — thesis */}
        <figure className="mt-4 border-t border-gray-200 pt-3">
          <figcaption className="flex items-baseline justify-between gap-3">
            <span className="text-[12.5px] font-semibold tracking-[-0.01em] text-gray-900">Thesis</span>
            <span className="font-mono text-[7.5px] uppercase tracking-[0.1em] text-gray-400">page {page + 1} of 4</span>
          </figcaption>

          <div className="mt-2 flex items-end gap-1.5">
            {[0, 1, 2, 3].map((index) => {
              const active = index === page;
              return (
                <span
                  key={index}
                  className={`flex-1 rounded-[2px] border bg-white px-1 pt-1 transition-all duration-500 ${
                    active
                      ? '-translate-y-0.5 border-gray-400 shadow-[0_3px_6px_-3px_rgba(0,0,0,.25)]'
                      : 'border-gray-200'
                  }`}
                  style={{ height: active ? 54 : 46 }}
                >
                  <span className={`block h-[2px] rounded-sm ${active ? 'w-4/5 bg-gray-500' : 'w-3/4 bg-gray-300'}`} />
                  <span className="mt-1 block h-[2px] w-2/3 rounded-sm bg-gray-200" />
                  <span className="mt-1 block h-[2px] w-3/4 rounded-sm bg-gray-200" />
                  <span className={`mt-1.5 block h-[12px] w-full rounded-[1px] ${active ? 'bg-gray-200' : 'bg-gray-100'}`} />
                </span>
              );
            })}
          </div>
        </figure>

        <p className="mt-3 flex items-center justify-between font-mono text-[7px] uppercase tracking-[0.1em] text-gray-400">
          <span>illustrative model excerpt · no client data</span>
          <span>{reduce ? 'static view' : 'five processes · one page'}</span>
        </p>
      </div>

      <style>{`
        @keyframes drawLine {
          0% { stroke-dashoffset: 1; }
          58%, 100% { stroke-dashoffset: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          aside svg path { animation: none !important; stroke-dashoffset: 0 !important; }
        }
      `}</style>
    </aside>
  );
};

export default SkillsLab;
