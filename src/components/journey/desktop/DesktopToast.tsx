import { useEffect, useRef, useState } from 'react';
import { Check, X } from 'lucide-react';

/**
 * macOS-style banner in the top-right of the desktop. It exists to tell a
 * first-time visitor that this is not a screenshot: every app in the dock
 * opens, and the terminal, mail, finder and settings all do something. Shown
 * once per browser session when the desktop scrolls into view, dismissible,
 * and it gets out of the way on its own.
 */

type Props = { active: boolean };

const DesktopToast = ({ active }: Props) => {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    if (!active) return;
    let seen = false;
    try {
      seen = window.sessionStorage.getItem('shmack-toast') === '1';
    } catch {
      seen = false;
    }
    if (seen) return;

    const show = window.setTimeout(() => {
      setVisible(true);
      try {
        window.sessionStorage.setItem('shmack-toast', '1');
      } catch {
        /* private mode */
      }
    }, 1400);
    timers.current.push(show);

    const hide = window.setTimeout(() => dismiss(), 13000);
    timers.current.push(hide);

    return () => {
      timers.current.forEach((id) => window.clearTimeout(id));
      timers.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const dismiss = () => {
    setLeaving(true);
    const id = window.setTimeout(() => {
      setVisible(false);
      setLeaving(false);
    }, 260);
    timers.current.push(id);
  };

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`shmack-toast absolute right-3 top-9 z-[95] w-[330px] max-w-[calc(100vw-24px)] ${leaving ? 'shmack-toast--out' : 'shmack-toast--in'}`}
    >
      <div className="relative flex gap-3 rounded-2xl border border-white/60 bg-[#f7f7f8]/[0.98] p-3 pr-9 shadow-[0_18px_50px_-12px_rgba(0,0,0,0.6)] backdrop-blur-2xl">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-gradient-to-b from-zinc-700 to-zinc-900 text-white shadow-inner">
          <Check className="h-4 w-4" aria-hidden="true" />
        </span>

        <div className="min-w-0">
          <p className="text-[12px] font-semibold leading-snug text-zinc-900">Shmack OS</p>
          <p className="mt-0.5 text-[11.5px] leading-snug text-zinc-700">
            This is a fully working system — every app in the dock opens. Click one and try it.
          </p>
          <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-zinc-400">now</p>
        </div>

        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss notification"
          className="absolute right-2 top-2 rounded-full p-1 text-zinc-400 transition-colors hover:bg-black/5 hover:text-zinc-700"
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>

      <style>{`
        .shmack-toast--in { animation: shmackToastIn 520ms cubic-bezier(.16,1,.3,1) both; }
        .shmack-toast--out { animation: shmackToastOut 240ms ease-in both; }
        @keyframes shmackToastIn {
          from { opacity: 0; transform: translate3d(28px, -14px, 0) scale(.96); }
          to { opacity: 1; transform: translate3d(0, 0, 0) scale(1); }
        }
        @keyframes shmackToastOut {
          from { opacity: 1; transform: translate3d(0, 0, 0) scale(1); }
          to { opacity: 0; transform: translate3d(24px, -10px, 0) scale(.97); }
        }
        @media (prefers-reduced-motion: reduce) {
          .shmack-toast--in, .shmack-toast--out { animation: none; }
        }
      `}</style>
    </div>
  );
};

export default DesktopToast;
