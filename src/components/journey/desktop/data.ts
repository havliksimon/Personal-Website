export interface DesktopDoc {
  id: number;
  title: string;
  subtitle: string;
  date: string;
  pages: number;
  kind: 'analysis' | 'presentation' | 'cv';
  pdfUrl: string;
}

export const docs: DesktopDoc[] = [
  {
    id: 1,
    title: 'Bilibili Equity Analysis',
    subtitle: 'EM Technology & Entertainment',
    date: 'Oct 2026',
    pages: 28,
    kind: 'analysis',
    pdfUrl: '/analyses/EM_BILI_Havlik.docx.pdf',
  },
  {
    id: 2,
    title: 'Tuya Inc. Analysis',
    subtitle: 'IoT & Smart Home Technology',
    date: 'Dec 2024',
    pages: 22,
    kind: 'analysis',
    pdfUrl: '/analyses/EM_TUYA_Havlik.pdf',
  },
  {
    id: 3,
    title: 'Alphabet (Google) Analysis',
    subtitle: 'Large Cap Technology',
    date: 'Jul 2025',
    pages: 18,
    kind: 'analysis',
    pdfUrl: '/analyses/GOOGL_Havlik.pdf',
  },
  {
    id: 7,
    title: 'Bilibili Investment Case (IIE)',
    subtitle: 'Chinese Long-Form Video · 371M MAU',
    date: 'Oct 2026',
    pages: 16,
    kind: 'presentation',
    pdfUrl: '/presentations/presentation_BILI.pdf',
  },
  {
    id: 4,
    title: 'Chagee Investment Case',
    subtitle: 'High Risk, High Reward Opportunity',
    date: 'Nov 2024',
    pages: 20,
    kind: 'presentation',
    pdfUrl: '/presentations/presentation_Chagee.pdf',
  },
  {
    id: 5,
    title: 'Tencent Investment Case',
    subtitle: 'Chinese Tech Conglomerate',
    date: 'Oct 2024',
    pages: 24,
    kind: 'presentation',
    pdfUrl: '/presentations/presentation_Tencent.pdf',
  },
  {
    id: 6,
    title: 'Geely Automobile Analysis',
    subtitle: 'Chinese Auto & NEV Conglomerate',
    date: 'Feb 2026',
    pages: 21,
    kind: 'analysis',
    pdfUrl: '/analyses/EM_GELYF_Havlik.pdf',
  },
  {
    id: 10,
    title: 'CV — Simon Havlík',
    subtitle: 'Curriculum Vitae',
    date: '2026',
    pages: 1,
    kind: 'cv',
    pdfUrl: '/CV_Simon_Havlik.pdf',
  },
];

export const CV_DOC_ID = 10;

export interface DesktopProject {
  id: number;
  title: string;
  shortTitle: string;
  description: string;
  tags: string[];
  previewUrl: string;
  liveUrl: string;
  github: string;
}

export const projects: DesktopProject[] = [
  {
    id: 1,
    title: 'KI AM Portfolio Tracking Platform',
    shortTitle: 'KI AM Platform',
    description: 'Production-grade analyst performance tracking for investment clubs.',
    tags: ['Python', 'Flask', 'SQLAlchemy', 'Bootstrap'],
    previewUrl: 'https://ki.havliksimon.eu/',
    liveUrl: 'https://ki.havliksimon.eu/',
    github: 'https://github.com/havliksimon/ki-asset-management',
  },
  {
    id: 2,
    title: 'Portfolio Optimizer',
    shortTitle: 'Optimizer',
    description: 'Quantitative portfolio optimization (MPT, Risk Parity, Black-Litterman, EVT, Monte Carlo).',
    tags: ['Python', 'Flask', 'CVXPY', 'Plotly'],
    previewUrl: 'https://optimizer.havliksimon.eu/',
    liveUrl: 'https://optimizer.havliksimon.eu/',
    github: 'https://github.com/havliksimon/Portfolio-Optimization-Model',
  },
];

export const CONTACT_EMAIL = 'havlik.simon@post.cz';
export const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xreaqlgy';

export interface Wallpaper {
  name: string;
  css: string;
  dark: boolean;
}

export const WALLPAPERS: Wallpaper[] = [
  { name: 'Sonoma', css: 'linear-gradient(135deg, #1e1b4b 0%, #4c1d95 34%, #9d174d 68%, #ea580c 100%)', dark: true },
  { name: 'Monterey', css: 'linear-gradient(135deg, #0f172a 0%, #4338ca 48%, #db2777 100%)', dark: true },
  { name: 'Big Sur', css: 'linear-gradient(160deg, #0f172a 0%, #0e7490 48%, #22d3ee 100%)', dark: true },
  { name: 'Ventura', css: 'linear-gradient(140deg, #f59e0b 0%, #ef4444 45%, #7c3aed 100%)', dark: true },
  { name: 'Graphite', css: 'linear-gradient(150deg, #0b1220 0%, #1f2937 55%, #4b5563 100%)', dark: true },
  { name: 'Daylight', css: 'linear-gradient(150deg, #bae6fd 0%, #fae8ff 50%, #fff7ed 100%)', dark: false },
];
