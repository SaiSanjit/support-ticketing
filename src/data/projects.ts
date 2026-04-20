

export type ProjectStatus = 'Planning' | 'Active' | 'At Risk' | 'Completed'

export interface Project {
  id: string
  clientId: string
  clientName: string
  title: string
  description: string
  status: ProjectStatus
  progress: number // 0 to 100
  budgetUsed: number // percentage 0 to 100
  team: string[] // assignee names mapped to team.ts
  accentColor: string
  startDate: string
  endDate: string
}

export const projects: Project[] = [
  {
    id: 'PRJ-101',
    clientId: 'CL-001',
    clientName: 'NovaTech Fin',
    title: 'Core Banking API Migration',
    description: 'Transitioning the legacy monolithic architecture into a resilient, globally distributed microservices mesh. Currently tracking slightly behind schedule due to legacy auth dependencies.',
    status: 'At Risk',
    progress: 42,
    budgetUsed: 65,
    team: ['Carlos M.', 'Sarah K.', 'David L.'],
    accentColor: '#EF7868', // Critical-esque coral
    startDate: 'Jan 15, 2026',
    endDate: 'Jul 30, 2026',
  },
  {
    id: 'PRJ-102',
    clientId: 'CL-002',
    clientName: 'Nexus Retail',
    title: 'Global E-Commerce Omnichannel',
    description: 'Unified inventory and point-of-sale synchronization platform. Phased rollout across Europe and North America currently executing flawlessly.',
    status: 'Active',
    progress: 78,
    budgetUsed: 72,
    team: ['Priya S.', 'Elena R.'],
    accentColor: '#7B9FB6', // Medium blue
    startDate: 'Nov 01, 2025',
    endDate: 'May 15, 2026',
  },
  {
    id: 'PRJ-103',
    clientId: 'CL-003',
    clientName: 'Aero Dynamics',
    title: 'Flight Telemetry Dashboard',
    description: 'High-frequency data ingestion engine visualizing real-time metrics across the active fleet. In final extensive QA testing.',
    status: 'Active',
    progress: 94,
    budgetUsed: 88,
    team: ['Alex J.', 'Marcus T.', 'Sarah K.'],
    accentColor: '#E4A85E', // High amber
    startDate: 'Dec 10, 2025',
    endDate: 'Apr 25, 2026',
  },
  {
    id: 'PRJ-104',
    clientId: 'CL-004',
    clientName: 'Zenith Logistics',
    title: 'AI Route Optimization Model',
    description: 'Next-generation machine learning predictive routing to minimize idle times. Initial model training complete, preparing for beta launch in selected cities.',
    status: 'Planning',
    progress: 15,
    budgetUsed: 20,
    team: ['David L.', 'Elena R.'],
    accentColor: '#6DB48C', // Resolved green
    startDate: 'Mar 01, 2026',
    endDate: 'Dec 01, 2026',
  },
  {
    id: 'PRJ-105',
    clientId: 'CL-001',
    clientName: 'NovaTech Fin',
    title: 'Biometric Authentication PoC',
    description: 'Proof of concept for zero-trust physical biometric checkpoints integrated with existing access controllers.',
    status: 'Completed',
    progress: 100,
    budgetUsed: 95,
    team: ['Carlos M.', 'Alex J.'],
    accentColor: '#5B8194', // Standard interface blue
    startDate: 'Sep 10, 2025',
    endDate: 'Jan 20, 2026',
  }
]
