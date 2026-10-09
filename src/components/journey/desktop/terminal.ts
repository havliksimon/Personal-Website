import { useEffect, useState } from 'react';
import timelineData from '../../../data/timeline.json';

interface RawEvent {
  id: number;
  type: string;
  title: string;
  subtitle: string;
  date: string;
  location: string;
  description: string;
  status: string;
  skills?: string[];
}

const events = (timelineData as { events: RawEvent[] }).events;

export interface Seg {
  text: string;
  cls: string;
}

const seg = (text: string, cls: string): Seg => ({ text, cls });

export const SCRIPT: Seg[] = [
  seg('Last login: Thu Oct  9 21:41:02 on ttys001\n', 'text-zinc-500'),
  seg('simon@macbook ', 'font-semibold text-emerald-400'),
  seg('~ ', 'font-semibold text-sky-400'),
  seg('% ', 'text-zinc-400'),
  seg('cat ~/journey/education.log\n\n', 'text-zinc-100'),
  ...events.flatMap((event) => [
    seg('▸ ', 'text-emerald-400'),
    seg(event.date, 'text-sky-400'),
    seg('   ', ''),
    seg(`${event.title}\n`, 'font-semibold text-zinc-100'),
    seg(`  ${event.subtitle}`, 'text-zinc-300'),
    seg('  ·  ', 'text-zinc-600'),
    seg(`${event.location}\n`, 'text-emerald-400'),
    seg(`  ${event.description}\n`, 'text-zinc-400'),
    seg(`  ${(event.skills ?? []).map((skill) => `#${skill}`).join('  ')}\n`, 'text-cyan-400'),
    seg('\n', ''),
  ]),
  seg('simon@macbook ', 'font-semibold text-emerald-400'),
  seg('~ ', 'font-semibold text-sky-400'),
  seg('% ', 'text-zinc-400'),
];

export const TOTAL_CHARS = SCRIPT.reduce((sum, s) => sum + s.text.length, 0);

export const SEG_STARTS: number[] = [];
{
  let acc = 0;
  for (const s of SCRIPT) {
    SEG_STARTS.push(acc);
    acc += s.text.length;
  }
}

/**
 * Types the script out, ramping from a slow start to a steady pace.
 * Starts when `started` flips true (i.e. the section scrolls into view).
 */
export const useTyping = (started: boolean): number => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!started) return;
    let timer: number | undefined;
    let typed = 0;
    const tick = () => {
      if (typed >= TOTAL_CHARS) return;
      const delay = typed < 140 ? 24 : 8;
      timer = window.setTimeout(() => {
        typed += 1;
        setCount(typed);
        tick();
      }, delay);
    };
    tick();
    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, [started]);

  return count;
};
