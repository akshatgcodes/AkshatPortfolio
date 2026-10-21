// Each letter is a two-high stack clipped to one line; on hover the stack slides up so a
// copy rolls in from below, letter by letter. The trigger is the nearest link or button, or
// the text itself (see `.roll` in index.css). Screen readers get the plain text once.
export function RollText({ text, className = '' }: { text: string; className?: string }) {
  return (
    <span className={`roll ${className}`}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text.split('').map((ch, i) => {
          const c = ch === ' ' ? ' ' : ch
          return (
            <span key={i} className="roll-char" style={{ '--i': i } as React.CSSProperties}>
              <span>{c}</span>
              <span>{c}</span>
            </span>
          )
        })}
      </span>
    </span>
  )
}

