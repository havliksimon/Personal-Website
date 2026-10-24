import { useEffect, useRef, useState } from 'react';

/**
 * Animated case workbench: the analyst workflow a recruiter actually cares
 * about — analyse, value, report. Pure CSS/SVG, cycle pauses on hover, and
 * settles on the first scene when reduced motion is requested.
 */

type Scene = 0 | 1 | 2;

const TABS = ['Analyse', 'Value', 'Report'] as const;

const COMPARABLES = [
  { name: 'Peer A', pe: 18.4, width: 78 },
  { name: 'Peer B', pe: 21.1, width: 90 },
  { name: 'Peer C', pe: 16.2, width: 68 },
  { name: 'Target', pe: 14.8, width: 61, accent: true },
];

const GRID = [
  [8.2, 9.1, 10.0, 10.9, 11.8],
  [8.9, 9.9, 10.9, 11.9, 12.9],
  [9.7, 10.8, 11.9, 13.0, 14.1],
  [10.6, 11.8, 13.0, 14.2, 15.4],
  [11.5, 12.8, 14.1, 15.4, 16.7],
];

const SkillsWorkbench = () => {
  const [scene, setScene] = useState<Scene>(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    if (paused) return;
    timer.current = window.setTimeout(() => {
      setScene((current) => ((current + 1) % 3) as Scene);
    }, 4200);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [scene, paused]);

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-slate-800 bg-[#0a0c10] text-slate-100 shadow-2xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* chrome */}
      <div className="flex items-center justify-between border-b border-slate-800/80 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#c8a15a]" />
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-slate-500">
            Case workbench
          </span>
        </div>
        <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-slate-500">
          {paused ? 'paused' : 'live'}
        </span>
      </div>

      {/* tabs */}
      <div className="flex gap-1 border-b border-slate-800/60 px-3 pt-2">
        {TABS.map((label, index) => (
          <button
            key={label}
            type="button"
            onClick={() => setScene(index as Scene)}
            className={`relative px-3 py-2 font-mono text-[9px] uppercase tracking-[0.16em] transition-colors ${
              scene === index ? 'text-[#e8cd97]' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {label}
            {scene === index && (
              <span className="absolute inset-x-2 -bottom-px h-px bg-[#c8a15a]" />
            )}
          </button>
        ))}
      </div>

      {/* stage */}
      <div className="relative h-[300px] px-4 py-4 sm:h-[330px]">
        {/* scene 0 — analysis */}
        <div className={`scene ${scene === 0 ? 'scene--on' : ''}`}>
          <div className="mb-3 flex items-baseline justify-between">
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-slate-500">
              Comparable company analysis
            </p>
            <p className="font-mono text-[9px] text-slate-500">P/E · trailing</p>
          </div>
          <div className="space-y-2.5">
            {COMPARABLES.map((row, index) => (
              <div key={row.name} className="grid grid-cols-[64px_1fr_42px] items-center gap-3">
                <span className={`text-[11px] ${row.accent ? 'text-[#e8cd97]' : 'text-slate-300'}`}>
                  {row.name}
                </span>
                <span className="h-1.5 overflow-hidden rounded-full bg-slate-800">
                  <span
                    className={`block h-full origin-left rounded-full ${
                      row.accent ? 'bg-[#c8a15a]' : 'bg-slate-500'
                    }`}
                    style={{
                      width: `${row.width}%`,
                      animation: `barGrow 900ms ${index * 120}ms cubic-bezier(.2,.7,.2,1) both`,
                    }}
                  />
                </span>
                <span className={`text-right font-mono text-[10px] ${row.accent ? 'text-[#e8cd97]' : 'text-slate-400'}`}>
                  {row.pe.toFixed(1)}x
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-md border border-slate-800 bg-slate-900/40 p-3">
            <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-slate-500">Screen</p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-300">
              Target trades at 14.8× against a peer median of 18.4× — a 20% discount on
              trailing earnings with a cleaner balance sheet.
            </p>
          </div>
        </div>

        {/* scene 1 — valuation */}
        <div className={`scene ${scene === 1 ? 'scene--on' : ''}`}>
          <div className="mb-2 flex items-baseline justify-between">
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-slate-500">
              DCF sensitivity · implied value
            </p>
            <p className="font-mono text-[9px] text-slate-500">€ per share</p>
          </div>
          <div className="grid grid-cols-5 gap-1">
            {GRID.flat().map((value, index) => {
              const intensity = Math.min(0.9, 0.22 + (value - 8) / 10);
              return (
                <div
                  key={index}
                  className="flex h-9 items-center justify-center rounded-sm border border-[#c8a15a]/20 font-mono text-[9px] font-medium text-white"
                  style={{
                    background: `rgba(200,161,90,${intensity.toFixed(2)})`,
                    animation: `cellIn 420ms ${index * 14}ms ease both`,
                  }}
                >
                  {value.toFixed(1)}
                </div>
              );
            })}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="rounded-md border border-slate-800 bg-slate-900/40 p-2.5">
              <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-slate-500">WACC</p>
              <p className="mt-1 font-mono text-lg text-slate-100">8.4%</p>
            </div>
            <div className="rounded-md border border-slate-800 bg-slate-900/40 p-2.5">
              <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-slate-500">Upside</p>
              <p className="mt-1 font-mono text-lg text-[#8fc7a0]">+27.4%</p>
            </div>
          </div>
        </div>

        {/* scene 2 — report */}
        <div className={`scene ${scene === 2 ? 'scene--on' : ''}`}>
          <div className="mb-3 flex items-baseline justify-between">
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-slate-500">
              Investment memo
            </p>
            <p className="font-mono text-[9px] text-slate-500">4 pages</p>
          </div>
          <div className="space-y-2">
            {['Thesis', 'Valuation', 'Risks', 'Appendix'].map((section, index) => (
              <div
                key={section}
                className="flex items-center justify-between rounded-md border border-slate-800 bg-slate-900/40 px-3 py-2"
                style={{ animation: `rowIn 480ms ${index * 110}ms cubic-bezier(.2,.7,.2,1) both` }}
              >
                <span className="text-[11px] text-slate-300">{section}</span>
                <span className="font-mono text-[9px] text-slate-500">0{index + 1}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            {['PDF', 'XLSX', 'Charts'].map((chip) => (
              <span
                key={chip}
                className="rounded-sm border border-[#c8a15a]/40 bg-[#c8a15a]/10 px-2 py-1 font-mono text-[8px] uppercase tracking-[0.14em] text-[#e8cd97]"
              >
                {chip}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* footer */}
      <div className="flex items-center justify-between border-t border-slate-800/80 px-4 py-2.5">
        <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-slate-500">
          {TABS[scene]} · step {scene + 1} of 3
        </span>
        <span className="flex gap-1">
          {TABS.map((label, index) => (
            <span
              key={label}
              className={`h-1 w-6 rounded-full ${scene === index ? 'bg-[#c8a15a]' : 'bg-slate-800'}`}
            />
          ))}
        </span>
      </div>

      <style>{`
        .scene { position: absolute; inset: 0; padding: 16px; opacity: 0; transform: translateY(6px); transition: opacity 240ms ease, transform 240ms ease; pointer-events: none; }
        .scene--on { opacity: 1; transform: none; pointer-events: auto; }
        @keyframes barGrow { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        @keyframes cellIn { from { opacity: 0; transform: scale(.94); } to { opacity: 1; transform: none; } }
        @keyframes rowIn { from { opacity: 0; transform: translateX(-6px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) {
          .scene { transition: none; }
          .scene--on * { animation: none !important; }
        }
      `}</style>
    </div>
  );
};

export default SkillsWorkbench;
