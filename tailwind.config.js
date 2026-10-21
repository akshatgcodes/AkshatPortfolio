/** @type {import('tailwindcss').Config} */
export default {
  // Stops hover styles sticking after a tap on touch screens.
  future: { hoverOnlyWhenSupported: true },
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      // Visual system: serif display, grotesk body, mono metadata. One accent, no gradients.
      fontFamily: {
        display: ['"Instrument Serif"', 'Georgia', 'serif'],
        sans: ['Geist', 'system-ui', 'sans-serif'],
        mono: ['"Geist Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        ink: '#0B0B0C',
        bone: '#EDEAE3',
        muted: '#8C8982',
        signal: '#FF4F1A',
        rule: 'rgba(237, 234, 227, 0.14)',
      },
      letterSpacing: { label: '0.14em' },
    },
  },
  plugins: [],
}
