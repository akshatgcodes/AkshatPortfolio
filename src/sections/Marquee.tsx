import { useEffect, useRef, useState } from 'react'
import { projects } from '../data/projects'

const shots = projects.flatMap((p) => [
  { src: `/projects/${p.slug}-1.webp`, alt: `${p.name} landing page` },
  { src: `/projects/${p.slug}-2.webp`, alt: `${p.name} features` },
])
const half = Math.ceil(shots.length / 2)
const rows = [shots.slice(0, half), shots.slice(half)]

export function Marquee() {
  const ref = useRef<HTMLElement>(null)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const el = ref.current
      if (!el) return
      const top = el.getBoundingClientRect().top + window.scrollY
      setOffset((window.scrollY - top + window.innerHeight) * 0.3)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section ref={ref} className="flex flex-col gap-3 overflow-hidden border-y border-rule bg-ink py-3" aria-label="Project screenshots">
      {rows.map((row, r) => (
        <div
          key={r}
          className="flex w-max gap-3"
          style={{ transform: `translateX(${r === 0 ? offset - 200 : -(offset - 200)}px)`, willChange: 'transform' }}
        >
          {[...row, ...row, ...row].map((s, i) => (
            <img
              key={i}
              src={s.src}
              alt={i < row.length ? s.alt : ''}
              loading="lazy"
              decoding="async"
              width={420}
              height={263}
              className="h-[160px] w-[256px] shrink-0 object-cover opacity-80 sm:h-[220px] sm:w-[352px]"
            />
          ))}
        </div>
      ))}
    </section>
  )
}
