export type Project = {
  slug: string
  name: string
  category: string
  description: string
  stack: string[]
  live: string
  repo: string
  /** Shown as a big stacking card. Everything else goes in the smaller grid. */
  featured?: boolean
}

// Screenshots live in /public/projects as `<slug>-1.webp`, `<slug>-2.webp` (desktop)
// and `<slug>-m.webp` (mobile). To feature a different project, flip `featured`.
const gh = (repo: string) => `https://github.com/akshatgcodes/${repo}`
const live = (sub: string) => `https://${sub}.akshatgcodes.in`

export const projects: Project[] = [
  {
    slug: 'syncnote',
    name: 'SyncNote',
    category: 'Full-Stack · AI',
    description:
      'A clean note-taking app with autosave, AI-generated titles and an AI chat that can read your notes.',
    stack: ['React', 'Vite', 'Express', 'MongoDB', 'JWT', 'Groq'],
    live: live('syncnote'),
    repo: gh('SyncNote'),
    featured: true,
  },
  {
    slug: 'ledgerlite',
    name: 'LedgerLite',
    category: 'Full-Stack',
    description:
      'A multi-user expense tracker with monthly budget caps, exact overage math and a spending roast that reads your real numbers.',
    stack: ['Python', 'Flask', 'SQLAlchemy', 'PostgreSQL'],
    live: live('ledgerlite'),
    repo: gh('LedgerLite'),
    featured: true,
  },
  {
    slug: 'nextalk',
    name: 'NexTalk',
    category: 'Real-time',
    description:
      'Real-time room chat with live presence, live reactions and a server-enforced ghost mode for lurking invisibly.',
    stack: ['Node.js', 'Express', 'Socket.IO', 'WebSockets'],
    live: live('nextalk'),
    repo: gh('NexTalk'),
    featured: true,
  },
  {
    slug: 'sniplink',
    name: 'Sniplink',
    category: 'Backend',
    description:
      'A self-hosted URL shortener with link expiry by days or clicks, per-link QR codes and a hit-tracking dashboard.',
    stack: ['Python', 'Flask', 'PostgreSQL', 'QR codes'],
    live: live('sniplink'),
    repo: gh('Sniplink'),
    featured: true,
  },
  {
    slug: 'jobradar',
    name: 'JobRadar',
    category: 'Automation',
    description:
      'A job-listing scraper that filters, de-duplicates and ranks every listing by a weighted fit score against your skills, then exports a CSV.',
    stack: ['Python', 'BeautifulSoup', 'pandas', 'CLI'],
    live: live('jobradar'),
    repo: gh('JobRadar'),
    featured: true,
  },
  {
    slug: 'profilepulse',
    name: 'ProfilePulse',
    category: 'Web App',
    description:
      "A GitHub profile roaster: type any username and get a roast card built from that account's real public stats.",
    stack: ['Python', 'Flask', 'GitHub API'],
    live: live('profilepulse'),
    repo: gh('ProfilePulse'),
  },
  {
    slug: 'noteflow',
    name: 'NoteFlow',
    category: 'CLI + Web',
    description:
      'A Markdown notes system with a CLI for writing and a web reader with auto-tagging, tag filters and highlighted search.',
    stack: ['Python', 'Flask', 'Pygments', 'Markdown'],
    live: live('noteflow'),
    repo: gh('NoteFlow'),
  },
  {
    slug: 'mailforge',
    name: 'MailForge',
    category: 'Automation',
    description:
      'A bulk personalised email sender that makes you preview every rendered email before anything goes out.',
    stack: ['Python', 'Jinja2', 'pandas', 'SMTP'],
    live: live('mailforge'),
    repo: gh('MailForge'),
  },
  {
    slug: 'pricewatch',
    name: 'PriceWatch',
    category: 'Automation',
    description:
      'A background daemon that watches stock and crypto prices, alerts you when a threshold is crossed and charts the history it logs.',
    stack: ['Python', 'yfinance', 'CoinGecko', 'matplotlib'],
    live: live('pricewatch'),
    repo: gh('PriceWatch'),
  },
  {
    slug: 'gradevault',
    name: 'GradeVault',
    category: 'Systems · C',
    description:
      'A terminal grade manager in plain C that stores records in a file and writes a brutally honest class report card.',
    stack: ['C', 'File I/O', 'ANSI'],
    live: live('gradevault'),
    repo: gh('GradeVault'),
  },
  {
    slug: 'shellx',
    name: 'ShellX',
    category: 'Systems · C',
    description:
      'A minimal Unix shell in C with persistent, timestamped history and #keyword fuzzy recall.',
    stack: ['C', 'POSIX', 'readline'],
    live: live('shellx'),
    repo: gh('ShellX'),
  },
]
