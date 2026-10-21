// Each letter is a two-high stack clipped to one line; on hover the stack slides up so a
// copy rolls in from below, letter by letter. The trigger is the nearest link or button, or
// the text itself (see `.roll` in index.css). Screen readers get the plain text once.
// Letters are grouped per word (nowrap) so lines only break at spaces, never mid-word.
export function RollText({ text, className = '' }: { text: string; className?: string }) {
  let i = 0
  return (
    <span className={`roll ${className}`}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text.split(' ').map((word, w) => (
          <span key={w}>
            {w > 0 && ' '}
            <span className="whitespace-nowrap">
              {word.split('').map((c) => {
                const n = i++
                return (
                  <span key={n} className="roll-char" style={{ '--i': n } as React.CSSProperties}>
                    <span>{c}</span>
                    <span>{c}</span>
                  </span>
                )
              })}
            </span>
          </span>
        ))}
      </span>
    </span>
  )
}
