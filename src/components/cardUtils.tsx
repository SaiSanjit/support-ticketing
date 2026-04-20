import { AlertCircle, CheckCircle2, Clock } from 'lucide-react'
import type { Priority, Status } from '../data/tickets'

export const priorityMeta: Record<Priority, { badge: string; tone: string; soft: string; rank: string }> = {
  Critical: {
    badge: 'badge-critical',
    tone: 'var(--status-critical)',
    soft: 'var(--status-critical-soft)',
    rank: 'P1',
  },
  High: {
    badge: 'badge-high',
    tone: 'var(--status-high)',
    soft: 'var(--status-high-soft)',
    rank: 'P2',
  },
  Medium: {
    badge: 'badge-medium',
    tone: 'var(--status-medium)',
    soft: 'var(--status-medium-soft)',
    rank: 'P3',
  },
  Resolved: {
    badge: 'badge-resolved',
    tone: 'var(--status-resolved)',
    soft: 'var(--status-resolved-soft)',
    rank: 'P4',
  },
}

export function getPriorityClass(priority: Priority) {
  return priorityMeta[priority].badge
}

export function getPriorityRank(priority: Priority) {
  return priorityMeta[priority].rank
}

export function getStatusIcon(status: Status) {
  const size = 14

  if (status === 'Escalated') {
    return <AlertCircle size={size} />
  }

  if (status === 'In Progress') {
    return <Clock size={size} />
  }

  if (status === 'Resolved') {
    return <CheckCircle2 size={size} />
  }

  return null
}
