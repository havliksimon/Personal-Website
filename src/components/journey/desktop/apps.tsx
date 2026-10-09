import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import {
  ChevronLeft, ChevronRight, RefreshCw, Lock, Plus, X, FileText,
  Presentation, Folder, Send, CheckCircle, ExternalLink, Search,
  Calculator, Code, Brain, TrendingUp, BookOpen, Landmark, Globe, Palette,
  Languages, Info, Image as ImageIcon, Sun, Moon, Monitor, Gamepad2, Trash2,
  AppWindow, FileArchive, Apple, type LucideIcon,
} from 'lucide-react';
import skillsData from '../../../data/skills.json';
import { WALLPAPERS, CONTACT_EMAIL, FORMSPREE_ENDPOINT, docs, projects, type DesktopDoc } from './data';
import { SCRIPT, SEG_STARTS, TOTAL_CHARS } from './terminal';

const MONO = "'SF Mono', Menlo, Monaco, 'JetBrains Mono', monospace";

/* ----------------------------- Terminal ----------------------------- */

export const TerminalBody = ({ count }: { count: number }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const done = count >= TOTAL_CHARS;

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [count]);

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
  typed.push(
    <span
      key="caret"
      className="terminal-caret ml-0.5 inline-block h-[15px] w-[8px] translate-y-[2px] bg-emerald-300 align-middle shadow-[0_0_10px_rgba(110,231,183,0.9)]"
    />
  );

  return (
    <div
      ref={scrollRef}
      className="h-full overflow-hidden p-5 text-[12.5px] leading-[1.75]"
      style={{ fontFamily: MONO }}
    >
      <div className="whitespace-pre-wrap break-words text-zinc-200">{typed}</div>
      {done && <span className="sr-only">Education journey printed.</span>}
    </div>
  );
};

/* ------------------------------- Mail ------------------------------- */

export const MailApp = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSent(true);
        setForm({ name: '', email: '', subject: '', message: '' });
      } else {
        alert('Something went wrong. Please try again.');
      }
    } catch {
      alert('Something went wrong. Please try again.');
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
      <div className="flex items-center justify-between border-t border-gray-100 px-3 py-2">
        <span className="text-[11px] text-gray-400">Sent via havliksimon.eu</span>
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
        className="min-h-0 flex-1 border-0 bg-white"
      />
    </div>
  );
};

/* ------------------------------ Finder ------------------------------ */

export const FinderApp = ({ onOpen }: { onOpen: (doc: DesktopDoc) => void }) => {
  const [section, setSection] = useState<'analysis' | 'presentation'>('analysis');
  const items = docs.filter((doc) => doc.kind === section);

  return (
    <div className="flex h-full bg-white">
      <div className="w-44 shrink-0 border-r border-gray-100 bg-gray-50/70 p-3 text-[12px] text-gray-600">
        <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400">Favourites</p>
        {[
          { key: 'analysis' as const, icon: <FileText className="h-3.5 w-3.5 text-blue-500" />, label: 'Analyses' },
          { key: 'presentation' as const, icon: <Presentation className="h-3.5 w-3.5 text-purple-500" />, label: 'Presentations' },
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
          {section === 'analysis' ? 'Analyses' : 'Presentations'}
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
              ) : (
                <Presentation className="h-9 w-9 text-purple-500" strokeWidth={1.3} />
              )}
              <span className="line-clamp-2 text-[11px] leading-tight text-gray-700">{doc.title}</span>
              <span className="text-[10px] text-gray-400">{doc.pages} pages · {doc.date}</span>
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
    <iframe src={doc.pdfUrl} title={doc.title} className="min-h-0 flex-1 border-0 bg-white" />
  </div>
);

/* ------------------------------- Siri ------------------------------- */

const SIRI_QUESTION = 'Should I hire Simon?';
const SIRI_ANSWER =
  "Yes. Definitely. You should. 😈 He knows you've been here… he knows. Hire him — or else xd";

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
export type SettingsPane = 'appearance' | 'wallpaper' | 'about';

const APPEARANCES: { key: Theme; label: string; icon: LucideIcon }[] = [
  { key: 'light', label: 'Light', icon: Sun },
  { key: 'dark', label: 'Dark', icon: Moon },
  { key: 'auto', label: 'Auto', icon: Monitor },
];

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

        {pane === 'about' && (
          <div className="flex flex-col items-center pt-4 text-center">
            <Apple className="h-12 w-12 text-gray-800" fill="currentColor" />
            <h3 className="mt-3 text-xl font-semibold">Shmack OS</h3>
            <p className="mb-6 text-[12px] text-gray-500">Version 14.0 “Sonoma-ish”</p>
            <dl className="w-full max-w-xs space-y-1 text-[12px]">
              {[
                ['Chip', 'CommandCode Silicon'],
                ['Memory', '16 GB'],
                ['Startup disk', 'Macintosh HD'],
                ['Display', 'Retina 5K'],
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
    <iframe src="https://mcraft.fun/" title="Minecraft" allowFullScreen className="min-h-0 flex-1 border-0 bg-black" />
  </div>
);
