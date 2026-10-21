export type Achievement = {
  award: string
  event: string
  detail: string
  project: string
  projectBlurb: string
  role: string
  team: string
  stack: string[]
  live: string
  repo: string
  images: string[]
}

export const achievements: Achievement[] = [
  {
    award: 'Best Emerging Innovator',
    event: "Aarush '26 Hack Summit 2026",
    detail: '36-hour hackathon',
    project: 'SPARK Engine',
    projectBlurb:
      'A desktop app for talking to your data: connect a CSV or database, ask in plain English, and SPARK writes the SQL, runs it locally and explains the results.',
    role: 'UI design & integration',
    team: "Team Stack Don't Overflow",
    stack: ['Electron', 'Next.js', 'DuckDB', 'Groq', 'Deepgram'],
    live: 'https://spark-engine.tanisheesh.in',
    repo: 'https://github.com/tanisheesh/SPARK-Engine',
    images: ['/projects/spark-1.webp', '/projects/spark-2.webp'],
  },
]
