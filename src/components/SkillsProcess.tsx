import { useEffect, useState } from 'react';

/**
 * How the work actually runs, shown rather than claimed: source, model, value,
 * stress, publish. Light editorial panel — a numbered rail, one stage open at a
 * time with a small live diagram. No terminal chrome, no invented software.
 */

const STAGES = [
  { id: 'source', label: 'Source', detail: 'Filings · prices · transcripts' },
  { id: 'model', label: 'Model', detail: 'Three statements · unit economics' },
  { id: 'value', label: 'Value', detail: 'DCF · comps · SOTP' },
  { id: 'stress', label: 'Stress', detail: 'WACC · growth · downside' },
  { id: 'publish', label: 'Publish', detail: 'Memo · deck · model' },
] as const;

const BARS = [38, 62, 47, 78, 55, 90, 68];

const Visual = ({ stage }: { stage: string }) => {
  if (stage === 'source') {
    return (
      <span className="mt-2 flex h-7 items-end gap-1" aria-hidden="true">
        {BARS.map((height, index) => (
          <span
            key={index}
            className="w-1.5 rounded-sm bg-gray-300"
            style={{ height: `${height}%`, animation: `srcBar 1.6s ${index * 90}ms ease-in-out infinite alternate` }}
          />
        ))}
      </span>
    );
  }

  if (stage === 'model') {
    return (
      <span className="mt-2 block space-y-1" aria-hidden="true">
        {[92, 76, 84, 61].map((width, index) => (
          <span key={index} className="flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-gray-300" />
            <span
              className="h-1 rounded-sm bg-gray-300"
              style={{ width: `${width}%`, animation: `modLine 1.8s ${index * 120}ms ease-in-out infinite alternate` }}
            />
          </span>
        ))}
      </span>
    );
  }

  if (stage === 'value') {
    return (
      <span className="mt-2 block space-y-1" aria-hidden="true">
        {[
          ['DCF', 88],
          ['CCA', 64],
          ['SOTP', 42],
        ].map(([label, width]) => (
          <span key={String(label)} className="flex items-center gap-2">
            <span className="w-8 font-mono text-[7.5px] uppercase tracking-[0.1em] text-gray-400">{label}</span>
            <span className="h-1.5 flex-1 rounded-sm bg-gray-200">
              <span
                className="block h-full rounded-sm bg-gray-500"
                style={{ width: `${width}%`, animation: 'valGrow 1.4s ease-out both' }}
              />
            </span>
          </span>
        ))}
      </span>
    );
  }

  if (stage === 'stress') {
    return (
      <span className="mt-2 grid w-[132px] grid-cols-5 gap-0.5" aria-hidden="true">
        {Array.from({ length: 20 }).map((_, index) => (
          <span
            key={index}
            className="h-3 rounded-[1px]"
            style={{
              background: `rgba(17,24,39,${0.05 + (index % 7) * 0.07})`,
              animation: `stressCell 2.2s ${index * 40}ms ease-in-out infinite alternate`,
            }}
          />
        ))}
      </span>
    );
  }

  return (
    <span className="mt-2 block w-[132px] space-y-1" aria-hidden="true">
      <span className="block h-1.5 rounded-sm bg-gray-300" />
      <span className="block h-1.5 w-4/5 rounded-sm bg-gray-300" />
      <span className="block h-1.5 w-2/3 rounded-sm bg-gray-300" />
      <span className="mt-1.5 inline-block h-1.5 w-8 rounded-sm bg-gray-500" />
    </span>
  );
};

const SkillsProcess = () => {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    setReduce(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  useEffect(() => {
    if (reduce || paused) return;
    const id = window.setInterval(() => setActive((a) => (a + 1) % STAGES.length), 2600);
    return () => window.clearInterval(id);
  }, [reduce, paused]);

  return (
    <aside
      className="hidden lg:block lg:sticky lg:top-24"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label="How the work runs"
    >
      <div className="border-t border-gray-300 pt-3">
        <p className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-gray-500">How the work runs</p>

        <ol className="mt-3 border-b border-gray-200">
          {STAGES.map((stage, index) => {
            const current = index === active;
            return (
              <li key={stage.id} className="border-t border-gray-200 first:border-t-0">
                <button
                  type="button"
                  onClick={() => setActive(index)}
                  aria-expanded={current}
                  className="flex w-full items-start gap-3 py-2 text-left"
                >
                  <span
                    className={`mt-0.5 font-mono text-[9px] tabular-nums transition-colors ${
                      current ? 'text-gray-900' : 'text-gray-300'
                    }`}
                  >
                    0{index + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span
                      className={`block text-[13px] font-medium transition-colors ${
                        current ? 'text-gray-900' : 'text-gray-500'
                      }`}
                    >
                      {stage.label}
                    </span>
                    <span className="mt-0.5 block font-mono text-[7.5px] uppercase leading-tight tracking-[0.08em] text-gray-400">
                      {stage.detail}
                    </span>
                    {current && <Visual stage={stage.id} />}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        <p className="mt-2 font-mono text-[8px] uppercase tracking-[0.12em] text-gray-400">
          {paused ? 'paused' : 'running'} · click a stage
        </p>
      </div>

      <style>{`
        @keyframes srcBar { from { transform: scaleY(.6); } to { transform: scaleY(1); } }
        @keyframes modLine { from { opacity: .45; } to { opacity: 1; } }
        @keyframes valGrow { from { width: 0; } }
        @keyframes stressCell { from { opacity: .45; } to { opacity: 1; } }
        @media (prefers-reduced-motion: reduce) {
          aside span { animation: none !important; }
        }
      `}</style>
    </aside>
  );
};

export default SkillsProcess;
