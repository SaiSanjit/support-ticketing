/* Mock Team Data */
export interface TeamMember {
  id: string
  name: string
  role: string
  avatarSeed: string
  status: 'Available' | 'Busy' | 'Away'
  openTickets: number
  resolvedToday: number
  specialization: string
}

export const team: TeamMember[] = [
  { id: 't1', name: 'Aiko Tanaka', role: 'Senior SRE', avatarSeed: 'Aiko', status: 'Busy', openTickets: 3, resolvedToday: 4, specialization: 'Database & Storage' },
  { id: 't2', name: 'Carlos Mendez', role: 'Infrastructure Lead', avatarSeed: 'Carlos', status: 'Available', openTickets: 3, resolvedToday: 2, specialization: 'Network & CDN' },
  { id: 't3', name: 'Sara Collins', role: 'Senior Support Engineer', avatarSeed: 'Sara', status: 'Busy', openTickets: 3, resolvedToday: 5, specialization: 'Security & Access' },
  { id: 't4', name: 'Luis Park', role: 'DevOps Engineer', avatarSeed: 'Luis', status: 'Available', openTickets: 2, resolvedToday: 3, specialization: 'CI/CD & Automation' },
  { id: 't5', name: 'Diana Reyes', role: 'Support Engineer', avatarSeed: 'Diana', status: 'Away', openTickets: 0, resolvedToday: 1, specialization: 'Application Layer' },
  { id: 't6', name: 'Omar Hassan', role: 'On-Call Engineer', avatarSeed: 'Omar', status: 'Available', openTickets: 1, resolvedToday: 2, specialization: 'Incident Response' },
]
