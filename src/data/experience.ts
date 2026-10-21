export type Experience = {
  role: string
  company: string
  dates: string
  mode: string
  summary: string
}

// Newest first.
export const experience: Experience[] = [
  {
    role: 'iOS & AI Engineering Intern',
    company: 'BizCareerChaos',
    dates: 'Sep 2026 – Present',
    mode: 'Remote · Hyderabad',
    summary:
      'Developing iOS applications and AI features, turning client and business requirements into working solutions. Hands-on with API integration, testing, debugging and end-to-end product delivery.',
  },
  {
    role: 'Web Development Intern',
    company: 'Ananta Cloud LLP',
    dates: 'Dec 2025 – Jan 2026',
    mode: 'Hybrid',
    summary:
      "Built and enhanced production web applications and helped take the company's official website live, working through deployment and production workflows with the team.",
  },
  {
    role: 'Data Analyst Intern',
    company: 'OutworX Solutions',
    dates: 'Jun 2025 – Jul 2025',
    mode: 'Hybrid',
    summary:
      'Analysed RFID-based smart parking solutions and market needs, ran competitor research, qualified leads from prospect data and presented product demos to prospective clients.',
  },
]
