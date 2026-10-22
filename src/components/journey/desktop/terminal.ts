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

export const seg = (text: string, cls: string): Seg => ({ text, cls });

/** One output line = one Seg[] */
export const line = (text: string, cls: string): Seg[] => [seg(text, cls)];

/* ------------------------------ Intro ------------------------------ */

export const SCRIPT: Seg[] = [
  seg('Last login: Thu Oct  9 21:41:02 on ttys001\n', 'text-zinc-500'),
  seg('simon@shmackbook ', 'font-semibold text-emerald-400'),
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
 * Types the intro out, ramping from a slow start to a steady pace.
 */
export const useTyping = (started: boolean): number => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!started) return;
    let timer: number | undefined;
    let typed = 0;
    const tick = () => {
      if (typed >= TOTAL_CHARS) return;
      const delay = typed < 120 ? 16 : 3;
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

/* --------------------------- Filesystem ---------------------------- */

export type FileKind = 'pdf' | 'html' | 'txt' | 'skills' | 'log' | 'cv';

export interface VFile {
  name: string;
  kind: FileKind;
  docId?: number;
  content?: string;
}

export interface VDir {
  name: string;
  dirs: VDir[];
  files: VFile[];
}

export const ROOT: VDir = {
  name: '~',
  dirs: [
    {
      name: 'journey',
      dirs: [],
      files: [{ name: 'education.log', kind: 'log' }],
    },
    {
      name: 'analyses',
      dirs: [],
      files: [
        { name: 'bilibili_equity_analysis.pdf', kind: 'pdf', docId: 1 },
        { name: 'tuya_inc_analysis.pdf', kind: 'pdf', docId: 2 },
        { name: 'alphabet_google_analysis.pdf', kind: 'pdf', docId: 3 },
      ],
    },
    {
      name: 'presentations',
      dirs: [],
      files: [
        { name: 'chagee_investment_case.pdf', kind: 'pdf', docId: 4 },
        { name: 'tencent_investment_case.pdf', kind: 'pdf', docId: 5 },
      ],
    },
    {
      name: 'projects',
      dirs: [],
      files: [{ name: 'links.html', kind: 'html' }],
    },
    {
      name: 'skills',
      dirs: [],
      files: [{ name: 'skills.freeform', kind: 'skills' }],
    },
    {
      name: 'cv',
      dirs: [],
      files: [
        { name: 'simon_havlik_cv.pdf', kind: 'cv', docId: 10 },
        {
          name: 'README.txt',
          kind: 'txt',
          content: [
            'CV — Simon Havlík',
            '',
            'Open it here:   open simon_havlik_cv.pdf',
            'Otherwise:      the Figma app on the dock,',
            '                Finder → CV,',
            '                or the CV.pdf icon on the desktop.',
          ].join('\n'),
        },
      ],
    },
  ],
  files: [
    {
      name: 'about.txt',
      kind: 'txt',
      content: [
        'SIMON HAVLÍK',
        'Economics student at VŠE Prague · equity analyst · China/APAC focus.',
        '',
        'Analyses of Bilibili, Tuya, Alphabet. Investment cases on Chagee and Tencent.',
        'Mandarin HSK3, semester abroad at XJTLU, summer at BFSU, HSK4 track at Donghua.',
        '',
        'Try: cd analyses && ls && open bilibili_equity_analysis.pdf',
      ].join('\n'),
    },
  ],
};

const splitPath = (path: string) => path.replace(/^~\/?/, '').split('/').filter(Boolean);

export const getDir = (path: string): VDir | null => {
  let node: VDir = ROOT;
  for (const part of splitPath(path)) {
    const next = node.dirs.find((d) => d.name === part);
    if (!next) return null;
    node = next;
  }
  return node;
};

export const parentPath = (path: string): string => {
  const parts = splitPath(path);
  parts.pop();
  return parts.length ? `~/${parts.join('/')}` : '~';
};

export const joinPath = (path: string, name: string): string => {
  if (name === '~') return '~';
  if (name.startsWith('~/')) return name.replace(/\/$/, '');
  if (name === '.') return path;
  if (name === '..') return parentPath(path);
  return path === '~' ? `~/${name}` : `${path}/${name}`;
};

export const EDUCATION_LOG = events
  .map(
    (event) =>
      `▸ ${event.date}   ${event.title}\n  ${event.subtitle}  ·  ${event.location}\n  ${event.description}\n  ${(event.skills ?? [])
        .map((skill) => `#${skill}`)
        .join('  ')}`
  )
  .join('\n\n');

/* ---------------------------- Outputs ------------------------------ */

const kv = (key: string, value: string): Seg[] => [
  seg(`${key}`, 'font-semibold text-cyan-400'),
  seg(`: ${value}`, 'text-zinc-300'),
];

/** Same as kv, but the value is built from styled segments. */
const kvSegs = (key: string, ...value: Seg[]): Seg[] => [
  seg(`${key}`, 'font-semibold text-cyan-400'),
  seg(': ', 'text-zinc-300'),
  ...value,
];

const ageSince = (year: number, month: number, day: number): string => {
  const now = new Date();
  const then = new Date(year, month - 1, day);
  let years = now.getFullYear() - then.getFullYear();
  let months = now.getMonth() - then.getMonth();
  let days = now.getDate() - then.getDate();
  if (days < 0) {
    months -= 1;
    days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  return `${years} years, ${months} months, ${days} days`;
};

const helpLine = (cmd: string, desc: string): Seg[] => [
  seg(`  ${cmd}`.padEnd(20, ' '), 'text-cyan-300'),
  seg(desc, 'text-zinc-300'),
];

export const HELP: Seg[][] = [
  line('Shmack shell — available commands:', 'text-zinc-200'),
  helpLine('help', 'show this list'),
  helpLine('ls, lsd', 'list files (lsd = fancy)'),
  helpLine('cd <dir>', 'change directory — try `cd analyses`'),
  helpLine('pwd', 'print working directory'),
  helpLine('open <file>', 'open a file in its app (pdf → Pages/Keynote, links.html → Safari, skills.freeform → Skills)'),
  helpLine('cat <file|url>', 'print a file, or fetch a URL through r.jina.ai'),
  helpLine('neofetch', 'system info (a.k.a. screenfetch)'),
  helpLine('htop', 'process viewer (100% real)'),
  helpLine('nano <file>', 'the text editor (allegedly)'),
  helpLine('jargon', 'random finance / programmer jargon'),
  helpLine('whoami, date, clear, sudo, exit', 'the usual suspects'),
];

/** Whole, solid apple (no bite) — the Shmack OS logo. */
const LOGO = [
  '              .#.',
  '             ###',
  '          ########',
  '        ############',
  '      ################',
  '     ##################',
  '    ####################',
  '    ####################',
  '    ####################',
  '     ##################',
  '      ################',
  '        ############',
  '          ########',
  '            ####',
];

/** Per-line gradient (leaf green → ripe red) so the logo is properly colourful. */
const LOGO_COLORS = [
  'text-amber-600',
  'text-green-400',
  'text-lime-400',
  'text-lime-300',
  'text-yellow-400',
  'text-yellow-500',
  'text-amber-400',
  'text-orange-400',
  'text-orange-500',
  'text-red-400',
  'text-red-500',
  'text-rose-500',
  'text-red-500',
  'text-red-600',
];

const NEO_INFO: Seg[][] = [
  line('simon@shmackbook', 'font-semibold text-emerald-400'),
  line('---------------', 'text-emerald-400'),
  kv('OS', 'Shmack OS 67 “Sun Tzu” ARM6or7 (495 BCE, Art of War edition)'),
  kv('Host', 'ShmackBook Bro'),
  kv('Kernel', '6.7.0-commandcode-generic'),
  kv('Uptime', `${ageSince(2004, 6, 26)} (since 26. 06. 2004)`),
  kv('Packages', '9 milestones, 47 skills, 3 cities'),
  kv('Shell', 'zsh 5.9'),
  kv('Resolution', '5120x2880 @ 60Hz (Retina 5K Okularis)'),
  kv('DE', 'Aqua (Shmack edition)'),
  kv('WM', 'Quartz Compositor'),
  kv('Terminal', 'shmack-term 6.7'),
  kvSegs(
    'CPU',
    seg('SmoothBrain Silicon ', 'text-zinc-300'),
    seg('M∞', 'text-[1.15em] font-bold text-emerald-300'),
    seg(' @ 6.9GHz', 'text-zinc-300'),
  ),
  kv('GPU', '8x AI Training GPUs — H200 cluster, obviously'),
  kv('Memory', '5 KB / 16 TiB (floppy disk rack)'),
  kv('WiFi', 'WiFi 6.7 — “idk_pass” (signal: exquisite)'),
  kv('Sharpe', '4.20 (do not fact-check this)'),
  kv('Locale', 'en_US.UTF-8 · cs_CZ.UTF-8 · zh_CN.UTF-8'),
  kv('Battery', '180% — never dips, like the portfolio'),
];

/** Logo on the left, stats on the right — like the real thing. */
export const NEOFETCH: Seg[][] = (() => {
  const artWidth = Math.max(...LOGO.map((artLine) => artLine.length));
  const rows = Math.max(LOGO.length, NEO_INFO.length);
  const out: Seg[][] = [];
  for (let i = 0; i < rows; i += 1) {
    const art = `${(LOGO[i] ?? '').padEnd(artWidth)}   `;
    out.push([seg(art, LOGO_COLORS[i % LOGO_COLORS.length]), ...(NEO_INFO[i] ?? [])]);
  }
  return out;
})();

export const HTOP: Seg[][] = [
  line('  0[||||||||||||||||||||||||||||||98.7%]  1[|||||||||||||||||||      62.0%]    Tasks: 69, 420 thr; 1 running', 'text-zinc-300'),
  line('  2[||||||||||||||||||||||||||||||||||100%]  3[|||||||||               28.4%]    Load average: 4.20 6.90 6.67', 'text-zinc-300'),
  line('  Mem[||||||||||||||||||          42.0G/128G]                                    Uptime: 20 years, 4 months', 'text-zinc-300'),
  line('  Swp[                              0K/16.0G]                                    Sort: %CPU (descending)', 'text-zinc-300'),
  line('', ''),
  line('    PID USER      PRI  NI  VIRT   RES  S  CPU%  MEM%   TIME+    Command', 'text-emerald-400 font-semibold'),
  line('   1337 simon      20   0 42.0g 13.4g  S 420.0  10.5  69:06.90  python train_alpha.py --universe --leverage max', 'text-zinc-300'),
  line('    404 simon      20   0  8.4g  2.1g  S 100.0   1.6  67:00.00  dcf_model --terminal-value infinite', 'text-zinc-300'),
  line('   6161 simon      20   0  9.9g  3.3g  R  99.9   2.5  66:66.66  regrets --fix --compound', 'text-zinc-300'),
  line('     69 simon      20   0  6.9g  1.3g  S  69.0   1.0  42:00.00  coffee --infinite --no-sleep', 'text-zinc-300'),
  line('   3141 simon      20   0  3.1g  0.9g  S  31.4   0.7  31:41.59  mandarin --hsk4 --immersive', 'text-zinc-300'),
  line('   9001 simon      20  19  2.0g  0.5g  S   0.1   0.4   0:04.20  procrastination --daemon (nice +19)', 'text-zinc-600'),
  line('      1 root       20   0  0.1g  0.0g  S   0.0   0.1   0:00.00  shmack-init', 'text-zinc-500'),
  line('', ''),
  line('F1 Help  F2 Setup  F3 Search  F4 Filter  F5 Tree  F10 Quit        (all keys enthusiastically decorative)', 'text-zinc-500'),
];

export const NANO: Seg[][] = [
  line('  GNU nano 7.2                ~/journey/education.log', 'text-zinc-200'),
  line('', ''),
  line('  [ this exhibit is read-only — you can look, not touch ]', 'text-zinc-500'),
  line('', ''),
  line('  Tip: press Ctrl+X to exit, or just type `open` on a file.', 'text-zinc-400'),
  line('', ''),
  line('^G Help       ^O Write Out  ^W Where Is   ^K Cut   ^X Exit', 'text-zinc-400'),
  line('', ''),
  line('nano: 0 bytes written · 0 regrets · 100% vibes', 'text-emerald-400'),
];

export const JARGON: string[] = [
  '“It’s not leverage, it’s conviction with a multiplier.”',
  '“The market can stay irrational longer than your liquidity can stay solvent.”',
  '“We don’t do forecasts — we do scenarios with confidence intervals.”',
  '“This isn’t a bug, it’s an undocumented feature with alpha.”',
  '“I’ll refactor it later” — a promise as durable as a 0DTE option.',
  '“Free cash flow is the only opinion that compounds.”',
  '“Premature optimisation is the root of all evil, said the man who timed the market.”',
  '“The discount rate is a personality trait.”',
  '“Ship it. The users are the unit tests.”',
  '“Beta is for people who haven’t met a good thesis.”',
  '“Cash flow statement > income statement > vibes (in that order).”',
  '“Two kinds of analysts: those who model risk, and those who model.”',
];
