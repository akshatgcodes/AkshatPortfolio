export type SkillGroup = {
  name: string
  blurb: string
  items: string[]
}

export const skills: SkillGroup[] = [
  {
    name: 'Backend',
    blurb: 'Routing, auth, application logic and the APIs everything else talks to.',
    items: ['Flask', 'FastAPI', 'Node.js', 'Express', 'SQLAlchemy', 'REST APIs', 'Socket.IO'],
  },
  {
    name: 'Frontend',
    blurb: 'Responsive interfaces built from reusable components, wired to real backends.',
    items: ['React', 'Next.js', 'Vite', 'Tailwind CSS', 'HTML', 'CSS'],
  },
  {
    name: 'Databases',
    blurb: 'Schema design, querying and persistence that holds up under real use.',
    items: ['PostgreSQL', 'MongoDB', 'SQLite', 'SQL'],
  },
  {
    name: 'Languages',
    blurb: 'Python for most things, TypeScript on the web, C when it has to be close to the metal.',
    items: ['Python', 'TypeScript', 'JavaScript', 'SQL', 'C', 'C++'],
  },
  {
    name: 'Ship it',
    blurb: 'Version control, CI and deploys, from a local branch to a live URL.',
    items: ['Git', 'GitHub Actions', 'Vercel', 'Render', 'Docker'],
  },
]
