import { useEffect, useRef, useState } from 'react'
import { ArrowLink } from '../components/Buttons'
import { FadeIn } from '../components/FadeIn'
import { RollText } from '../components/RollText'
import { SectionHead } from '../components/SectionHead'
import { socials } from '../data/profile'

const USER = socials.github.split('/').pop()!
// One hue: the signal colour at rising strength, on a faint bone base.
const LEVELS = ['rgba(237,234,227,0.07)', 'rgba(255,79,26,0.3)', 'rgba(255,79,26,0.55)', 'rgba(255,79,26,0.8)', '#FF4F1A']

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

// GitHub allows 60 unauthenticated requests an hour per visitor, so keep a copy for 30 minutes
// instead of refetching on every reload. Storage can throw in private modes; then just fetch.
const CACHE_KEY = 'gh-activity'
const CACHE_MS = 30 * 60 * 1000

async function cachedLoad(): Promise<Data> {
  try {
    const hit = JSON.parse(sessionStorage.getItem(CACHE_KEY) ?? 'null')
    if (hit && Date.now() - hit.at < CACHE_MS) return hit.data
  } catch {
    /* fall through to a fresh fetch */
  }
  const data = await load()
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), data }))
  } catch {
    /* not cached, fine */
  }
  return data
}

export function GithubActivity() {
  const [data, setData] = useState<Data | null>(null)
  const [failed, setFailed] = useState(false)
  const graph = useRef<HTMLDivElement>(null)

  useEffect(() => {
    cachedLoad().then(setData, () => setFailed(true))
  }, [])

  // On narrow screens the graph scrolls sideways; start at the most recent weeks.
  useEffect(() => {
    if (graph.current) graph.current.scrollLeft = graph.current.scrollWidth
  }, [data])

  if (failed) return null

  return (
    <section className="px-5 pb-24 sm:px-8 md:px-10 md:pb-36">
      <SectionHead index="03" label="Activity" title="Shipping," accent="lately" />
      <div className="grid grid-cols-12 gap-x-6 gap-y-10">
        <FadeIn className="col-span-12 md:col-span-3">
          <p className="display text-signal" style={{ fontSize: 'clamp(4rem, 8vw, 128px)' }}>
            {data ? data.total : '—'}
          </p>
          <p className="label mt-2 text-muted">Contributions, last 12 months</p>
          <ArrowLink href={socials.github} className="mt-6 text-bone">
            @{USER} ↗
          </ArrowLink>
        </FadeIn>

        <div className="col-span-12 md:col-span-9">
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
                        className="h-[11px] w-[11px] md:h-[13px] md:w-[13px]"
                        style={{ background: day ? LEVELS[day.level] : data ? 'transparent' : LEVELS[0] }}
                      />
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
          <div className="label mt-3 flex items-center justify-end gap-1.5 text-muted">
            Less
            {LEVELS.map((c) => (
              <span key={c} className="h-[11px] w-[11px]" style={{ background: c }} />
            ))}
            More
          </div>

          {data && (
            <div className="mt-12">
              <p className="label mb-3 text-muted">Recently pushed — {data.repoCount} public repos</p>
              <ul>
                {data.repos.map((r) => (
                  <li key={r.name} className="border-t border-rule last:border-b">
                    <a href={r.html_url} target="_blank" rel="noreferrer" className="group grid grid-cols-12 items-baseline gap-x-6 py-4">
                      <span className="col-span-7 text-lg text-bone sm:col-span-4">
                        <RollText text={r.name} />
                      </span>
                      <span className="col-span-5 hidden truncate text-sm text-muted sm:col-span-5 sm:block">{r.description}</span>
                      <span className="label col-span-5 text-right text-muted sm:col-span-3">
                        {r.language ?? '—'} · {timeAgo(r.pushed_at)}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
