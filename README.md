# akshatgcodes.in

Personal portfolio of Akshat Gupta. Vite + React + TypeScript + Tailwind CSS + Framer Motion.

## Run it

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # type-check + production build into dist/
npm run lint
```

## Editing content

All text lives in `src/data/`, so content changes never touch the UI:

| File | What it holds |
|---|---|
| `profile.ts` | name, role, tagline, about text, education, email and social links |
| `experience.ts` | internships, newest first |
| `skills.ts` | skill groups |
| `projects.ts` | projects; `featured: true` puts one in the big stacking cards, the rest go in "More builds" |
| `achievements.ts` | awards |

Each project needs three screenshots in `public/projects/`: `<slug>-1.webp` and `<slug>-2.webp` (desktop, 1280×800) and `<slug>-m.webp` (mobile, 600×1298).

## Extras

- `src/lib/scroll.ts`: Lenis smooth scroll (off for reduced motion), scroll lock for the intro and menu.
- `src/components/Loader.tsx`: intro animation, shown once per browser session.
- `src/components/Nav.tsx`: floating nav after the hero, full-screen menu on mobile.
- `src/components/Cursor.tsx`: custom cursor on mouse devices only; add `data-cursor="view"` to anything that should show "VIEW".
- `src/sections/GithubActivity.tsx`: live contributions graph and recently pushed repos, fetched in the browser; hides itself if GitHub or the contributions proxy is down.

## Deploy

Static site: Vercel with the Vite preset (build `npm run build`, output `dist`).
