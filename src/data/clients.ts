/* Mock Client Data */
export interface Client {
  id: string
  name: string
  industry: string
  projects: number
  openTickets: number
  criticalCount: number
  slaCompliance: string
  resolvedThisWeek: number
  totalTickets: number
  region: string
  contactName: string
  contactRole: string
  avatarSeed: string
  since: string
}

export const clients: Client[] = [
  { id: 'c1', name: 'TechVox Corp', industry: 'Technology', projects: 6, openTickets: 4, criticalCount: 1, slaCompliance: '94%', resolvedThisWeek: 12, totalTickets: 48, region: 'US East', contactName: 'Rachel Kim', contactRole: 'VP Engineering', avatarSeed: 'Rachel', since: 'Jan 2022' },
  { id: 'c2', name: 'Meridian Bank', industry: 'Financial Services', projects: 4, openTickets: 3, criticalCount: 2, slaCompliance: '98%', resolvedThisWeek: 9, totalTickets: 61, region: 'EU West', contactName: 'David Osei', contactRole: 'CTO', avatarSeed: 'David', since: 'Mar 2021' },
  { id: 'c3', name: 'Atlas Logistics', industry: 'Supply Chain', projects: 5, openTickets: 3, criticalCount: 0, slaCompliance: '91%', resolvedThisWeek: 7, totalTickets: 34, region: 'US Central', contactName: 'Maria Santos', contactRole: 'IT Director', avatarSeed: 'Maria', since: 'Jun 2023' },
  { id: 'c4', name: 'Nexus Health', industry: 'Healthcare', projects: 3, openTickets: 4, criticalCount: 1, slaCompliance: '99%', resolvedThisWeek: 6, totalTickets: 27, region: 'EU West', contactName: 'James Adeyemi', contactRole: 'Head of Infrastructure', avatarSeed: 'James', since: 'Sep 2022' },
  { id: 'c5', name: 'StreamPeak', industry: 'Media & Streaming', projects: 7, openTickets: 3, criticalCount: 0, slaCompliance: '88%', resolvedThisWeek: 14, totalTickets: 52, region: 'APAC', contactName: 'Yuna Park', contactRole: 'DevOps Lead', avatarSeed: 'Yuna', since: 'Nov 2023' },
]
