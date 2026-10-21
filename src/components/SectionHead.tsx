import { FadeIn } from './FadeIn'
import { RollText } from './RollText'

// Every section opens on the grid: a hairline rule, a mono index in the left columns and a
// left-aligned serif title, with an optional italic word for emphasis.
export function SectionHead({ index, label, title, accent, light = false }: { index: string; label: string; title: string; accent?: string; light?: boolean }) {
  return (
    <div className={`mb-14 grid grid-cols-12 gap-x-6 border-t pt-5 sm:mb-20 md:mb-24 ${light ? 'border-ink/20' : 'border-rule'}`}>
      <FadeIn as="p" y={10} className={`label col-span-12 mb-6 md:col-span-3 md:mb-0 ${light ? 'text-ink/60' : 'text-muted'}`}>
        {index} — {label}
      </FadeIn>
      <FadeIn as="h2" y={30} delay={0.05} className="display col-span-12 md:col-span-9" >
        <span style={{ fontSize: 'clamp(3rem, 7.5vw, 120px)' }}>
          <RollText text={title} />
          {accent && (
            <>
              {' '}
              <em className="text-signal">
                <RollText text={accent} />
              </em>
            </>
          )}
        </span>
      </FadeIn>
    </div>
  )
}
