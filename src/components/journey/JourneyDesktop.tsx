import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import gsap from 'gsap';
import timelineData from '../../data/timeline.json';
import {
  Apple, Wifi, BatteryFull, Search, SlidersHorizontal, Folder, Compass,
  Mail as MailIcon, FileText, Presentation, Terminal, Trash2, Sparkles, Mic,
  Gamepad2, Settings as SettingsIcon, Bluetooth, Share2, Volume2, VolumeX, Sun,
  LayoutGrid, Globe,
} from 'lucide-react';
import { MacWindow } from './desktop/MacWindow';
import { place, clampRect, maximizeRect, type Rect, type Bounds } from './desktop/geometry';
import {
  TerminalApp, MailApp, SafariApp, FinderApp, ViewerApp, SkillsApp, SiriApp,
  SettingsApp, TrashApp, MinecraftApp, type Theme, type SettingsPane,
} from './desktop/apps';
import { useTyping, TOTAL_CHARS } from './desktop/terminal';
import { docs, projects, WALLPAPERS, type DesktopDoc } from './desktop/data';

type WinId =
  | 'terminal' | 'mail' | 'safari' | 'finder' | 'viewer'
  | 'skills' | 'siri' | 'settings' | 'trash' | 'minecraft';

interface Win extends Rect {
  open: boolean;
  z: number;
  minimized: boolean;
  maximized: boolean;
  prevRect?: Rect;
}

interface RawEvent {
  id: number;
  title: string;
  subtitle: string;
  date: string;
  location: string;
  description: string;
}

const events = (timelineData as { events: RawEvent[] }).events;

const initialWins = (b: Bounds): Record<WinId, Win> => {
  const base: Record<WinId, Rect & { open: boolean; z: number }> = {
    terminal: { ...place(b, Math.min(880, b.w - 80), Math.min(520, b.h - 200), 0, -8), open: true, z: 10 },
    mail: { ...place(b, 680, 520, b.w * 0.22, b.h * 0.02), open: false, z: 11 },
    safari: { ...place(b, Math.min(960, b.w - 80), 600, b.w * 0.12, b.h * 0.02), open: false, z: 12 },
    finder: { ...place(b, 740, 480, -b.w * 0.2, b.h * 0.06), open: false, z: 13 },
    viewer: { ...place(b, 800, 580, b.w * 0.1, b.h * 0.04), open: false, z: 14 },
    skills: { ...place(b, 820, 560, -b.w * 0.1, b.h * 0.03), open: false, z: 15 },
    siri: { ...place(b, 520, 460, b.w * 0.16, -b.h * 0.02), open: false, z: 16 },
    settings: { ...place(b, 720, 520, b.w * 0.14, b.h * 0.04), open: false, z: 17 },
    trash: { ...place(b, 700, 460, -b.w * 0.14, b.h * 0.05), open: false, z: 18 },
    minecraft: { ...place(b, Math.min(900, b.w - 80), 600, b.w * 0.08, b.h * 0.03), open: false, z: 19 },
  };
  return Object.fromEntries(
    Object.entries(base).map(([id, w]) => [id, { ...w, minimized: false, maximized: false }])
  ) as Record<WinId, Win>;
};

const APP_NAME: Record<WinId, string> = {
  terminal: 'Terminal',
  mail: 'Mail',
  safari: 'Safari',
  finder: 'Finder',
  viewer: 'Pages',
  skills: 'Skills',
  siri: 'Siri',
  settings: 'System Settings',
  trash: 'Trash',
  minecraft: 'Minecraft',
};

const MenuRow = ({
  label,
  onSelect,
  disabled,
}: {
  label: string;
  onSelect?: () => void;
  disabled?: boolean;
}) => (
  <button
    type="button"
    disabled={disabled}
    onPointerDown={(e) => e.stopPropagation()}
    onClick={onSelect}
    className={`block w-full whitespace-nowrap rounded px-3 py-1 text-left text-[13px] ${
      disabled ? 'cursor-default opacity-40' : 'hover:bg-blue-500 hover:text-white'
    }`}
  >
    {label}
  </button>
);

const JourneyDesktop = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [bounds, setBounds] = useState<Bounds>({ w: 1440, h: 900 });
  const [wins, setWins] = useState<Record<WinId, Win>>(() => initialWins({ w: 1440, h: 900 }));
  const [viewerDocId, setViewerDocId] = useState<number>(docs[0].id);
  const [started, setStarted] = useState(false);
  const [clock, setClock] = useState('');
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [theme, setTheme] = useState<Theme>('dark');
  const [wallpaperIndex, setWallpaperIndex] = useState(0);
  const [brightness, setBrightness] = useState(1);
  const [sound, setSound] = useState(0.6);
  const [prefersDark, setPrefersDark] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
  );
  const [settingsPane, setSettingsPane] = useState<SettingsPane>('appearance');
  const [settingsKey, setSettingsKey] = useState(0);
  const [safariTab, setSafariTab] = useState(projects[0].shortTitle);
  const [safariKey, setSafariKey] = useState(0);
  const [launchpad, setLaunchpad] = useState(false);
  const count = useTyping(started);

  const viewerDoc = docs.find((doc) => doc.id === viewerDocId) ?? docs[0];
  const resolvedTheme = theme === 'auto' ? (prefersDark ? 'dark' : 'light') : theme;
  const isDark = resolvedTheme === 'dark';

  const stop = (e: { stopPropagation: () => void }) => e.stopPropagation();
  const toggleMenu = (name: string) => setOpenMenu((prev) => (prev === name ? null : name));

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      setBounds({ w: r.width, h: r.height });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (e: MediaQueryListEvent) => setPrefersDark(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const fmt = () => {
      const parts = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Prague',
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }).formatToParts(new Date());
      const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
      setClock(`${get('weekday')} ${get('day')} ${get('month')} ${get('hour')}:${get('minute')}`);
    };
    fmt();
    const id = window.setInterval(fmt, 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.desktop-stage', { y: 48, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' });
      gsap.fromTo('.desktop-dock', { y: 90, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 0.3, ease: 'power3.out' });
      gsap.fromTo('.desktop-menubar', { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, delay: 0.1, ease: 'power2.out' });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const focus = useCallback((id: WinId) => {
    setWins((prev) => {
      const top = Math.max(...(Object.values(prev) as Win[]).map((w) => w.z));
      return { ...prev, [id]: { ...prev[id], z: top + 1 } };
    });
  }, []);

  const openWin = useCallback((id: WinId, docId?: number) => {
    if (docId !== undefined) setViewerDocId(docId);
    setWins((prev) => {
      const top = Math.max(...(Object.values(prev) as Win[]).map((w) => w.z));
      return { ...prev, [id]: { ...prev[id], open: true, minimized: false, z: top + 1 } };
    });
  }, []);

  const closeWin = useCallback((id: WinId) => {
    setWins((prev) => ({ ...prev, [id]: { ...prev[id], open: false } }));
  }, []);

  const setRect = useCallback((id: WinId, rect: Rect) => {
    setWins((prev) => ({ ...prev, [id]: { ...prev[id], ...rect } }));
  }, []);

  const openDoc = useCallback((doc: DesktopDoc) => openWin('viewer', doc.id), [openWin]);

  const toggleWin = useCallback((id: WinId) => {
    setWins((prev) => {
      const top = Math.max(...(Object.values(prev) as Win[]).map((w) => w.z));
      const w = prev[id];
      if (!w.open) return { ...prev, [id]: { ...w, open: true, minimized: false, z: top + 1 } };
      if (w.minimized) return { ...prev, [id]: { ...w, minimized: false, z: top + 1 } };
      return { ...prev, [id]: { ...w, open: false } };
    });
  }, []);

  const minimizeWin = useCallback((id: WinId) => {
    setWins((prev) => ({ ...prev, [id]: { ...prev[id], minimized: true } }));
  }, []);

  const toggleMaximize = useCallback(
    (id: WinId) => {
      setWins((prev) => {
        const w = prev[id];
        const top = Math.max(...(Object.values(prev) as Win[]).map((x) => x.z));
        if (w.maximized) {
          const restored = w.prevRect ?? { x: w.x, y: w.y, w: w.w, h: w.h };
          return { ...prev, [id]: { ...w, maximized: false, prevRect: undefined, ...restored, z: top + 1 } };
        }
        return {
          ...prev,
          [id]: {
            ...w,
            maximized: true,
            prevRect: { x: w.x, y: w.y, w: w.w, h: w.h },
            ...maximizeRect(bounds),
            z: top + 1,
          },
        };
      });
    },
    [bounds]
  );

  const openSettings = useCallback(
    (pane: SettingsPane) => {
      setSettingsPane(pane);
      setSettingsKey((k) => k + 1);
      openWin('settings');
    },
    [openWin]
  );

  const openSafari = useCallback(
    (tabTitle: string) => {
      setSafariTab(tabTitle);
      setSafariKey((k) => k + 1);
      openWin('safari');
    },
    [openWin]
  );

  const frontId =
    (Object.keys(wins) as WinId[])
      .filter((id) => wins[id].open)
      .sort((a, b) => wins[b].z - wins[a].z)[0] ?? 'terminal';
  const appName = frontId === 'viewer' ? (viewerDoc.kind === 'presentation' ? 'Keynote' : 'Pages') : APP_NAME[frontId];

  const typing = count < TOTAL_CHARS;
  const analysisId = docs.find((d) => d.kind === 'analysis')?.id ?? docs[0].id;
  const presentationId = docs.find((d) => d.kind === 'presentation')?.id ?? docs[0].id;

  const appsMenu: { label: string; action: () => void }[] = [
    { label: 'Finder', action: () => openWin('finder') },
    { label: 'Safari', action: () => openWin('safari') },
    { label: 'Mail', action: () => openWin('mail') },
    { label: 'Pages', action: () => openWin('viewer', analysisId) },
    { label: 'Keynote', action: () => openWin('viewer', presentationId) },
    { label: 'Skills', action: () => openWin('skills') },
    { label: 'Siri', action: () => openWin('siri') },
    { label: 'Minecraft', action: () => openWin('minecraft') },
    { label: 'System Settings', action: () => openSettings('appearance') },
    { label: 'Wikipedia', action: () => openSafari('Wikipedia') },
    { label: 'Terminal', action: () => openWin('terminal') },
  ];

  const panelCls = `absolute left-0 top-full z-50 mt-1 min-w-[13rem] overflow-hidden rounded-lg border p-1 shadow-2xl backdrop-blur-xl ${
    isDark ? 'border-white/10 bg-zinc-800/95 text-zinc-100' : 'border-black/10 bg-white/95 text-gray-800'
  }`;

  const dock: { key: WinId; label: string; icon: ReactNode; color: string; onClick: () => void; active: boolean }[] = [
    { key: 'finder', label: 'Finder', icon: <Folder className="h-6 w-6" fill="currentColor" />, color: 'bg-gradient-to-b from-sky-400 to-blue-600', onClick: () => toggleWin('finder'), active: wins.finder.open },
    { key: 'safari', label: 'Safari', icon: <Compass className="h-6 w-6" />, color: 'bg-gradient-to-b from-cyan-300 to-blue-500', onClick: () => toggleWin('safari'), active: wins.safari.open },
    { key: 'mail', label: 'Mail', icon: <MailIcon className="h-6 w-6" />, color: 'bg-gradient-to-b from-sky-300 to-blue-600', onClick: () => toggleWin('mail'), active: wins.mail.open },
    { key: 'viewer', label: 'Pages', icon: <FileText className="h-6 w-6" />, color: 'bg-gradient-to-b from-orange-300 to-amber-500', onClick: () => (wins.viewer.open && viewerDoc.kind === 'analysis' ? closeWin('viewer') : openWin('viewer', analysisId)), active: wins.viewer.open && viewerDoc.kind === 'analysis' },
    { key: 'viewer', label: 'Keynote', icon: <Presentation className="h-6 w-6" />, color: 'bg-gradient-to-b from-blue-400 to-indigo-600', onClick: () => (wins.viewer.open && viewerDoc.kind === 'presentation' ? closeWin('viewer') : openWin('viewer', presentationId)), active: wins.viewer.open && viewerDoc.kind === 'presentation' },
    { key: 'skills', label: 'Skills', icon: <Sparkles className="h-6 w-6" />, color: 'bg-gradient-to-b from-violet-400 to-fuchsia-600', onClick: () => toggleWin('skills'), active: wins.skills.open },
    { key: 'siri', label: 'Siri', icon: <Mic className="h-6 w-6" />, color: 'bg-gradient-to-b from-fuchsia-500 via-purple-500 to-sky-500', onClick: () => toggleWin('siri'), active: wins.siri.open },
    { key: 'settings', label: 'Settings', icon: <SettingsIcon className="h-6 w-6" />, color: 'bg-gradient-to-b from-slate-400 to-slate-600', onClick: () => toggleWin('settings'), active: wins.settings.open },
    { key: 'terminal', label: 'Terminal', icon: <Terminal className="h-6 w-6" />, color: 'bg-gradient-to-b from-zinc-700 to-zinc-900', onClick: () => toggleWin('terminal'), active: wins.terminal.open },
  ];

  const launcherApps: { label: string; icon: ReactNode; color: string; action: () => void }[] = [
    { label: 'Finder', icon: <Folder className="h-7 w-7" fill="currentColor" />, color: 'bg-gradient-to-b from-sky-400 to-blue-600', action: () => openWin('finder') },
    { label: 'Safari', icon: <Compass className="h-7 w-7" />, color: 'bg-gradient-to-b from-cyan-300 to-blue-500', action: () => openWin('safari') },
    { label: 'Mail', icon: <MailIcon className="h-7 w-7" />, color: 'bg-gradient-to-b from-sky-300 to-blue-600', action: () => openWin('mail') },
    { label: 'Pages', icon: <FileText className="h-7 w-7" />, color: 'bg-gradient-to-b from-orange-300 to-amber-500', action: () => openWin('viewer', analysisId) },
    { label: 'Keynote', icon: <Presentation className="h-7 w-7" />, color: 'bg-gradient-to-b from-blue-400 to-indigo-600', action: () => openWin('viewer', presentationId) },
    { label: 'Skills', icon: <Sparkles className="h-7 w-7" />, color: 'bg-gradient-to-b from-violet-400 to-fuchsia-600', action: () => openWin('skills') },
    { label: 'Siri', icon: <Mic className="h-7 w-7" />, color: 'bg-gradient-to-b from-fuchsia-500 via-purple-500 to-sky-500', action: () => openWin('siri') },
    { label: 'Minecraft', icon: <Gamepad2 className="h-7 w-7" />, color: 'bg-gradient-to-b from-emerald-400 to-green-700', action: () => openWin('minecraft') },
    { label: 'Settings', icon: <SettingsIcon className="h-7 w-7" />, color: 'bg-gradient-to-b from-slate-400 to-slate-600', action: () => openSettings('appearance') },
    { label: 'Wikipedia', icon: <Globe className="h-7 w-7" />, color: 'bg-gradient-to-b from-zinc-100 to-zinc-400 !text-gray-800', action: () => openSafari('Wikipedia') },
    { label: 'Terminal', icon: <Terminal className="h-7 w-7" />, color: 'bg-gradient-to-b from-zinc-700 to-zinc-900', action: () => openWin('terminal') },
    { label: 'Trash', icon: <Trash2 className="h-7 w-7" />, color: 'bg-gradient-to-b from-zinc-300 to-zinc-500', action: () => openWin('trash') },
  ];

  const desktopDark = isDark;

  return (
    <section
      ref={sectionRef}
      id="journey"
      aria-labelledby="journey-heading"
      className="relative h-[125vh] min-h-[720px] w-full"
      style={{ background: WALLPAPERS[wallpaperIndex].css }}
    >
      <h2 id="journey-heading" className="sr-only">
        Education Journey
      </h2>

      {/* Sticky desktop stage — holds the desktop ~50vh so it can be enjoyed, then releases */}
      <div
        ref={stageRef}
        onPointerDown={() => setOpenMenu(null)}
        className="desktop-stage sticky top-0 h-screen min-h-[640px] w-full overflow-hidden"
      >
        {/* Wallpaper glow + grain */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 top-1/4 h-[420px] w-[420px] animate-pulse rounded-full bg-fuchsia-500/30 blur-[120px]" />
          <div className="absolute right-0 top-0 h-[380px] w-[380px] rounded-full bg-sky-400/25 blur-[120px]" />
          <div className="absolute bottom-0 left-1/3 h-[420px] w-[420px] rounded-full bg-orange-400/20 blur-[130px]" />
          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)', backgroundSize: '4px 4px' }}
          />
          <div className={`absolute inset-0 ${desktopDark ? 'bg-gradient-to-t from-black/25 via-transparent to-black/10' : 'bg-gradient-to-t from-black/10 via-transparent to-white/10'}`} />
        </div>

        {/* Menu bar */}
        <div
          className={`desktop-menubar absolute inset-x-0 top-0 z-50 flex h-[30px] items-center justify-between border-b px-2 text-[13px] font-medium backdrop-blur-xl ${
            desktopDark ? 'border-white/10 bg-black/25 text-white' : 'border-black/10 bg-white/60 text-gray-900'
          }`}
        >
          <div className="flex items-center gap-0.5">
            <div className="relative">
              <button
                type="button"
                onPointerDown={stop}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMenu('apple');
                }}
                className="flex items-center rounded px-2 py-1 hover:bg-white/15"
                aria-label="Apple menu"
              >
                <Apple className="h-4 w-4" fill="currentColor" />
              </button>
              {openMenu === 'apple' && (
                <div className={panelCls}>
                  <MenuRow label="About This Mac" onSelect={() => openSettings('about')} />
                  <div className="my-1 h-px bg-current opacity-10" />
                  <MenuRow label="System Settings…" onSelect={() => openSettings('appearance')} />
                  <div className="my-1 h-px bg-current opacity-10" />
                  <MenuRow label="Sleep" disabled />
                  <MenuRow label="Restart…" disabled />
                  <MenuRow label="Shut Down…" disabled />
                  <div className="my-1 h-px bg-current opacity-10" />
                  <MenuRow label="Lock Screen" disabled />
                  <MenuRow label="Log Out Simon…" disabled />
                </div>
              )}
            </div>

            <div className="relative">
              <button
                type="button"
                onPointerDown={stop}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMenu('app');
                }}
                className="rounded px-2 py-1 font-semibold hover:bg-white/15"
              >
                {appName}
              </button>
              {openMenu === 'app' && (
                <div className={panelCls}>
                  <MenuRow label={`About ${appName}`} onSelect={() => openSettings('about')} />
                  <div className="my-1 h-px bg-current opacity-10" />
                  <MenuRow label={`Quit ${appName}`} onSelect={() => closeWin(frontId)} />
                </div>
              )}
            </div>

            {['File', 'Edit', 'View', 'Window', 'Help'].map((label) => (
              <div key={label} className="relative hidden sm:block">
                <button
                  type="button"
                  onPointerDown={stop}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMenu(label);
                  }}
                  className="rounded px-2 py-1 hover:bg-white/15"
                >
                  {label}
                </button>
                {openMenu === label && (
                  <div className={panelCls}>
                    <MenuRow label={`${label}: nothing here yet`} disabled />
                    <MenuRow label="Shmack OS v14.0" disabled />
                  </div>
                )}
              </div>
            ))}

            <div className="relative">
              <button
                type="button"
                onPointerDown={stop}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMenu('apps');
                }}
                className="rounded px-2 py-1 hover:bg-white/15"
              >
                Apps
              </button>
              {openMenu === 'apps' && (
                <div className={panelCls}>
                  {appsMenu.map((item) => (
                    <MenuRow key={item.label} label={item.label} onSelect={item.action} />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className={`flex items-center gap-3 ${desktopDark ? 'text-white/90' : 'text-gray-700'}`}>
            <BatteryFull className="h-4 w-4" />
            <button
              type="button"
              onPointerDown={stop}
              onClick={(e) => {
                e.stopPropagation();
                toggleMenu('control');
              }}
              className="flex items-center rounded px-1.5 py-1 hover:bg-white/15"
              aria-label="Wi-Fi"
            >
              <Wifi className="h-4 w-4" />
            </button>
            <Search className="h-4 w-4" />
            <div className="relative">
              <button
                type="button"
                onPointerDown={stop}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMenu('control');
                }}
                className="flex items-center rounded px-1.5 py-1 hover:bg-white/15"
                aria-label="Control Centre"
              >
                <SlidersHorizontal className="h-4 w-4" />
              </button>
              {openMenu === 'control' && (
                <div
                  onPointerDown={(e) => e.stopPropagation()}
                  className={`absolute right-0 top-full z-50 mt-1 w-[19rem] rounded-2xl border p-3 shadow-2xl backdrop-blur-2xl ${
                    desktopDark ? 'border-white/10 bg-zinc-800/90 text-white' : 'border-black/10 bg-white/90 text-gray-800'
                  }`}
                >
                  <div className={`grid grid-cols-2 gap-2 ${desktopDark ? '[&_button]:bg-white/10' : '[&_button]:bg-black/5'}`}>
                    <button type="button" className="col-span-2 flex items-center gap-3 rounded-xl p-2 text-left">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white">
                        <Wifi className="h-4 w-4" />
                      </span>
                      <span>
                        <span className="block text-[13px] font-medium">Wi-Fi</span>
                        <span className="block text-[11px] opacity-70">idk_pass</span>
                      </span>
                    </button>
                    <button type="button" className="flex items-center gap-2 rounded-xl p-2 text-left">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-500 text-white">
                        <Bluetooth className="h-3.5 w-3.5" />
                      </span>
                      <span className="text-[12px]">
                        <span className="block font-medium">Bluetooth</span>
                        <span className="block text-[10px] opacity-70">On</span>
                      </span>
                    </button>
                    <button type="button" className="flex items-center gap-2 rounded-xl p-2 text-left">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-500 text-white">
                        <Share2 className="h-3.5 w-3.5" />
                      </span>
                      <span className="text-[12px]">
                        <span className="block font-medium">AirDrop</span>
                        <span className="block text-[10px] opacity-70">Opportunities only</span>
                      </span>
                    </button>
                  </div>

                  <div className={`mt-2 rounded-xl p-2.5 ${desktopDark ? 'bg-white/10' : 'bg-black/5'}`}>
                    <div className="mb-1 flex items-center gap-2 text-[12px] font-medium">
                      <Sun className="h-3.5 w-3.5" />
                      Display
                      <span className="ml-auto text-[11px] opacity-60">{Math.round(brightness * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min={35}
                      max={100}
                      value={Math.round(brightness * 100)}
                      onChange={(e) => setBrightness(Number(e.target.value) / 100)}
                      className="w-full accent-blue-500"
                      aria-label="Brightness"
                    />
                  </div>

                  <div className={`mt-2 rounded-xl p-2.5 ${desktopDark ? 'bg-white/10' : 'bg-black/5'}`}>
                    <div className="mb-1 flex items-center gap-2 text-[12px] font-medium">
                      {sound > 0 ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
                      Sound
                      <span className="ml-auto text-[11px] opacity-60">{Math.round(sound * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={Math.round(sound * 100)}
                      onChange={(e) => setSound(Number(e.target.value) / 100)}
                      className="w-full accent-blue-500"
                      aria-label="Sound"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => setTheme(isDark ? 'light' : 'dark')}
                    className={`mt-2 w-full rounded-xl p-2 text-[12px] font-medium ${desktopDark ? 'bg-white/10' : 'bg-black/5'}`}
                  >
                    Appearance: {isDark ? 'Dark' : 'Light'}
                  </button>
                </div>
              )}
            </div>
            <span className="tabular-nums">{clock}</span>
          </div>
        </div>

        {/* Windows */}
        {wins.terminal.open && !wins.terminal.minimized && (
          <MacWindow
            title="simon — -zsh — 120×40"
            rect={clampRect(wins.terminal, bounds)}
            bounds={bounds}
            z={wins.terminal.z}
            dark
            onFocus={() => focus('terminal')}
            onChange={(r) => setRect('terminal', r)}
            onClose={() => closeWin('terminal')}
            onMinimize={() => minimizeWin('terminal')}
            onMaximize={() => toggleMaximize('terminal')}
            headerExtra={
              typing ? (
                <>
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                  <span className="text-emerald-300">running</span>
                </>
              ) : (
                <span className="text-zinc-500">done</span>
              )
            }
          >
            <TerminalApp
              count={count}
              actions={{
                openDoc: (docId) => openWin('viewer', docId),
                openSafari: () => openWin('safari'),
                openSkills: () => openWin('skills'),
                openFinder: () => openWin('finder'),
                openSettings: () => openSettings('appearance'),
                openMinecraft: () => openWin('minecraft'),
                openTrash: () => openWin('trash'),
                openMail: () => openWin('mail'),
                openSiri: () => openWin('siri'),
              }}
            />
          </MacWindow>
        )}

        {wins.mail.open && !wins.mail.minimized && (
          <MacWindow
            title="New Message"
            rect={clampRect(wins.mail, bounds)}
            bounds={bounds}
            z={wins.mail.z}
            dark={desktopDark}
            onFocus={() => focus('mail')}
            onChange={(r) => setRect('mail', r)}
            onClose={() => closeWin('mail')}
            onMinimize={() => minimizeWin('mail')}
            onMaximize={() => toggleMaximize('mail')}
          >
            <MailApp />
          </MacWindow>
        )}

        {wins.safari.open && !wins.safari.minimized && (
          <MacWindow
            title="Safari"
            rect={clampRect(wins.safari, bounds)}
            bounds={bounds}
            z={wins.safari.z}
            dark={desktopDark}
            solid
            onFocus={() => focus('safari')}
            onChange={(r) => setRect('safari', r)}
            onClose={() => closeWin('safari')}
            onMinimize={() => minimizeWin('safari')}
            onMaximize={() => toggleMaximize('safari')}
          >
            <SafariApp key={safariKey} initialTabTitle={safariTab} />
          </MacWindow>
        )}

        {wins.finder.open && !wins.finder.minimized && (
          <MacWindow
            title="Education"
            rect={clampRect(wins.finder, bounds)}
            bounds={bounds}
            z={wins.finder.z}
            dark={desktopDark}
            onFocus={() => focus('finder')}
            onChange={(r) => setRect('finder', r)}
            onClose={() => closeWin('finder')}
            onMinimize={() => minimizeWin('finder')}
            onMaximize={() => toggleMaximize('finder')}
          >
            <FinderApp onOpen={openDoc} />
          </MacWindow>
        )}

        {wins.viewer.open && !wins.viewer.minimized && (
          <MacWindow
            title={`${viewerDoc.kind === 'presentation' ? 'Keynote' : 'Pages'} — ${viewerDoc.title}`}
            rect={clampRect(wins.viewer, bounds)}
            bounds={bounds}
            z={wins.viewer.z}
            dark={desktopDark}
            solid
            onFocus={() => focus('viewer')}
            onChange={(r) => setRect('viewer', r)}
            onClose={() => closeWin('viewer')}
            onMinimize={() => minimizeWin('viewer')}
            onMaximize={() => toggleMaximize('viewer')}
          >
            <ViewerApp doc={viewerDoc} />
          </MacWindow>
        )}

        {wins.skills.open && !wins.skills.minimized && (
          <MacWindow
            title="Skills"
            rect={clampRect(wins.skills, bounds)}
            bounds={bounds}
            z={wins.skills.z}
            dark={desktopDark}
            onFocus={() => focus('skills')}
            onChange={(r) => setRect('skills', r)}
            onClose={() => closeWin('skills')}
            onMinimize={() => minimizeWin('skills')}
            onMaximize={() => toggleMaximize('skills')}
          >
            <SkillsApp />
          </MacWindow>
        )}

        {wins.siri.open && !wins.siri.minimized && (
          <MacWindow
            title="Siri"
            rect={clampRect(wins.siri, bounds)}
            bounds={bounds}
            z={wins.siri.z}
            dark
            onFocus={() => focus('siri')}
            onChange={(r) => setRect('siri', r)}
            onClose={() => closeWin('siri')}
            onMinimize={() => minimizeWin('siri')}
            onMaximize={() => toggleMaximize('siri')}
          >
            <SiriApp />
          </MacWindow>
        )}

        {wins.settings.open && !wins.settings.minimized && (
          <MacWindow
            title="System Settings"
            rect={clampRect(wins.settings, bounds)}
            bounds={bounds}
            z={wins.settings.z}
            dark={desktopDark}
            onFocus={() => focus('settings')}
            onChange={(r) => setRect('settings', r)}
            onClose={() => closeWin('settings')}
            onMinimize={() => minimizeWin('settings')}
            onMaximize={() => toggleMaximize('settings')}
          >
            <SettingsApp
              key={settingsKey}
              theme={theme}
              onThemeChange={setTheme}
              wallpaperIndex={wallpaperIndex}
              onWallpaperChange={setWallpaperIndex}
              initialPane={settingsPane}
            />
          </MacWindow>
        )}

        {wins.trash.open && !wins.trash.minimized && (
          <MacWindow
            title="Trash"
            rect={clampRect(wins.trash, bounds)}
            bounds={bounds}
            z={wins.trash.z}
            dark={desktopDark}
            onFocus={() => focus('trash')}
            onChange={(r) => setRect('trash', r)}
            onClose={() => closeWin('trash')}
            onMinimize={() => minimizeWin('trash')}
            onMaximize={() => toggleMaximize('trash')}
          >
            <TrashApp />
          </MacWindow>
        )}

        {wins.minecraft.open && !wins.minecraft.minimized && (
          <MacWindow
            title="Minecraft"
            rect={clampRect(wins.minecraft, bounds)}
            bounds={bounds}
            z={wins.minecraft.z}
            dark
            solid
            onFocus={() => focus('minecraft')}
            onChange={(r) => setRect('minecraft', r)}
            onClose={() => closeWin('minecraft')}
            onMinimize={() => minimizeWin('minecraft')}
            onMaximize={() => toggleMaximize('minecraft')}
          >
            <MinecraftApp />
          </MacWindow>
        )}

        {/* Dock */}
        <div className="desktop-dock absolute inset-x-0 bottom-4 z-40 flex justify-center">
          <div
            className={`flex items-end gap-1.5 rounded-2xl border px-2.5 py-2 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.6)] backdrop-blur-2xl sm:gap-3 sm:px-4 sm:py-2.5 ${
              desktopDark ? 'border-white/25 bg-white/20' : 'border-white/60 bg-white/55'
            }`}
          >
            <div className="group relative flex flex-col items-center">
              <span className="pointer-events-none absolute -top-9 whitespace-nowrap rounded-md bg-black/70 px-2 py-1 text-[11px] text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                Launchpad
              </span>
              <button
                type="button"
                onClick={() => setLaunchpad(true)}
                aria-label="Launchpad"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-b from-slate-100 to-slate-400 text-gray-700 shadow-lg transition-transform duration-200 ease-out group-hover:-translate-y-2 group-hover:scale-110 sm:h-12 sm:w-12 sm:rounded-[14px] [&_svg]:h-5 [&_svg]:w-5 sm:[&_svg]:h-6 sm:[&_svg]:w-6"
              >
                <span className="dock-idle" style={{ animationDelay: '0ms' }}>
                  <LayoutGrid className="h-6 w-6" />
                </span>
              </button>
            </div>
            {dock.map((item, i) => (
              <div key={item.label} className="group relative flex flex-col items-center">
                <span className="pointer-events-none absolute -top-9 whitespace-nowrap rounded-md bg-black/70 px-2 py-1 text-[11px] text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                  {item.label}
                </span>
                <button
                  type="button"
                  onClick={item.onClick}
                  className={`flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-lg transition-transform duration-200 ease-out group-hover:-translate-y-2 group-hover:scale-110 sm:h-12 sm:w-12 sm:rounded-[14px] [&_svg]:h-5 [&_svg]:w-5 sm:[&_svg]:h-6 sm:[&_svg]:w-6 ${item.color}`}
                >
                  <span
                    className={item.key === 'terminal' && typing ? 'dock-bounce' : 'dock-idle'}
                    style={{ animationDelay: `${i * 150}ms` }}
                  >
                    {item.icon}
                  </span>
                </button>
                {item.active && (
                  <span className={`mt-1 h-1 w-1 rounded-full ${desktopDark ? 'bg-white/80' : 'bg-gray-700/70'}`} />
                )}
              </div>
            ))}
            <span className={`mx-1 h-7 w-px self-center sm:h-9 ${desktopDark ? 'bg-white/30' : 'bg-black/15'}`} />
            <div className="group relative flex flex-col items-center">
              <button
                type="button"
                onClick={() => toggleWin('trash')}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-b from-zinc-300 to-zinc-500 text-white shadow-lg transition-transform duration-200 ease-out group-hover:-translate-y-2 group-hover:scale-110 sm:h-12 sm:w-12 sm:rounded-[14px] [&_svg]:h-5 [&_svg]:w-5 sm:[&_svg]:h-6 sm:[&_svg]:w-6"
              >
                <span className="dock-idle" style={{ animationDelay: '1500ms' }}>
                  <Trash2 className="h-6 w-6" />
                </span>
              </button>
              {wins.trash.open && (
                <span className={`mt-1 h-1 w-1 rounded-full ${desktopDark ? 'bg-white/80' : 'bg-gray-700/70'}`} />
              )}
            </div>
          </div>
        </div>

        {/* Launchpad */}
        {launchpad && (
          <div
            className="absolute inset-0 z-[70] flex flex-col items-center justify-center bg-black/40 backdrop-blur-2xl"
            onPointerDown={() => setLaunchpad(false)}
          >
            <div
              className="grid grid-cols-4 gap-x-10 gap-y-8 px-8 sm:grid-cols-6"
              onPointerDown={(e) => e.stopPropagation()}
            >
              {launcherApps.map((app) => (
                <button
                  key={app.label}
                  type="button"
                  onClick={() => {
                    setLaunchpad(false);
                    app.action();
                  }}
                  className="flex flex-col items-center gap-2"
                >
                  <span
                    className={`flex h-16 w-16 items-center justify-center rounded-2xl text-white shadow-xl transition-transform duration-200 hover:scale-105 ${app.color}`}
                  >
                    {app.icon}
                  </span>
                  <span className="text-[12px] font-medium text-white drop-shadow">{app.label}</span>
                </button>
              ))}
            </div>
            <p className="mt-10 text-[12px] text-white/60">Click an app · click outside to close</p>
          </div>
        )}

        {/* Brightness dimmer */}
        <div
          className="pointer-events-none absolute inset-0 z-[80] bg-black"
          style={{ opacity: (1 - brightness) * 0.8 }}
        />
      </div>

      {/* Screen-reader content */}
      <ol className="sr-only">
        {events.map((event) => (
          <li key={event.id}>
            <h3>{event.title}</h3>
            <p>
              {event.subtitle} — {event.date}, {event.location}
            </p>
            <p>{event.description}</p>
          </li>
        ))}
      </ol>
    </section>
  );
};

export default JourneyDesktop;
