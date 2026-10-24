import { useEffect, useRef, useState, type CSSProperties, type FormEvent, type ReactNode } from 'react';
import {
  ChevronLeft, ChevronRight, RefreshCw, Lock, Plus, X, FileText,
  Presentation, Folder, Send, CheckCircle, ExternalLink, Search,
  Calculator, Code, Brain, TrendingUp, BookOpen, Landmark, Globe, Palette,
  Languages, Info, Image as ImageIcon, Sun, Moon, Monitor, Gamepad2, Trash2,
  AppWindow, FileArchive, Apple, Star, type LucideIcon,
} from 'lucide-react';
import skillsData from '../../../data/skills.json';
import PdfFrame from '../../PdfFrame';
import { WALLPAPERS, CONTACT_EMAIL, FORMSPREE_ENDPOINT, docs, projects, type DesktopDoc } from './data';
import {
  SCRIPT, SEG_STARTS, TOTAL_CHARS, seg, line, getDir, joinPath, ROOT,
  HELP, NEOFETCH, NEO_INFO, HTOP, NANO, JARGON, EDUCATION_LOG, type Seg,
} from './terminal';
import { LUCY_ROWS } from './lucyArt';

const decodeRow = (row: string) => {
  const runs: { n: number; fg: string; bg: string }[] = [];
  for (let i = 0; i + 12 <= row.length; i += 12) {
    const fg = `#${row.slice(i, i + 6)}`;
    const bg = `#${row.slice(i + 6, i + 12)}`;
    const last = runs[runs.length - 1];
    if (last && last.fg === fg && last.bg === bg) last.n += 1;
    else runs.push({ n: 1, fg, bg });
  }
  return runs;
};

const LUCY_RUNS = LUCY_ROWS.map(decodeRow);

const LucyNeofetch = () => (
  <div className="flex flex-col gap-4 sm:flex-row">
    <div
      className="shrink-0 self-start"
      aria-hidden="true"
      style={{ '--lucy-cell': 'clamp(4px, 0.5vw, 6px)' } as CSSProperties}
    >
      {LUCY_RUNS.map((runs, y) => (
        <div key={y} className="flex">
          {runs.map((r, i) => (
            <span
              key={i}
              style={{
                width: `calc(var(--lucy-cell) * ${r.n})`,
                height: 'calc(var(--lucy-cell) * 2)',
                backgroundImage: `linear-gradient(to bottom, ${r.bg} 0 50%, ${r.fg} 50% 100%)`,
              }}
            />
          ))}
        </div>
      ))}
    </div>
    <div className="min-w-0 flex-1 whitespace-pre-wrap break-words">
      {NEO_INFO.map((ln, i) => (
        <div key={i}>
          {ln.map((s, j) => (
            <span key={j} className={s.cls}>
              {s.text}
            </span>
          ))}
        </div>
      ))}
    </div>
  </div>
);

const MONO = "'SF Mono', Menlo, Monaco, 'JetBrains Mono', monospace";

/* ----------------------------- Terminal ----------------------------- */

export interface TerminalActions {
  openDoc: (docId: number) => void;
  openSafari: () => void;
  openSkills: () => void;
  openFinder: () => void;
  openSettings: () => void;
  openMinecraft: () => void;
  openTrash: () => void;
  openMail: () => void;
  openSiri: () => void;
}

export const TerminalApp = ({ count, actions }: { count: number; actions: TerminalActions }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [cwd, setCwd] = useState('~');
  const [lines, setLines] = useState<Seg[][]>([]);
  const [input, setInput] = useState('');
  const [cleared, setCleared] = useState(false);
  const [busy, setBusy] = useState(false);

  const introDone = count >= TOTAL_CHARS;

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [count, lines, busy]);

  useEffect(() => {
    if (introDone) inputRef.current?.focus();
  }, [introDone]);

  const append = (out: Seg[][]) => setLines((prev) => [...prev, ...out]);

  const runCommand = async (raw: string) => {
    const trimmed = raw.trim();
    const [cmd, ...rest] = trimmed.split(/\s+/);
    const arg = rest.join(' ');
    const cur = getDir(cwd) ?? ROOT;

    switch (cmd) {
      case '':
        return;
      case 'help':
        return append(HELP);
      case 'pwd':
        return append([line(cwd, 'text-zinc-300')]);
      case 'ls':
      case 'lsd': {
        const out: Seg[][] = [];
        if (cmd === 'lsd') {
          out.push(line(`${cur.dirs.length} dirs · ${cur.files.length} files · 0 unproductivity`, 'text-zinc-500'));
        }
        cur.dirs.forEach((dir) => out.push([seg(`${dir.name}/`, 'font-semibold text-sky-400')]));
        cur.files.forEach((file) =>
          out.push([
            seg(
              file.name,
              file.kind === 'pdf'
                ? 'text-amber-300'
                : file.kind === 'html'
                  ? 'text-cyan-300'
                  : file.kind === 'skills'
                    ? 'text-fuchsia-300'
                    : file.kind === 'cv'
                      ? 'text-emerald-300'
                      : 'text-zinc-300'
            ),
          ])
        );
        return append(out.length ? out : [line('(empty)', 'text-zinc-500')]);
      }
      case 'cd': {
        if (!arg || arg === '~') {
          setCwd('~');
          return;
        }
        const target = joinPath(cwd, arg.replace(/\/$/, ''));
        if (getDir(target)) {
          setCwd(target);
          return;
        }
        return append([line(`cd: no such directory: ${arg}`, 'text-red-400')]);
      }
      case 'cat': {
        if (!arg) return append([line('usage: cat <file|url>', 'text-zinc-400')]);
        if (/^https?:\/\//i.test(arg)) {
          setBusy(true);
          append([line(`fetching ${arg} via r.jina.ai …`, 'text-zinc-500')]);
          try {
            const res = await fetch(`https://r.jina.ai/${arg}`);
            const text = await res.text();
            const out = text
              .split('\n')
              .slice(0, 40)
              .map((l) => line(l.length ? l : ' ', 'text-zinc-300'));
            append(out.length ? out : [line('(empty response)', 'text-zinc-500')]);
          } catch {
            append([line('cat: fetch failed (network or r.jina.ai unavailable)', 'text-red-400')]);
          }
          setBusy(false);
          return;
        }
        const file = cur.files.find((f) => f.name === arg);
        if (!file) return append([line(`cat: ${arg}: No such file or directory`, 'text-red-400')]);
        if (file.kind === 'log') return append(EDUCATION_LOG.split('\n').map((l) => line(l, 'text-zinc-300')));
        if (file.content) return append(file.content.split('\n').map((l) => line(l, 'text-zinc-300')));
        return append([line(`cat: ${arg}: binary file (try \`open ${arg}\`)`, 'text-zinc-500')]);
      }
      case 'open': {
        if (!arg) return append([line('usage: open <file>', 'text-zinc-400')]);
        const file = cur.files.find((f) => f.name === arg);
        if (!file) return append([line(`open: ${arg}: No such file`, 'text-red-400')]);
        if ((file.kind === 'pdf' || file.kind === 'cv') && file.docId !== undefined) {
          actions.openDoc(file.docId);
          const docKind = docs.find((d) => d.id === file.docId)?.kind;
          const opener = file.kind === 'cv' ? 'Figma' : docKind === 'presentation' ? 'Keynote' : 'Pages';
          return append([line(`Opening ${file.name} in ${opener}…`, 'text-zinc-400')]);
        }
        if (file.kind === 'html') {
          actions.openSafari();
          return append([line('Opening links.html in Safari…', 'text-zinc-400')]);
        }
        if (file.kind === 'skills') {
          actions.openSkills();
          return append([line('Opening skills.freeform in Skills…', 'text-zinc-400')]);
        }
        return append([line(`open: cannot open ${arg} (try \`cat\`)`, 'text-zinc-500')]);
      }
      case 'neofetch':
      case 'fastfetch':
      case 'screenfetch':
        return append(NEOFETCH);
      case 'htop':
        return append(HTOP);
      case 'nano':
        return append(NANO);
      case 'jargon':
        return append([line(JARGON[Math.floor(Math.random() * JARGON.length)], 'text-amber-300')]);
      case 'whoami':
        return append([
          [
            seg('simon', 'font-semibold text-emerald-300'),
            seg('  — economics student, equity analyst, and (apparently) OS designer.', 'text-zinc-400'),
          ],
        ]);
      case 'date':
        return append([line(new Date().toString(), 'text-zinc-300')]);
      case 'clear':
        setLines([]);
        setCleared(true);
        return;
      case 'sudo':
        return append([line('Nice try. Root access denied — but full marks for initiative.', 'text-red-400')]);
      case 'exit':
      case 'logout':
        return append([line('logout: there is no escape from this desktop.', 'text-zinc-400')]);
      default:
        return append([
          line(`zsh: command not found: ${cmd}`, 'text-red-400'),
          line("type 'help' for the good stuff.", 'text-zinc-500'),
        ]);
    }
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    const raw = input;
    setInput('');
    const echo: Seg[] = [
      seg('simon@shmackbook ', 'font-semibold text-emerald-400'),
      seg(`${cwd} `, 'font-semibold text-sky-400'),
      seg('% ', 'text-zinc-400'),
      seg(raw, 'text-zinc-100'),
    ];
    append([echo]);
    await runCommand(raw);
  };

  let remaining = count;
  const newest = count - 1;
  const typed: ReactNode[] = [];
  SCRIPT.forEach((s, i) => {
    if (remaining <= 0) return;
    const take = Math.min(s.text.length, remaining);
    const local = newest - SEG_STARTS[i];
    const chunk = s.text.slice(0, take);
    if (local >= 0 && local < take) {
      typed.push(
        <span key={`${i}-a`} className={s.cls}>
          {chunk.slice(0, local)}
        </span>
      );
      typed.push(
        <span key={`print-${count}`} className="terminal-print">
          {chunk[local]}
        </span>
      );
      typed.push(
        <span key={`${i}-b`} className={s.cls}>
          {chunk.slice(local + 1)}
        </span>
      );
    } else {
      typed.push(
        <span key={i} className={s.cls}>
          {chunk}
        </span>
      );
    }
    remaining -= take;
  });

  return (
    <div
      ref={scrollRef}
      className="h-full cursor-text overflow-y-auto p-3 text-[11px] leading-[1.6] sm:p-5 sm:text-[12.5px] sm:leading-[1.75]"
      style={{ fontFamily: MONO }}
      onClick={() => inputRef.current?.focus()}
    >
      {!cleared && (
        <div className="whitespace-pre-wrap break-words text-zinc-200">
          {typed}
          {!introDone && (
            <span className="terminal-caret ml-0.5 inline-block h-[15px] w-[8px] translate-y-[2px] bg-emerald-300 align-middle shadow-[0_0_10px_rgba(110,231,183,0.9)]" />
          )}
        </div>
      )}

      {lines.map((ln, i) => {
        const [first] = ln;
        if (first?.cls.includes('shmack-neofetch')) {
          return <LucyNeofetch key={i} />;
        }
        return (
          <div key={i} className="whitespace-pre-wrap break-words">
            {ln.map((s, j) => (
              <span key={j} className={s.cls}>
                {s.text}
              </span>
            ))}
          </div>
        );
      })}

      {introDone && lines.length === 0 && (
        <div className="text-zinc-500">
          type <span className="text-cyan-300">help</span> to see what this shell can do — or try{' '}
          <span className="text-cyan-300">neofetch</span>.
        </div>
      )}

      {introDone && (
        <form onSubmit={submit} className="flex items-baseline gap-1.5">
          <span className="font-semibold text-emerald-400">simon@shmackbook</span>
          <span className="font-semibold text-sky-400">{cwd}</span>
          <span className="text-zinc-400">%</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
            autoComplete="off"
            aria-label="Terminal input"
            className="flex-1 bg-transparent text-zinc-100 caret-emerald-300 outline-none"
          />
        </form>
      )}
    </div>
  );
};

/* ------------------------------- Mail ------------------------------- */

export const MailApp = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError(null);
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSent(true);
        setForm({ name: '', email: '', subject: '', message: '' });
      } else {
        let detail = `HTTP ${res.status}`;
        try {
          const data = await res.json();
          if (data?.errors?.length) detail = data.errors.map((x: { message: string }) => x.message).join(', ');
        } catch {
          /* keep status */
        }
        setError(`Mail service rejected that (${detail}).`);
      }
    } catch {
      setError('Could not reach formspree.io — a browser blocker may be blocking it.');
    }
    setSending(false);
  };

  if (sent) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 bg-white p-6 text-center">
        <CheckCircle className="h-12 w-12 text-green-500" />
        <h4 className="text-lg font-semibold text-gray-900">Message sent!</h4>
        <p className="text-sm text-gray-500">I&apos;ll get back to you soon.</p>
      </div>
    );
  }

  const inputCls =
    'w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100';

  return (
    <form onSubmit={submit} className="flex h-full flex-col bg-white">
      <div className="flex items-center gap-2 border-b border-gray-100 px-3 py-2 text-[13px]">
        <span className="w-14 text-gray-400">To:</span>
        <span className="rounded bg-gray-100 px-2 py-0.5 font-medium text-gray-700">{CONTACT_EMAIL}</span>
      </div>
      <div className="grid grid-cols-2 gap-2 border-b border-gray-100 p-3">
        <input
          className={inputCls}
          placeholder="Your name"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className={inputCls}
          type="email"
          placeholder="Your email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
      </div>
      <div className="border-b border-gray-100 p-3">
        <input
          className={inputCls}
          placeholder="Subject"
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
        />
      </div>
      <textarea
        className="flex-1 resize-none border-0 p-3 text-sm text-gray-800 outline-none"
        placeholder="Write your message…"
        required
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
      />
      {error && (
        <div className="border-t border-red-100 bg-red-50 px-3 py-2 text-[12px] text-red-700">
          {error}{' '}
          <a
            className="font-medium underline"
            href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
              form.subject || 'Website enquiry'
            )}&body=${encodeURIComponent(form.message)}`}
          >
            Send by email instead
          </a>
        </div>
      )}
      <div className="flex items-center justify-between border-t border-gray-100 px-3 py-2">
        <span className="text-[11px] text-gray-400">Sent via simonhavlik.com</span>
        <button
          type="submit"
          disabled={sending}
          className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
        >
          {sending ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          ) : (
            <>
              <Send className="h-3.5 w-3.5" />
              Send
            </>
          )}
        </button>
      </div>
    </form>
  );
};

/* ------------------------------ Safari ------------------------------ */

interface BrowserTab {
  id: number;
  title: string;
  url: string;
}

const SEARCH_HOME = 'https://search.marginalia.nu/';
const SEARCH_QUERY = (value: string) =>
  `https://search.marginalia.nu/search?query=${encodeURIComponent(value)}`;

const hostOf = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
};

const initialTabs: BrowserTab[] = [
  { id: 1, title: projects[0].shortTitle, url: projects[0].previewUrl },
  { id: 2, title: projects[1].shortTitle, url: projects[1].previewUrl },
  { id: 3, title: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Main_Page' },
  { id: 4, title: 'Search', url: SEARCH_HOME },
];

export const SafariApp = ({ initialTabTitle }: { initialTabTitle?: string }) => {
  const [tabs, setTabs] = useState<BrowserTab[]>(initialTabs);
  const [activeId, setActiveId] = useState(
    () => initialTabs.find((tab) => tab.title === initialTabTitle)?.id ?? 1
  );
  const [reloadKey, setReloadKey] = useState(0);

  const active = tabs.find((t) => t.id === activeId) ?? tabs[0];

  const navigate = (raw: string) => {
    const value = raw.trim();
    if (!value) return;
    const looksUrl = /^https?:\/\//i.test(value) || /^[\w-]+(\.[\w-]+)+(\/.*)?$/.test(value);
    const url = looksUrl
      ? /^https?:\/\//i.test(value)
        ? value
        : `https://${value}`
      : SEARCH_QUERY(value);
    setTabs((prev) =>
      prev.map((t) =>
        t.id === activeId
          ? { ...t, url, title: url.includes('marginalia.nu/search') ? `Search: ${value}` : hostOf(url) }
          : t
      )
    );
    setReloadKey((k) => k + 1);
  };

  const newTab = () => {
    const id = Date.now();
    setTabs((prev) => [...prev, { id, title: 'Search', url: SEARCH_HOME }]);
    setActiveId(id);
    setReloadKey((k) => k + 1);
  };

  const closeTab = (id: number) => {
    setTabs((prev) => {
      if (prev.length === 1) return prev;
      const next = prev.filter((t) => t.id !== id);
      if (id === activeId) setActiveId(next[0].id);
      return next;
    });
  };

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Tabs */}
      <div className="flex items-end gap-1 border-b border-gray-200 bg-gray-100 px-2 pt-1.5">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`group flex max-w-[14rem] items-center gap-1.5 rounded-t-md px-3 py-1.5 text-[12px] ${
              tab.id === activeId ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:bg-white/60'
            }`}
          >
            <button
              type="button"
              onClick={() => {
                setActiveId(tab.id);
                setReloadKey((k) => k + 1);
              }}
              className="flex min-w-0 items-center gap-1.5"
            >
              <span className="h-3 w-3 shrink-0 rounded-sm bg-gradient-to-br from-sky-400 to-blue-600" />
              <span className="truncate">{tab.title}</span>
            </button>
            <button
              type="button"
              onClick={() => closeTab(tab.id)}
              className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
              aria-label="Close tab"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={newTab}
          className="mb-1 ml-1 rounded p-1 text-gray-400 hover:bg-white/60"
          aria-label="New tab"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Address bar */}
      <div className="flex items-center gap-2 border-b border-gray-200 bg-white px-3 py-2">
        <div className="flex items-center gap-1 text-gray-400">
          <ChevronLeft className="h-4 w-4" />
          <ChevronRight className="h-4 w-4 opacity-40" />
        </div>
        <button
          type="button"
          onClick={() => setReloadKey((k) => k + 1)}
          className="text-gray-500 hover:text-gray-800"
          aria-label="Reload"
        >
          <RefreshCw className="h-3.5 w-3.5" />
        </button>
        <form
          className="flex flex-1 items-center justify-center gap-1.5 rounded-md bg-gray-100 px-2 py-1"
          onSubmit={(e) => {
            e.preventDefault();
            const value = new FormData(e.currentTarget).get('q');
            navigate(String(value ?? ''));
          }}
        >
          <Lock className="h-3 w-3 shrink-0 text-gray-400" />
          <input
            key={`${active.id}-${active.url}`}
            name="q"
            defaultValue={active.url}
            placeholder="Search or enter website"
            className="w-full bg-transparent text-center text-[12px] text-gray-700 outline-none"
          />
        </form>
        <a
          href={active.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 hover:text-gray-800"
          aria-label="Open in new tab"
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>

      <iframe
        key={`${active.id}-${active.url}-${reloadKey}`}
        src={active.url}
        title={active.title}
        allow="fullscreen; autoplay; encrypted-media"
        referrerPolicy="no-referrer-when-downgrade"
        className="min-h-0 w-full flex-1 border-0 bg-white"
      />
    </div>
  );
};

/* ------------------------------ Finder ------------------------------ */

export const FinderApp = ({ onOpen }: { onOpen: (doc: DesktopDoc) => void }) => {
  const [section, setSection] = useState<'documents' | 'analysis' | 'presentation' | 'cv'>('documents');
  const items = section === 'documents' ? docs : docs.filter((doc) => doc.kind === section);

  return (
    <div className="flex h-full bg-white">
      <div className="w-44 shrink-0 border-r border-gray-100 bg-gray-50/70 p-3 text-[12px] text-gray-600">
        <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400">Favourites</p>
        {[
          { key: 'documents' as const, icon: <Folder className="h-3.5 w-3.5 text-gray-500" />, label: 'Documents' },
          { key: 'analysis' as const, icon: <FileText className="h-3.5 w-3.5 text-blue-500" />, label: 'Analyses' },
          { key: 'presentation' as const, icon: <Presentation className="h-3.5 w-3.5 text-purple-500" />, label: 'Presentations' },
          { key: 'cv' as const, icon: <FileText className="h-3.5 w-3.5 text-emerald-500" />, label: 'CV' },
        ].map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setSection(item.key)}
            className={`flex w-full items-center gap-2 rounded-md px-1.5 py-1 text-left ${
              section === item.key ? 'bg-blue-500/10 text-blue-700' : 'hover:bg-black/5'
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>
      <div className="flex flex-1 flex-col">
        <div className="flex items-center gap-2 border-b border-gray-100 px-3 py-1.5 text-[11px] text-gray-400">
          <Folder className="h-3.5 w-3.5" />
          {section === 'documents'
            ? 'Documents'
            : section === 'analysis'
              ? 'Analyses'
              : section === 'presentation'
                ? 'Presentations'
                : 'CV'}
          <span className="ml-auto">{items.length} items</span>
        </div>
        <div className="grid flex-1 grid-cols-3 content-start gap-4 overflow-auto p-4">
          {items.map((doc) => (
            <button
              key={doc.id}
              type="button"
              onDoubleClick={() => onOpen(doc)}
              onClick={() => onOpen(doc)}
              className="flex flex-col items-center gap-1.5 rounded-lg p-2 text-center transition-colors hover:bg-blue-50"
            >
              {doc.kind === 'analysis' ? (
                <FileText className="h-9 w-9 text-blue-500" strokeWidth={1.3} />
              ) : doc.kind === 'cv' ? (
                <FileText className="h-9 w-9 text-emerald-500" strokeWidth={1.3} />
              ) : (
                <Presentation className="h-9 w-9 text-purple-500" strokeWidth={1.3} />
              )}
              <span className="line-clamp-2 text-[11px] leading-tight text-gray-700">{doc.title}</span>
              <span className="text-[10px] text-gray-400">
                {section === 'documents'
                  ? `${doc.kind === 'cv' ? 'CV' : doc.kind === 'presentation' ? 'Deck' : 'Write-up'} · ${doc.pages}p`
                  : `${doc.pages} pages · ${doc.date}`}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ------------------------------ Viewer ------------------------------ */

export const ViewerApp = ({ doc }: { doc: DesktopDoc }) => (
  <div className="flex h-full flex-col bg-gray-100">
    <div className="flex items-center gap-2 border-b border-gray-200 bg-white px-3 py-1.5 text-[11px] text-gray-500">
      <span className="font-medium text-gray-700">{doc.subtitle}</span>
      <span className="ml-auto">{doc.pages} pages</span>
      <a
        href={doc.pdfUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 text-blue-600 hover:underline"
      >
        <ExternalLink className="h-3 w-3" />
        Open
      </a>
    </div>
    <div className="min-h-0 flex-1">
      <PdfFrame
        src={doc.pdfUrl}
        title={doc.title}
        subtitle={doc.subtitle}
        pages={doc.pages}
      />
    </div>
  </div>
);

/* ------------------------------- Siri ------------------------------- */

const SIRI_QUESTION = 'Should I hire Simon?';
const SIRI_ANSWER =
  "Yes. Definitely. You should. 😈 He knows you've been here… he knows. Hire him — or else 💀";

export const SiriApp = () => {
  const [phase, setPhase] = useState<'question' | 'thinking' | 'answer'>('question');
  const [qLen, setQLen] = useState(0);
  const [aLen, setALen] = useState(0);

  useEffect(() => {
    const timers: number[] = [];
    let t = 300;
    for (let i = 1; i <= SIRI_QUESTION.length; i += 1) {
      t += 45;
      timers.push(window.setTimeout(() => setQLen(i), t));
    }
    t += 700;
    timers.push(window.setTimeout(() => setPhase('thinking'), t));
    t += 1000;
    timers.push(window.setTimeout(() => setPhase('answer'), t));
    for (let i = 1; i <= SIRI_ANSWER.length; i += 1) {
      t += 24;
      timers.push(window.setTimeout(() => setALen(i), t));
    }
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, []);

  return (
    <div className="relative flex h-full flex-col items-center justify-center gap-7 overflow-hidden bg-[#0b0a14] px-6 text-center">
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-600/30 blur-[90px]" />
        <div className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-500/25 blur-[80px]" />
      </div>

      <div className="siri-orb relative h-28 w-28 rounded-full" />

      <div className="relative w-full max-w-md">
        <p className="text-[15px] font-medium text-white/70">
          “{SIRI_QUESTION.slice(0, qLen)}
          {phase === 'question' ? (
            <span className="terminal-caret ml-0.5 inline-block h-4 w-[3px] translate-y-0.5 bg-white/70 align-middle" />
          ) : (
            '”'
          )}
        </p>

        {phase === 'thinking' && (
          <div className="mt-5 flex items-center justify-center gap-1.5">
            <span className="h-2 w-2 animate-bounce rounded-full bg-white/70 [animation-delay:-0.2s]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-white/70" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-white/70 [animation-delay:0.2s]" />
          </div>
        )}

        {phase === 'answer' && (
          <p className="mt-5 text-xl font-semibold leading-snug text-white">
            {SIRI_ANSWER.slice(0, aLen)}
            <span className="terminal-caret ml-0.5 inline-block h-5 w-[3px] translate-y-1 bg-white/80 align-middle" />
          </p>
        )}
      </div>

      <p className="relative mt-1 font-mono text-[11px] uppercase tracking-[0.3em] text-white/30">Siri</p>
    </div>
  );
};

/* ------------------------------ Skills ------------------------------ */

const skillIcons: Record<string, LucideIcon> = {
  Calculator, Code, Brain, TrendingUp, BookOpen, Landmark, Globe, Palette, Languages,
};

const skillColors: Record<string, { badge: string; chip: string }> = {
  blue: { badge: 'bg-blue-50 text-blue-600', chip: 'bg-blue-50 text-blue-700' },
  cyan: { badge: 'bg-cyan-50 text-cyan-600', chip: 'bg-cyan-50 text-cyan-700' },
  purple: { badge: 'bg-purple-50 text-purple-600', chip: 'bg-purple-50 text-purple-700' },
  green: { badge: 'bg-green-50 text-green-600', chip: 'bg-green-50 text-green-700' },
  orange: { badge: 'bg-orange-50 text-orange-600', chip: 'bg-orange-50 text-orange-700' },
  emerald: { badge: 'bg-emerald-50 text-emerald-600', chip: 'bg-emerald-50 text-emerald-700' },
  red: { badge: 'bg-red-50 text-red-600', chip: 'bg-red-50 text-red-700' },
  pink: { badge: 'bg-pink-50 text-pink-600', chip: 'bg-pink-50 text-pink-700' },
  indigo: { badge: 'bg-indigo-50 text-indigo-600', chip: 'bg-indigo-50 text-indigo-700' },
};

interface SkillCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  skills: { name: string; context: string }[];
}

export const SkillsApp = () => {
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();

  const categories = (skillsData.categories as SkillCategory[])
    .map((category) => ({
      ...category,
      skills: category.skills.filter(
        (skill) => !q || `${skill.name} ${skill.context}`.toLowerCase().includes(q)
      ),
    }))
    .filter((category) => category.skills.length > 0);

  return (
    <div className="flex h-full flex-col bg-gray-50">
      <div className="flex items-center gap-2 border-b border-gray-200 bg-white px-3 py-2">
        <Search className="h-4 w-4 text-gray-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search skills…"
          className="w-full bg-transparent text-sm text-gray-700 outline-none"
        />
        <span className="shrink-0 text-[11px] text-gray-400">
          {(skillsData.categories as SkillCategory[]).reduce((n, c) => n + c.skills.length, 0)} total
        </span>
      </div>
      <div className="grid flex-1 grid-cols-2 content-start gap-3 overflow-auto p-4">
        {categories.map((category) => {
          const Icon = skillIcons[category.icon] ?? Code;
          const colors = skillColors[category.color] ?? skillColors.blue;
          return (
            <div key={category.id} className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
              <div className="mb-2 flex items-center gap-2">
                <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${colors.badge}`}>
                  <Icon className="h-4 w-4" />
                </span>
                <span className="text-sm font-semibold text-gray-900">{category.name}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {category.skills.map((skill) => (
                  <span
                    key={skill.name}
                    title={skill.context}
                    className={`rounded-full px-2 py-0.5 text-[11px] ${colors.chip}`}
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
        {categories.length === 0 && (
          <p className="col-span-2 p-6 text-center text-sm text-gray-400">No skills match “{query}”.</p>
        )}
      </div>
    </div>
  );
};

/* ----------------------------- Settings ----------------------------- */

export type Theme = 'light' | 'dark' | 'auto';
export type SettingsPane = 'appearance' | 'wallpaper' | 'rate' | 'about';

const APPEARANCES: { key: Theme; label: string; icon: LucideIcon }[] = [
  { key: 'light', label: 'Light', icon: Sun },
  { key: 'dark', label: 'Dark', icon: Moon },
  { key: 'auto', label: 'Auto', icon: Monitor },
];

const RatePane = () => {
  const [value, setValue] = useState('');
  const [suggested, setSuggested] = useState(10);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [message, setMessage] = useState<string | null>(null);
  const [hint, setHint] = useState<string | null>(null);

  const valid = Number(value) > 10;

  const dodge = () => {
    if (valid) return;
    setOffset({
      x: Math.round((Math.random() * 2 - 1) * 80),
      y: Math.round((Math.random() * 2 - 1) * 55),
    });
    setSuggested((s) => Math.min(99, s + 1));
    setHint('ehm ehm… we only accept scores above 10.');
    setMessage(null);
  };

  const submit = () => {
    if (!valid) {
      dodge();
      return;
    }
    setMessage(`Submitted ${value}/10 — generous. We'll take it.`);
    setHint(null);
  };

  return (
    <div className="relative">
      <h3 className="mb-1 text-[15px] font-semibold">Rate Shmack</h3>
      <p className="text-[12px] text-gray-500">
        How would you rate Shmack OS? Out of 10 — we accept anything above 10.
      </p>

      <div className="mt-6 flex items-center gap-4">
        <div
          className="flex h-20 w-20 items-center justify-center rounded-xl bg-zinc-900 text-4xl font-semibold text-emerald-300"
          style={{ perspective: '420px' }}
        >
          <span key={suggested} className="flip-in tabular-nums">
            {suggested}
          </span>
        </div>
        <div className="text-[12px] text-gray-500">
          <p>
            Current consensus: <span className="font-semibold text-gray-800">{suggested}/10</span>
          </p>
          <p className="italic">…and rising.</p>
        </div>
      </div>

      <div className="mt-8 flex items-center gap-3">
        <input
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setMessage(null);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              submit();
            }
          }}
          placeholder="Your score"
          inputMode="numeric"
          aria-label="Your score out of ten"
          className="w-32 rounded-lg border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        />
        <span className="text-[13px] text-gray-400">/ 10</span>
        <button
          type="button"
          onMouseEnter={dodge}
          onClick={submit}
          style={{ transform: valid ? 'translate(0, 0)' : `translate(${offset.x}px, ${offset.y}px)` }}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-transform duration-300 ease-out hover:bg-blue-700"
        >
          Submit rating
        </button>
      </div>

      {hint && <p className="mt-4 text-[12px] text-amber-600">{hint}</p>}
      {message && <p className="mt-4 text-[12px] text-emerald-600">{message}</p>}
    </div>
  );
};

export const SettingsApp = ({
  theme,
  onThemeChange,
  wallpaperIndex,
  onWallpaperChange,
  initialPane = 'appearance',
}: {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  wallpaperIndex: number;
  onWallpaperChange: (index: number) => void;
  initialPane?: SettingsPane;
}) => {
  const [pane, setPane] = useState<SettingsPane>(initialPane);
  const nav: { key: SettingsPane; label: string; icon: LucideIcon }[] = [
    { key: 'appearance', label: 'Appearance', icon: Palette },
    { key: 'wallpaper', label: 'Wallpaper', icon: ImageIcon },
    { key: 'rate', label: 'Rate Shmack', icon: Star },
    { key: 'about', label: 'About', icon: Info },
  ];

  return (
    <div className="flex h-full bg-[#f5f5f7] text-gray-800">
      <div className="w-48 shrink-0 border-r border-black/5 bg-white/60 p-2">
        <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400">Shmack OS</p>
        {nav.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => setPane(item.key)}
              className={`mb-0.5 flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-[12px] ${
                pane === item.key ? 'bg-blue-500 text-white' : 'hover:bg-black/5'
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="flex-1 overflow-auto p-5">
        {pane === 'appearance' && (
          <div>
            <h3 className="mb-1 text-[15px] font-semibold">Appearance</h3>
            <p className="mb-4 text-[12px] text-gray-500">Choose how Shmack OS looks on this desktop.</p>
            <div className="flex gap-3">
              {APPEARANCES.map((item) => {
                const Icon = item.icon;
                const selected = theme === item.key;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => onThemeChange(item.key)}
                    className={`flex flex-col items-center gap-2 rounded-xl border p-3 ${
                      selected ? 'border-blue-500 ring-2 ring-blue-500/30' : 'border-black/10 hover:border-black/20'
                    }`}
                  >
                    <span
                      className={`flex h-16 w-24 items-center justify-center rounded-md ${
                        item.key === 'light'
                          ? 'bg-white'
                          : item.key === 'dark'
                            ? 'bg-zinc-900'
                            : 'bg-gradient-to-r from-white to-zinc-900'
                      }`}
                    >
                      <Icon className={`h-5 w-5 ${item.key === 'light' ? 'text-gray-700' : 'text-white'}`} />
                    </span>
                    <span className="text-[12px] font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {pane === 'wallpaper' && (
          <div>
            <h3 className="mb-1 text-[15px] font-semibold">Wallpaper</h3>
            <p className="mb-4 text-[12px] text-gray-500">Pick a backdrop for the virtual desktop.</p>
            <div className="grid grid-cols-3 gap-3">
              {WALLPAPERS.map((wallpaper, i) => (
                <button
                  key={wallpaper.name}
                  type="button"
                  onClick={() => onWallpaperChange(i)}
                  className={`overflow-hidden rounded-xl border text-left ${
                    wallpaperIndex === i ? 'border-blue-500 ring-2 ring-blue-500/30' : 'border-black/10 hover:border-black/20'
                  }`}
                >
                  <span className="block h-20 w-full" style={{ background: wallpaper.css }} />
                  <span className="block px-2 py-1 text-[11px] font-medium">{wallpaper.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {pane === 'rate' && <RatePane />}

        {pane === 'about' && (
          <div className="flex flex-col items-center pt-4 text-center">
            <Apple className="h-12 w-12 text-gray-800" fill="currentColor" />
            <h3 className="mt-3 text-xl font-semibold">Shmack OS 67</h3>
            <p className="mb-6 text-[12px] text-gray-500">“Sun Tzu” — Art of War edition, 495 BCE</p>
            <dl className="w-full max-w-xs space-y-1 text-[12px]">
              <div className="flex items-center justify-between border-b border-black/5 py-1">
                <dt className="text-gray-500">Chip</dt>
                <dd className="font-medium text-gray-800">
                  SmoothBrain Silicon{' '}
                  <span className="text-[15px] font-bold text-gray-900">M∞</span>
                </dd>
              </div>
              {[
                ['Architecture', 'ARM6or7'],
                ['Memory', '5 KB / 16 TiB'],
                ['Startup disk', 'Floppy Disk Rack'],
                ['Display', 'Retina 5K Okularis'],
                ['Serial number', 'SHMACK-2026-SIMON'],
              ].map(([key, value]) => (
                <div key={key} className="flex justify-between border-b border-black/5 py-1">
                  <dt className="text-gray-500">{key}</dt>
                  <dd className="font-medium text-gray-800">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </div>
    </div>
  );
};

/* ------------------------------ Trash ------------------------------- */

const TRASH_ITEMS: { name: string; kind: string; date: string; icon: LucideIcon }[] = [
  { name: 'Procrastination.app', kind: 'Application', date: 'Today', icon: AppWindow },
  { name: 'Doomscrolling.log', kind: 'Log', date: 'Yesterday', icon: FileText },
  { name: 'Infinite_Scroll.js', kind: 'JavaScript', date: 'Yesterday', icon: Code },
  { name: 'Snooze_Button.dmg', kind: 'Disk Image', date: 'Monday', icon: FileArchive },
  { name: 'Unread_Newsletters.zip', kind: 'Archive', date: 'Last week', icon: FileArchive },
  { name: 'Duplicate_Screenshots', kind: 'Folder', date: 'Last week', icon: Folder },
  { name: 'One_More_Episode.mkv', kind: 'Video', date: 'Last week', icon: FileText },
];

export const TrashApp = () => (
  <div className="flex h-full flex-col bg-white">
    <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-3 py-2 text-[12px] text-gray-500">
      <span>
        Only <span className="font-medium text-gray-700">unproductivity</span> lives here — everything worth keeping is safe.
      </span>
      <span className="shrink-0 rounded-md bg-gray-100 px-2 py-0.5 text-gray-600">Empty</span>
    </div>
    <div className="grid grid-cols-[1fr_auto_auto] gap-x-6 border-b border-gray-100 px-3 py-1.5 text-[11px] uppercase tracking-wide text-gray-400">
      <span>Name</span>
      <span>Kind</span>
      <span>Date Added</span>
    </div>
    <div className="flex-1 overflow-auto">
      {TRASH_ITEMS.map((item, i) => {
        const Icon = item.icon;
        return (
          <div
            key={item.name}
            className={`grid grid-cols-[1fr_auto_auto] items-center gap-x-6 px-3 py-1.5 text-[12px] ${
              i % 2 ? 'bg-gray-50/70' : ''
            }`}
          >
            <span className="flex items-center gap-2 text-gray-700">
              <Icon className="h-3.5 w-3.5 text-gray-400" />
              {item.name}
            </span>
            <span className="text-gray-400">{item.kind}</span>
            <span className="text-gray-400">{item.date}</span>
          </div>
        );
      })}
    </div>
    <div className="flex items-center gap-2 border-t border-gray-100 px-3 py-2 text-[11px] text-gray-400">
      <Trash2 className="h-3.5 w-3.5" />
      {TRASH_ITEMS.length} items · 0 bytes of productivity lost
    </div>
  </div>
);

/* ----------------------------- Minecraft ---------------------------- */

export const MinecraftApp = () => (
  <div className="flex h-full flex-col bg-black">
    <div className="flex items-center gap-2 border-b border-white/10 bg-[#111] px-3 py-1.5 text-[11px] text-zinc-400">
      <Gamepad2 className="h-3.5 w-3.5 text-emerald-400" />
      <span className="text-zinc-300">mcraft.fun</span>
      <span className="ml-auto">web Minecraft · click to play</span>
      <a
        href="https://mcraft.fun/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 text-emerald-400 hover:underline"
      >
        <ExternalLink className="h-3 w-3" />
        Open
      </a>
    </div>
    <iframe
      src="https://mcraft.fun/"
      title="Minecraft"
      allow="fullscreen; autoplay; encrypted-media; gamepad"
      referrerPolicy="no-referrer-when-downgrade"
      className="min-h-0 w-full flex-1 border-0 bg-black"
    />
  </div>
);
