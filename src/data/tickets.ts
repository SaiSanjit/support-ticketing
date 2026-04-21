/* Mock Ticket Data */
export type Priority = 'Critical' | 'High' | 'Medium' | 'Resolved'
export type Status = 'Open' | 'In Progress' | 'Resolved' | 'Escalated'
export type TicketCategory =
  | 'Infrastructure'
  | 'Security'
  | 'Authentication'
  | 'Database'
  | 'Network'
  | 'Performance'
  | 'Integration'
  | 'Deployment'
  | 'Storage'
  | 'Monitoring'

export interface Ticket {
  id: string
  title: string
  description: string

  // Ownership
  client: string
  clientId: string
  projectId: string
  projectName: string
  assignee: string
  assigneeAvatar: string

  // Classification
  priority: Priority
  status: Status
  category: TicketCategory

  // Time
  createdAt: string       // e.g. 'Apr 21, 09:42'
  time: string            // legacy field kept
  timeAgo: string
  sla: string             // e.g. '4h remaining' | 'SLA breached'
  slaBreached: boolean

  // Context
  region: string
  affectedUsers: number   // 0 if unknown
  escalatedAt?: string    // only set if Escalated
}

export const tickets: Ticket[] = [
  {
    id: '#ST-201',
    title: 'Database Cluster Unreachable',
    description: 'Primary database cluster is unreachable. Failover attempted but secondary node unresponsive. Immediate action required.',
    client: 'TechVox Corp', clientId: 'c1',
    projectId: 'PRJ-101', projectName: 'Cloud Infra Migration',
    assignee: 'Aiko Tanaka', assigneeAvatar: 'Aiko',
    priority: 'Critical', status: 'Escalated',
    category: 'Database',
    createdAt: 'Apr 21, 09:42', time: '09:42', timeAgo: '2m ago',
    sla: 'SLA breached', slaBreached: true,
    region: 'APAC', affectedUsers: 5200, escalatedAt: 'Apr 21, 09:50',
  },
  {
    id: '#ST-202',
    title: 'Auth Service Latency Spike',
    description: 'Authentication service response time exceeding 8s. Affecting 3,200 active sessions.',
    client: 'Meridian Bank', clientId: 'c2',
    projectId: 'PRJ-102', projectName: 'Core Banking API',
    assignee: 'Carlos Mendez', assigneeAvatar: 'Carlos',
    priority: 'Critical', status: 'In Progress',
    category: 'Authentication',
    createdAt: 'Apr 21, 09:38', time: '09:38', timeAgo: '6m ago',
    sla: '18m remaining', slaBreached: false,
    region: 'EU West', affectedUsers: 3200,
  },
  {
    id: '#ST-206',
    title: 'Access Denied — EU West',
    description: 'Access control regression after last deployment. EU West users unable to access patient records.',
    client: 'Nexus Health', clientId: 'c4',
    projectId: 'PRJ-103', projectName: 'Patient Portal v3',
    assignee: 'Sara Collins', assigneeAvatar: 'Sara',
    priority: 'Critical', status: 'Escalated',
    category: 'Security',
    createdAt: 'Apr 21, 08:30', time: '08:30', timeAgo: '1h ago',
    sla: 'SLA breached', slaBreached: true,
    region: 'EU West', affectedUsers: 1800, escalatedAt: 'Apr 21, 08:55',
  },
  {
    id: '#ST-203',
    title: 'CDN Cache Purge Failed',
    description: 'Scheduled cache purge failed silently. Stale content being served to 14 edge nodes.',
    client: 'TechVox Corp', clientId: 'c1',
    projectId: 'PRJ-101', projectName: 'Cloud Infra Migration',
    assignee: 'Sara Collins', assigneeAvatar: 'Sara',
    priority: 'High', status: 'Open',
    category: 'Infrastructure',
    createdAt: 'Apr 21, 09:21', time: '09:21', timeAgo: '23m ago',
    sla: '1h 37m remaining', slaBreached: false,
    region: 'US East', affectedUsers: 0,
  },
  {
    id: '#ST-204',
    title: 'System Slowdown — North Region',
    description: 'System-wide slowdown impacting warehouse operations. CPU utilization at 94%.',
    client: 'Atlas Logistics', clientId: 'c3',
    projectId: 'PRJ-104', projectName: 'WMS Platform',
    assignee: 'Aiko Tanaka', assigneeAvatar: 'Aiko',
    priority: 'High', status: 'In Progress',
    category: 'Performance',
    createdAt: 'Apr 21, 09:05', time: '09:05', timeAgo: '39m ago',
    sla: '1h 21m remaining', slaBreached: false,
    region: 'North', affectedUsers: 640,
  },
  {
    id: '#ST-209',
    title: 'SSL Certificate Renewal',
    description: 'Wildcard SSL cert expires in 36 hours. Auto-renewal failed twice. Manual renewal required.',
    client: 'StreamPeak', clientId: 'c5',
    projectId: 'PRJ-105', projectName: 'Streaming CDN',
    assignee: 'Aiko Tanaka', assigneeAvatar: 'Aiko',
    priority: 'High', status: 'Open',
    category: 'Security',
    createdAt: 'Apr 21, 05:00', time: '05:00', timeAgo: '5h ago',
    sla: '36h remaining', slaBreached: false,
    region: 'Global', affectedUsers: 0,
  },
  {
    id: '#ST-211',
    title: 'Email Delivery Failure',
    description: 'Transactional email provider reporting delivery failures. ~800 notification emails queued.',
    client: 'TechVox Corp', clientId: 'c1',
    projectId: 'PRJ-106', projectName: 'Notification Service',
    assignee: 'Carlos Mendez', assigneeAvatar: 'Carlos',
    priority: 'High', status: 'Open',
    category: 'Integration',
    createdAt: 'Apr 21, 03:15', time: '03:15', timeAgo: '7h ago',
    sla: '53m remaining', slaBreached: false,
    region: 'Global', affectedUsers: 800,
  },
  {
    id: '#ST-212',
    title: 'Disk I/O Alert',
    description: 'Disk I/O wait exceeding threshold on primary app server. RAID rebuild possibly triggered.',
    client: 'Atlas Logistics', clientId: 'c3',
    projectId: 'PRJ-104', projectName: 'WMS Platform',
    assignee: 'Luis Park', assigneeAvatar: 'Luis',
    priority: 'High', status: 'In Progress',
    category: 'Storage',
    createdAt: 'Apr 21, 02:00', time: '02:00', timeAgo: '8h ago',
    sla: '4h remaining', slaBreached: false,
    region: 'North', affectedUsers: 0,
  },
  {
    id: '#ST-205',
    title: 'Login Issues — Global',
    description: 'Intermittent login failures affecting ~12% of users globally. Root cause under investigation.',
    client: 'Meridian Bank', clientId: 'c2',
    projectId: 'PRJ-102', projectName: 'Core Banking API',
    assignee: 'Luis Park', assigneeAvatar: 'Luis',
    priority: 'Medium', status: 'In Progress',
    category: 'Authentication',
    createdAt: 'Apr 21, 08:50', time: '08:50', timeAgo: '54m ago',
    sla: '3h 6m remaining', slaBreached: false,
    region: 'Global', affectedUsers: 1400,
  },
  {
    id: '#ST-207',
    title: 'Scheduled Backup Missed',
    description: 'Nightly backup job failed to run. Last successful backup: 48h ago. Risk assessment required.',
    client: 'Atlas Logistics', clientId: 'c3',
    projectId: 'PRJ-104', projectName: 'WMS Platform',
    assignee: 'Carlos Mendez', assigneeAvatar: 'Carlos',
    priority: 'Medium', status: 'Open',
    category: 'Infrastructure',
    createdAt: 'Apr 21, 07:00', time: '07:00', timeAgo: '3h ago',
    sla: '1h remaining', slaBreached: false,
    region: 'US Central', affectedUsers: 0,
  },
  {
    id: '#ST-208',
    title: 'API Rate Limit Breach',
    description: 'Third-party payment API returning 429s. Retry logic exhausted. Manual override pending approval.',
    client: 'StreamPeak', clientId: 'c5',
    projectId: 'PRJ-105', projectName: 'Streaming CDN',
    assignee: 'Luis Park', assigneeAvatar: 'Luis',
    priority: 'Medium', status: 'Open',
    category: 'Integration',
    createdAt: 'Apr 21, 06:14', time: '06:14', timeAgo: '4h ago',
    sla: '2h remaining', slaBreached: false,
    region: 'APAC', affectedUsers: 0,
  },
  {
    id: '#ST-213',
    title: 'Memory Leak in Service Worker',
    description: 'Service worker consuming 1.2GB RAM over 24h period. Restart temporary fix applied.',
    client: 'StreamPeak', clientId: 'c5',
    projectId: 'PRJ-105', projectName: 'Streaming CDN',
    assignee: 'Aiko Tanaka', assigneeAvatar: 'Aiko',
    priority: 'Medium', status: 'Open',
    category: 'Performance',
    createdAt: 'Apr 21, 01:30', time: '01:30', timeAgo: '9h ago',
    sla: 'SLA breached', slaBreached: true,
    region: 'Global', affectedUsers: 0,
  },
  {
    id: '#ST-214',
    title: 'User Import Batch Stuck',
    description: 'CSV import job of 4,400 users stuck at 78%. Worker process appears deadlocked.',
    client: 'Nexus Health', clientId: 'c4',
    projectId: 'PRJ-103', projectName: 'Patient Portal v3',
    assignee: 'Carlos Mendez', assigneeAvatar: 'Carlos',
    priority: 'Medium', status: 'Open',
    category: 'Infrastructure',
    createdAt: 'Apr 21, 00:45', time: '00:45', timeAgo: '10h ago',
    sla: 'SLA breached', slaBreached: true,
    region: 'EU West', affectedUsers: 4400,
  },
  {
    id: '#ST-210',
    title: 'Dashboard Load Degradation',
    description: 'Analytics dashboard taking 12s to load. Resolved: removed un-indexed aggregate query.',
    client: 'Nexus Health', clientId: 'c4',
    projectId: 'PRJ-103', projectName: 'Patient Portal v3',
    assignee: 'Sara Collins', assigneeAvatar: 'Sara',
    priority: 'Resolved', status: 'Resolved',
    category: 'Performance',
    createdAt: 'Apr 21, 04:20', time: '04:20', timeAgo: '6h ago',
    sla: 'Resolved on time', slaBreached: false,
    region: 'EU West', affectedUsers: 0,
  },
  {
    id: '#ST-215',
    title: 'DNS Propagation Delay',
    description: 'DNS propagation for new subdomain took 11h. Resolved once TTL elapsed across all resolvers.',
    client: 'Meridian Bank', clientId: 'c2',
    projectId: 'PRJ-102', projectName: 'Core Banking API',
    assignee: 'Sara Collins', assigneeAvatar: 'Sara',
    priority: 'Resolved', status: 'Resolved',
    category: 'Network',
    createdAt: 'Apr 20, 15:00', time: 'Yesterday', timeAgo: '18h ago',
    sla: 'Resolved on time', slaBreached: false,
    region: 'Global', affectedUsers: 0,
  },
]

export const urgentTickets = tickets.filter(t => t.priority === 'Critical' || t.priority === 'High')
