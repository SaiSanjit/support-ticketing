import {
  AlertCircle,
  AlertTriangle,
  Briefcase,
  CheckCircle2,
  Clock,
  Globe,
  MapPin,
  Timer,
  Users,
  X,
  ExternalLink,
  CalendarClock,
  Tag,
  Activity,
} from 'lucide-react'
import { useEffect, useRef } from 'react'
import type { Ticket } from '../data/tickets'
import Avatar from './Avatar'
import { getPriorityClass, getPriorityRank } from './cardUtils'

interface TicketDialogProps {
  ticket: Ticket | null
  onClose: () => void
}

const priorityGlow: Record<string, string> = {
  Critical: 'radial-gradient(ellipse at 60% 0%, rgba(239,120,104,0.22) 0%, transparent 65%)',
  High:     'radial-gradient(ellipse at 60% 0%, rgba(228,168,94,0.20) 0%, transparent 65%)',
  Medium:   'radial-gradient(ellipse at 60% 0%, rgba(123,159,182,0.18) 0%, transparent 65%)',
  Resolved: 'radial-gradient(ellipse at 60% 0%, rgba(109,180,140,0.18) 0%, transparent 65%)',
}

const statusConfig: Record<string, { icon: React.ReactNode; color: string; bg: string; border: string }> = {
  'Escalated':   { icon: <AlertCircle size={14} />,  color: '#ef7868', bg: 'rgba(239,120,104,0.14)', border: 'rgba(239,120,104,0.28)' },
  'In Progress': { icon: <Clock size={14} />,         color: '#e4a85e', bg: 'rgba(228,168,94,0.14)',  border: 'rgba(228,168,94,0.28)'  },
  'Open':        { icon: <AlertTriangle size={14} />, color: 'var(--text-secondary)', bg: 'var(--surface-soft)', border: 'var(--surface-border)' },
  'Resolved':    { icon: <CheckCircle2 size={14} />,  color: '#6db48c', bg: 'rgba(109,180,140,0.14)', border: 'rgba(109,180,140,0.28)' },
}

function MetaCard({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: string; accent?: boolean }) {
  return (
    <div className="td-meta-card">
      <div className="td-meta-card__icon">{icon}</div>
      <div>
        <div className="td-meta-card__label">{label}</div>
        <div className={`td-meta-card__value${accent ? ' td-meta-card__value--accent' : ''}`}>{value}</div>
      </div>
    </div>
  )
}

export default function TicketDialog({ ticket, onClose }: TicketDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null)

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  // Close on backdrop click
  const onBackdrop = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose()
  }

  // Trap focus inside dialog
  useEffect(() => {
    if (ticket) dialogRef.current?.focus()
  }, [ticket])

  if (!ticket) return null

  const glow = priorityGlow[ticket.priority] ?? priorityGlow['Medium']
  const sc = statusConfig[ticket.status]

  return (
    <div
      className="td-backdrop"
      onClick={onBackdrop}
      role="dialog"
      aria-modal="true"
      aria-label={`Ticket details: ${ticket.title}`}
    >
      <div
        ref={dialogRef}
        className="td-dialog"
        tabIndex={-1}
        style={{ outline: 'none' }}
      >
        {/* Cinematic background layers */}
        <div className="td-dialog__base" />
        <div className="td-dialog__glow" style={{ background: glow }} />
        <div className="td-dialog__noise" />

        {/* Close button */}
        <button className="td-close tv-focusable" onClick={onClose} aria-label="Close dialog">
          <X size={18} />
        </button>

        {/* ── Header ────────────────────────────────────────────────── */}
        <div className="td-header">
          <div className="td-header__left">
            <div className="td-header__kicker">
              <span className="td-header__id">{ticket.id}</span>
              <span className="td-header__kicker-sep" />
              <span className="td-header__category">{ticket.category}</span>
            </div>

            <h2 className="td-header__title">{ticket.title}</h2>

            <div className="td-header__badges">
              <span className={`badge-base ${getPriorityClass(ticket.priority)}`}>
                {getPriorityRank(ticket.priority)} — {ticket.priority}
              </span>
              <span
                className="td-status-pill"
                style={{
                  color: sc.color,
                  background: sc.bg,
                  borderColor: sc.border,
                }}
              >
                {sc.icon}
                {ticket.status}
              </span>
              {ticket.slaBreached && (
                <span className="td-breach-pill">
                  <AlertTriangle size={12} />
                  SLA Breached
                </span>
              )}
            </div>
          </div>

          <div className="td-header__right">
            <div className="td-assignee-tile">
              <div className="td-assignee-tile__label">Assigned Owner</div>
              <div className="td-assignee-tile__body">
                <Avatar name={ticket.assignee} size={52} />
                <div>
                  <div className="td-assignee-tile__name">{ticket.assignee}</div>
                  <div className="td-assignee-tile__client">{ticket.client}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Description ───────────────────────────────────────────── */}
        <div className="td-desc">
          <div className="td-section-label">
            <Activity size={13} />
            Incident Summary
          </div>
          <p className="td-desc__text">{ticket.description}</p>
        </div>

        {/* ── Meta grid ─────────────────────────────────────────────── */}
        <div className="td-meta-grid">
          <MetaCard
            icon={<Briefcase size={15} />}
            label="Project"
            value={ticket.projectName}
          />
          <MetaCard
            icon={<Users size={15} />}
            label="Client"
            value={ticket.client}
          />
          <MetaCard
            icon={<MapPin size={15} />}
            label="Region"
            value={ticket.region}
          />
          <MetaCard
            icon={<Globe size={15} />}
            label="Affected Users"
            value={ticket.affectedUsers > 0 ? ticket.affectedUsers.toLocaleString() : 'Unknown'}
            accent={ticket.affectedUsers > 1000}
          />
          <MetaCard
            icon={<Timer size={15} />}
            label="SLA"
            value={ticket.sla}
            accent={ticket.slaBreached}
          />
          <MetaCard
            icon={<CalendarClock size={15} />}
            label="Opened"
            value={ticket.createdAt}
          />
          {ticket.escalatedAt && (
            <MetaCard
              icon={<AlertCircle size={15} />}
              label="Escalated At"
              value={ticket.escalatedAt}
              accent
            />
          )}
          <MetaCard
            icon={<Tag size={15} />}
            label="Project ID"
            value={ticket.projectId}
          />
        </div>

        {/* ── Timeline (minimal) ────────────────────────────────────── */}
        <div className="td-timeline">
          <div className="td-section-label">
            <Clock size={13} />
            Timeline
          </div>
          <div className="td-timeline__items">
            <div className="td-timeline__item">
              <div className="td-timeline__dot td-timeline__dot--open" />
              <div>
                <div className="td-timeline__event">Ticket opened</div>
                <div className="td-timeline__time">{ticket.createdAt} · {ticket.timeAgo}</div>
              </div>
            </div>
            {ticket.escalatedAt && (
              <div className="td-timeline__item">
                <div className="td-timeline__dot td-timeline__dot--escalated" />
                <div>
                  <div className="td-timeline__event">Escalated</div>
                  <div className="td-timeline__time">{ticket.escalatedAt}</div>
                </div>
              </div>
            )}
            {ticket.status === 'Resolved' && (
              <div className="td-timeline__item">
                <div className="td-timeline__dot td-timeline__dot--resolved" />
                <div>
                  <div className="td-timeline__event">Resolved</div>
                  <div className="td-timeline__time">{ticket.timeAgo}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
