/* Mock Ticket Data */
export type Priority = 'Critical' | 'High' | 'Medium' | 'Resolved'
export type Status = 'Open' | 'In Progress' | 'Resolved' | 'Escalated'

export interface Ticket {
  id: string
  title: string
  client: string
  clientId: string
  priority: Priority
  status: Status
  assignee: string
  assigneeAvatar: string
  time: string
  timeAgo: string
  region: string
  description: string
}

export const tickets: Ticket[] = [
  { id: '#ST-201', title: 'Database Cluster Unreachable', client: 'TechVox Corp', clientId: 'c1', priority: 'Critical', status: 'Escalated', assignee: 'Aiko Tanaka', assigneeAvatar: 'Aiko', time: '09:42', timeAgo: '2m ago', region: 'APAC', description: 'Primary database cluster is unreachable. Failover attempted but secondary node unresponsive. Immediate action required.' },
  { id: '#ST-202', title: 'Auth Service Latency Spike', client: 'Meridian Bank', clientId: 'c2', priority: 'Critical', status: 'In Progress', assignee: 'Carlos Mendez', assigneeAvatar: 'Carlos', time: '09:38', timeAgo: '6m ago', region: 'EU West', description: 'Authentication service response time exceeding 8s. Affecting 3,200 active sessions.' },
  { id: '#ST-203', title: 'CDN Cache Purge Failed', client: 'TechVox Corp', clientId: 'c1', priority: 'High', status: 'Open', assignee: 'Sara Collins', assigneeAvatar: 'Sara', time: '09:21', timeAgo: '23m ago', region: 'US East', description: 'Scheduled cache purge failed silently. Stale content being served to 14 edge nodes.' },
  { id: '#ST-204', title: 'System Slowdown — North Region', client: 'Atlas Logistics', clientId: 'c3', priority: 'High', status: 'In Progress', assignee: 'Aiko Tanaka', assigneeAvatar: 'Aiko', time: '09:05', timeAgo: '39m ago', region: 'North', description: 'System-wide slowdown impacting warehouse operations. CPU utilization at 94%.' },
  { id: '#ST-205', title: 'Login Issues — Global', client: 'Meridian Bank', clientId: 'c2', priority: 'Medium', status: 'In Progress', assignee: 'Luis Park', assigneeAvatar: 'Luis', time: '08:50', timeAgo: '54m ago', region: 'Global', description: 'Intermittent login failures affecting ~12% of users globally. Root cause under investigation.' },
  { id: '#ST-206', title: 'Access Denied — EU West', client: 'Nexus Health', clientId: 'c4', priority: 'Critical', status: 'Escalated', assignee: 'Sara Collins', assigneeAvatar: 'Sara', time: '08:30', timeAgo: '1h ago', region: 'EU West', description: 'Access control regression after last deployment. EU West users unable to access patient records.' },
  { id: '#ST-207', title: 'Scheduled Backup Missed', client: 'Atlas Logistics', clientId: 'c3', priority: 'Medium', status: 'Open', assignee: 'Carlos Mendez', assigneeAvatar: 'Carlos', time: '07:00', timeAgo: '3h ago', region: 'US Central', description: 'Nightly backup job failed to run. Last successful backup: 48h ago. Risk assessment required.' },
  { id: '#ST-208', title: 'API Rate Limit Breach', client: 'StreamPeak', clientId: 'c5', priority: 'Medium', status: 'Open', assignee: 'Luis Park', assigneeAvatar: 'Luis', time: '06:14', timeAgo: '4h ago', region: 'APAC', description: 'Third-party payment API returning 429s. Retry logic exhausted. Manual override pending approval.' },
  { id: '#ST-209', title: 'SSL Certificate Renewal', client: 'StreamPeak', clientId: 'c5', priority: 'High', status: 'Open', assignee: 'Aiko Tanaka', assigneeAvatar: 'Aiko', time: '05:00', timeAgo: '5h ago', region: 'Global', description: 'Wildcard SSL cert expires in 36 hours. Auto-renewal failed twice. Manual renewal required.' },
  { id: '#ST-210', title: 'Dashboard Load Degradation', client: 'Nexus Health', clientId: 'c4', priority: 'Medium', status: 'Resolved', assignee: 'Sara Collins', assigneeAvatar: 'Sara', time: '04:20', timeAgo: '6h ago', region: 'EU West', description: 'Analytics dashboard taking 12s to load. Resolved: removed un-indexed aggregate query.' },
  { id: '#ST-211', title: 'Email Delivery Failure', client: 'TechVox Corp', clientId: 'c1', priority: 'High', status: 'Open', assignee: 'Carlos Mendez', assigneeAvatar: 'Carlos', time: '03:15', timeAgo: '7h ago', region: 'Global', description: 'Transactional email provider reporting delivery failures. ~800 notification emails queued.' },
  { id: '#ST-212', title: 'Disk I/O Alert', client: 'Atlas Logistics', clientId: 'c3', priority: 'High', status: 'In Progress', assignee: 'Luis Park', assigneeAvatar: 'Luis', time: '02:00', timeAgo: '8h ago', region: 'North', description: 'Disk I/O wait exceeding threshold on primary app server. RAID rebuild possibly triggered.' },
  { id: '#ST-213', title: 'Memory Leak in Service Worker', client: 'StreamPeak', clientId: 'c5', priority: 'Medium', status: 'Open', assignee: 'Aiko Tanaka', assigneeAvatar: 'Aiko', time: '01:30', timeAgo: '9h ago', region: 'Global', description: 'Service worker consuming 1.2GB RAM over 24h period. Restart temporary fix applied.' },
  { id: '#ST-214', title: 'User Import Batch Stuck', client: 'Nexus Health', clientId: 'c4', priority: 'Medium', status: 'Open', assignee: 'Carlos Mendez', assigneeAvatar: 'Carlos', time: '00:45', timeAgo: '10h ago', region: 'EU West', description: 'CSV import job of 4,400 users stuck at 78%. Worker process appears deadlocked.' },
  { id: '#ST-215', title: 'DNS Propagation Delay', client: 'Meridian Bank', clientId: 'c2', priority: 'Resolved', status: 'Resolved', assignee: 'Sara Collins', assigneeAvatar: 'Sara', time: 'Yesterday', timeAgo: '18h ago', region: 'Global', description: 'DNS propagation for new subdomain took 11h. Resolved once TTL elapsed across all resolvers.' },
]

export const urgentTickets = tickets.filter(t => t.priority === 'Critical' || t.priority === 'High')
