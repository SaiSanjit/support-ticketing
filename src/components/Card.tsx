import { AlertCircle, AlertTriangle, Briefcase, CheckCircle2, Clock, Timer } from 'lucide-react'
import type { ReactNode } from 'react'
import type { Ticket } from '../data/tickets'
import Avatar from './Avatar'
import { getPriorityClass, getPriorityRank, priorityMeta } from './cardUtils'

interface TicketCardProps {
  ticket: Ticket
  onFocus?: (ticket: Ticket) => void
  onClick?: (ticket: Ticket) => void
  focused?: boolean
  compact?: boolean
}

export function TicketCard({ ticket, onFocus, onClick, focused, compact }: TicketCardProps) {
  const meta = priorityMeta[ticket.priority]
  const isResolved = ticket.priority === 'Resolved'
  const isEscalated = ticket.status === 'Escalated'

  return (
    <div
      tabIndex={0}
      className={`tv-ticket-card tv-focusable${focused ? ' tv-ticket-card--focused' : ''}`}
      onFocus={() => onFocus?.(ticket)}
      onMouseEnter={() => onFocus?.(ticket)}
      onClick={() => onClick?.(ticket)}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.(ticket)}
      role="button"
      aria-label={`Ticket ${ticket.id}: ${ticket.title}`}
      style={{
        '--card-accent': meta.tone,
        '--card-soft': meta.soft,
      } as React.CSSProperties}
    >
      {/* Ambient gradient behind content */}
      <div className="tv-ticket-card__glow" />

      {/* Top row: ID + priority badge */}
      <div className="tv-ticket-card__header">
        <span className="tv-ticket-card__id">{ticket.id}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {isEscalated && (
            <AlertCircle size={13} style={{ color: 'var(--status-critical)', opacity: 0.85 }} />
          )}
          <span className={`badge-base ${getPriorityClass(ticket.priority)}`}>
            {meta.rank}
          </span>
        </div>
      </div>

      {/* Title only — description lives in the immersive hero */}
      <div className="tv-ticket-card__body">
        <h3 className="tv-ticket-card__title">{ticket.title}</h3>
      </div>

      {/* Project + Category row */}
      <div className="tv-ticket-card__project">
        <Briefcase size={11} style={{ opacity: 0.5, flexShrink: 0 }} />
        <span className="tv-ticket-card__project-name">{ticket.projectName}</span>
        <span className="tv-ticket-card__dot">·</span>
        <span className="tv-ticket-card__category">{ticket.category}</span>
      </div>

      {/* SLA row */}
      <div className={`tv-ticket-card__sla${ticket.slaBreached ? ' tv-ticket-card__sla--breached' : ''}`}>
        {ticket.slaBreached
          ? <AlertTriangle size={11} style={{ flexShrink: 0 }} />
          : isResolved
            ? <CheckCircle2 size={11} style={{ flexShrink: 0 }} />
            : <Timer size={11} style={{ flexShrink: 0 }} />
        }
        <span>{ticket.sla}</span>
        <span className="tv-ticket-card__dot">·</span>
        <span>{ticket.region}</span>
        <span className="tv-ticket-card__dot">·</span>
        <span>{ticket.timeAgo}</span>
      </div>

      {/* Footer: assignee + status */}
      <div className="tv-ticket-card__footer">
        <div className="tv-ticket-card__assignee">
          <Avatar name={ticket.assignee} size={compact ? 28 : 30} />
          <div className="tv-ticket-card__assignee-info">
            <div className="tv-ticket-card__assignee-name">{ticket.assignee}</div>
            <div className="tv-ticket-card__client">{ticket.client}</div>
          </div>
        </div>
        <div className={`tv-ticket-card__status${ticket.status === 'Escalated' ? ' tv-ticket-card__status--escalated' : ticket.status === 'Resolved' ? ' tv-ticket-card__status--resolved' : ''}`}>
          {ticket.status === 'Escalated' && <AlertCircle size={12} />}
          {ticket.status === 'In Progress' && <Clock size={12} />}
          {ticket.status === 'Resolved' && <CheckCircle2 size={12} />}
          <span>{ticket.status}</span>
        </div>
      </div>
    </div>
  )
}


interface KpiCardProps {
  label: string
  value: string | number
  delta?: string
  icon?: ReactNode
  accent?: string
}

export function KpiCard({ label, value, delta, icon, accent }: KpiCardProps) {
  const isPositive = delta?.startsWith('+')

  return (
    <div
      tabIndex={0}
      className="tv-focusable"
      style={{
        minWidth: 'var(--kpi-card-min-width)',
        minHeight: 'var(--kpi-card-min-height)',
        padding: '20px',
        borderRadius: 22,
        position: 'relative',
        overflow: 'hidden',
        background: 'var(--surface-background)',
        border: '1px solid var(--surface-border)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at top right, ${accent ?? 'var(--sky)'}, transparent 34%)`,
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {icon ? (
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 16,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 18,
              background: accent ?? 'var(--sky)',
              color: 'var(--text-primary)',
            }}
          >
            {icon}
          </div>
        ) : null}

        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          {label}
        </div>

        <div style={{ display: 'flex', alignItems: 'end', gap: 10, marginTop: 10 }}>
          <span style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, fontFamily: 'var(--font-display)' }}>{value}</span>
          {delta ? (
            <span style={{ fontSize: 'var(--text-xs)', color: isPositive ? 'var(--status-resolved)' : 'var(--status-critical)', marginBottom: 6 }}>
              {delta}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  )
}

interface FeaturedCardProps {
  ticket: Ticket
  isActive?: boolean
  onFocus?: () => void
}

export function FeaturedCard({ ticket, isActive, onFocus }: FeaturedCardProps) {
  return (
    <div
      tabIndex={0}
      className="tv-focusable"
      onFocus={onFocus}
      role="button"
      style={{
        width: 'var(--featured-card-width)',
        minHeight: 'var(--featured-card-min-height)',
        padding: 'var(--featured-card-padding)',
        borderRadius: 26,
        background: 'var(--surface-background)',
        border: '1px solid var(--surface-border)',
        boxShadow: isActive ? 'var(--shadow-md)' : 'var(--shadow-card)',
        transform: isActive ? 'translateY(-2px)' : 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      <span className={`badge-base ${getPriorityClass(ticket.priority)}`}>{getPriorityRank(ticket.priority)}</span>
      <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 800 }}>{ticket.title}</h3>
      <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{ticket.description}</p>
      <div style={{ marginTop: 'auto', color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>{ticket.client}</div>
    </div>
  )
}
