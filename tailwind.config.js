/** @type {import('tailwindcss').Config} */
export default {
  // Stops hover styles sticking after a tap on touch screens.
  future: { hoverOnlyWhenSupported: true },
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Kanit', 'sans-serif'] },
      colors: { ink: '#0C0C0C', mist: '#D7E2EA' },
    },
  },
  plugins: [],
}
