import { ArrowUpRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { GithubIcon } from '../components/BrandIcons'
import { FadeIn } from '../components/FadeIn'
import { socials } from '../data/profile'

const USER = socials.github.split('/').pop()!
const LEVELS = ['rgba(215,226,234,0.07)', '#3a1450', '#7621B0', '#B600A8', '#E0661A']

type Day = { date: string; count: number; level: number }
type Repo = { name: string; description: string | null; language: string | null; pushed_at: string; html_url: string; fork: boolean }
type Data = { total: number; weeks: Day[][]; repos: Repo[]; repoCount: number }

function timeAgo(iso: string) {
  const s = (Date.now() - new Date(iso).getTime()) / 1000
  const units: [number, string][] = [[31536000, 'y'], [2592000, 'mo'], [86400, 'd'], [3600, 'h'], [60, 'm']]
  for (const [secs, label] of units) if (s >= secs) return `${Math.floor(s / secs)}${label} ago`
  return 'just now'
}

// Contributions come from a public proxy (GitHub's own calendar needs a token); repos come
// straight from the GitHub API. If either request fails the whole section stays hidden.
async function load(): Promise<Data> {
  const [contrib, repos] = await Promise.all([
    fetch(`https://github-contributions-api.jogruber.de/v4/${USER}?y=last`).then((r) => (r.ok ? r.json() : Promise.reject(r))),
    fetch(`https://api.github.com/users/${USER}/repos?per_page=100&sort=pushed`).then((r) => (r.ok ? r.json() : Promise.reject(r))),
  ])
  const days: Day[] = contrib.contributions
  // Pad the front so the first column starts on a Sunday, like GitHub's own graph.
  const lead = new Date(days[0].date).getUTCDay()
  const padded = [...Array(lead).fill(null), ...days]
  const weeks: Day[][] = []
  for (let i = 0; i < padded.length; i += 7) weeks.push(padded.slice(i, i + 7))
  const own = (repos as Repo[]).filter((r) => !r.fork && r.name !== USER)
  return { total: contrib.total.lastYear, weeks, repos: own.slice(0, 5), repoCount: own.length }
}

export function GithubActivity() {
  const [data, setData] = useState<Data | null>(null)
  const [failed, setFailed] = useState(false)
  const graph = useRef<HTMLDivElement>(null)

  useEffect(() => {
    load().then(setData, () => setFailed(true))
  }, [])

  // On narrow screens the graph scrolls sideways; start at the most recent weeks.
  useEffect(() => {
    if (graph.current) graph.current.scrollLeft = graph.current.scrollWidth
  }, [data])

  if (failed) return null

  return (
    <section className="bg-ink px-5 pb-24 pt-8 sm:px-8 md:px-10 md:pb-32">
      <div className="mx-auto max-w-6xl rounded-[32px] border border-mist/15 p-5 sm:rounded-[44px] sm:p-8 md:p-10">
        <FadeIn className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 flex items-center gap-2 text-xs uppercase tracking-widest text-mist/60 sm:text-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#B600A8] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#B600A8]" />
              </span>
              Live from GitHub
            </p>
            <h3 className="font-medium uppercase leading-none text-mist" style={{ fontSize: 'clamp(1.6rem, 3.4vw, 3rem)' }}>
              {data ? `${data.total} contributions` : 'Loading…'}
              <span className="text-mist/50"> in the last year</span>
            </h3>
          </div>
          <a
            href={socials.github}
            target="_blank"
            rel="noreferrer"
            className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border-2 border-mist px-5 py-2 text-xs font-medium uppercase tracking-widest text-mist transition-colors hover:bg-mist/10 sm:self-auto sm:text-sm"
          >
            <GithubIcon className="h-4 w-4" /> @{USER}
          </a>
        </FadeIn>

        <div ref={graph} className="overflow-x-auto pb-2" aria-label={data ? `${data.total} GitHub contributions in the last year` : undefined}>
          <div className="flex w-max gap-[3px]">
            {(data?.weeks ?? Array.from({ length: 53 }, () => Array(7).fill(null))).map((week, i) => (
              <div key={i} className="flex flex-col gap-[3px]">
                {Array.from({ length: 7 }, (_, d) => {
                  const day = week[d] as Day | null
                  return (
                    <span
                      key={d}
                      title={day ? `${day.count} on ${day.date}` : undefined}
                      className="h-[11px] w-[11px] rounded-[3px] md:h-[14px] md:w-[14px]"
                      style={{ background: day ? LEVELS[day.level] : data ? 'transparent' : LEVELS[0] }}
                    />
                  )
                })}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-3 flex items-center justify-end gap-1.5 text-xs text-mist/50">
          Less
          {LEVELS.map((c) => (
            <span key={c} className="h-[11px] w-[11px] rounded-[3px]" style={{ background: c }} />
          ))}
          More
        </div>

        {data && (
          <div className="mt-10">
            <p className="mb-4 text-xs uppercase tracking-widest text-mist/60 sm:text-sm">
              Recently pushed · {data.repoCount} public repos
            </p>
            <ul className="divide-y divide-mist/10 border-y border-mist/10">
              {data.repos.map((r) => (
                <li key={r.name}>
                  <a
                    href={r.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center justify-between gap-4 py-4 transition-opacity hover:opacity-80"
                  >
                    <div className="min-w-0">
                      <p className="flex items-center gap-2 text-base font-medium uppercase text-mist sm:text-lg">
                        {r.name}
                        <ArrowUpRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                      </p>
                      {r.description && <p className="truncate text-sm font-light text-mist/55">{r.description}</p>}
                    </div>
                    <div className="shrink-0 text-right text-xs uppercase tracking-widest text-mist/50">
                      <p>{r.language ?? '—'}</p>
                      <p>{timeAgo(r.pushed_at)}</p>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}
