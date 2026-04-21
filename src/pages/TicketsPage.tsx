import {
  AlertCircle,
  AlertTriangle,
  Briefcase,
  CheckCircle2,
  Clock,
  Filter,
  MapPin,
  Timer,
  Users,
} from 'lucide-react'
import { useState } from 'react'
import Avatar from '../components/Avatar'
import { TicketCard } from '../components/Card'
import TicketDialog from '../components/TicketDialog'
import { getPriorityClass, getPriorityRank } from '../components/cardUtils'
import { tickets, type Priority, type Ticket } from '../data/tickets'

type FilterType = 'All' | Priority

const filters: FilterType[] = ['All', 'Critical', 'High', 'Medium', 'Resolved']

// Priority accent colors for the immersive hero
const priorityAccent: Record<string, { glow: string; vignette: string; soft: string; label: string }> = {
  Critical: {
    glow:    'radial-gradient(ellipse at 80% 40%, rgba(239,120,104,0.28) 0%, rgba(239,120,104,0.06) 55%, transparent 80%)',
    vignette:'radial-gradient(ellipse at 72% 30%, rgba(180,60,50,0.18) 0%, transparent 55%)',
    soft:    'rgba(239,120,104,0.12)',
    label:   'Critical Priority',
  },
  High: {
    glow:    'radial-gradient(ellipse at 80% 40%, rgba(228,168,94,0.26) 0%, rgba(228,168,94,0.06) 55%, transparent 80%)',
    vignette:'radial-gradient(ellipse at 72% 30%, rgba(160,110,50,0.18) 0%, transparent 55%)',
    soft:    'rgba(228,168,94,0.12)',
    label:   'High Priority',
  },
  Medium: {
    glow:    'radial-gradient(ellipse at 80% 40%, rgba(123,159,182,0.24) 0%, rgba(123,159,182,0.06) 55%, transparent 80%)',
    vignette:'radial-gradient(ellipse at 72% 30%, rgba(70,110,138,0.18) 0%, transparent 55%)',
    soft:    'rgba(123,159,182,0.12)',
    label:   'Medium Priority',
  },
  Resolved: {
    glow:    'radial-gradient(ellipse at 80% 40%, rgba(109,180,140,0.22) 0%, rgba(109,180,140,0.05) 55%, transparent 80%)',
    vignette:'radial-gradient(ellipse at 72% 30%, rgba(50,120,80,0.14) 0%, transparent 55%)',
    soft:    'rgba(109,180,140,0.1)',
    label:   'Resolved',
  },
}

// Lane header accent colors (for the priority lane rows below the hero)
const laneAccent: Record<string, { color: string; soft: string }> = {
  Critical: { color: 'rgba(239,120,104,0.9)', soft: 'rgba(239,120,104,0.10)' },
  High:     { color: 'rgba(228,168,94,0.9)',  soft: 'rgba(228,168,94,0.10)'  },
  Medium:   { color: 'rgba(123,159,182,0.9)', soft: 'rgba(123,159,182,0.10)' },
  Resolved: { color: 'rgba(109,180,140,0.9)', soft: 'rgba(109,180,140,0.10)' },
}

function StatusBadge({ status }: { status: Ticket['status'] }) {
  const cfg: Record<string, { icon: React.ReactNode; cls: string }> = {
    'Escalated':   { icon: <AlertCircle size={13} />,  cls: 'status-badge--escalated'   },
    'In Progress': { icon: <Clock size={13} />,         cls: 'status-badge--inprogress'  },
    'Open':        { icon: <AlertTriangle size={13} />, cls: 'status-badge--open'        },
    'Resolved':    { icon: <CheckCircle2 size={13} />,  cls: 'status-badge--resolved'    },
  }
  const c = cfg[status]
  return (
    <span className={`status-badge ${c.cls}`}>
      {c.icon}
      {status}
    </span>
  )
}

export default function TicketsPage() {
  const [focusedId, setFocusedId] = useState<Ticket['id']>(tickets[0].id)
  const [activeFilter, setActiveFilter] = useState<FilterType>('All')
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)

  const filteredTickets = tickets.filter((ticket) =>
    activeFilter === 'All' || ticket.priority === activeFilter,
  )

  const focused =
    filteredTickets.find((t) => t.id === focusedId) ??
    tickets.find((t) => t.id === focusedId) ??
    filteredTickets[0] ??
    tickets[0]

  const accent = priorityAccent[focused.priority] ?? priorityAccent['Medium']

  const resolvedTickets = tickets.filter((t) => t.status === 'Resolved')
  const prioritiesForDisplay: Priority[] = ['Critical', 'High', 'Medium']
  const ticketsByPriority = prioritiesForDisplay
    .map((priority) => ({
      priority,
      tickets: filteredTickets.filter((t) => t.priority === priority && t.status !== 'Resolved'),
    }))
    .filter((g) => g.tickets.length > 0)

  return (
    <div className="page-stack tickets-canvas">
      <TicketDialog ticket={selectedTicket} onClose={() => setSelectedTicket(null)} />

      {/* ══════════════════════════════════════════════════════════════
          IMMERSIVE HERO — TV Design Kit "Immersive List" pattern
          Left: ticket metadata & actions  |  Right: cinematic ambient
          ══════════════════════════════════════════════════════════════ */}
      <section className="tkt-hero" aria-label="Ticket spotlight">
        {/* Background layers */}
        <div className="tkt-hero__base" />
        <div
          className="tkt-hero__glow"
          style={{ background: accent.glow }}
        />
        <div
          className="tkt-hero__glow tkt-hero__glow--deep"
          style={{ background: accent.vignette }}
        />
        <div className="tkt-hero__noise" />
        {/* Left-to-right readability vignette */}
        <div className="tkt-hero__vignette" />

        {/* Left column: content */}
        <div className="tkt-hero__left">
          <div className="tkt-hero__content" key={focused.id}>

            {/* Kicker line */}
            <div className="tkt-hero__kicker">
              <span className="tkt-hero__kicker-dot" />
              Ticket Spotlight
              <span className="tkt-hero__kicker-sep" />
              {accent.label}
            </div>

            {/* Title */}
            <h1 className="tkt-hero__title">{focused.title}</h1>

            {/* Description */}
            <p className="tkt-hero__desc">{focused.description}</p>

            {/* ID + Priority + Status chips */}
            <div className="tkt-hero__chips">
              <span className="tkt-hero__id-chip">{focused.id}</span>
              <span className={`badge-base ${getPriorityClass(focused.priority)}`}>
                {getPriorityRank(focused.priority)} — {focused.priority}
              </span>
              <StatusBadge status={focused.status} />
              {focused.slaBreached && (
                <span className="tkt-hero__sla-breach">
                  <AlertTriangle size={12} />
                  SLA Breached
                </span>
              )}
            </div>

            {/* Project + Client row */}
            <div className="tkt-hero__meta-row">
              <div className="tkt-hero__meta-item">
                <Briefcase size={14} style={{ opacity: 0.55 }} />
                <div>
                  <div className="tkt-hero__meta-label">Project</div>
                  <div className="tkt-hero__meta-value">{focused.projectName}</div>
                </div>
              </div>
              <div className="tkt-hero__meta-divider" />
              <div className="tkt-hero__meta-item">
                <Users size={14} style={{ opacity: 0.55 }} />
                <div>
                  <div className="tkt-hero__meta-label">Client</div>
                  <div className="tkt-hero__meta-value">{focused.client}</div>
                </div>
              </div>
              {focused.affectedUsers > 0 && (
                <>
                  <div className="tkt-hero__meta-divider" />
                  <div className="tkt-hero__meta-item">
                    <Users size={14} style={{ opacity: 0.55 }} />
                    <div>
                      <div className="tkt-hero__meta-label">Affected Users</div>
                      <div className="tkt-hero__meta-value">{focused.affectedUsers.toLocaleString()}</div>
                    </div>
                  </div>
                </>
              )}
              <div className="tkt-hero__meta-divider" />
              <div className="tkt-hero__meta-item">
                <MapPin size={14} style={{ opacity: 0.55 }} />
                <div>
                  <div className="tkt-hero__meta-label">Region</div>
                  <div className="tkt-hero__meta-value">{focused.region}</div>
                </div>
              </div>
              <div className="tkt-hero__meta-divider" />
              <div className="tkt-hero__meta-item">
                <Timer size={14} style={{ opacity: 0.55 }} />
                <div>
                  <div className="tkt-hero__meta-label">SLA</div>
                  <div className={`tkt-hero__meta-value${focused.slaBreached ? ' tkt-hero__meta-value--breach' : ''}`}>
                    {focused.sla}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Right column: 4 focused data tiles */}
        <div className="tkt-hero__right">
          {/* Assignee tile */}
          <div className="tkt-stat-tile">
            <div className="tkt-stat-tile__label">Assigned Owner</div>
            <div className="tkt-stat-tile__assignee">
              <Avatar name={focused.assignee} size={36} />
              <div>
                <div className="tkt-stat-tile__name">{focused.assignee}</div>
                <div className="tkt-stat-tile__sub">{focused.client}</div>
              </div>
            </div>
          </div>

          {/* Affected users + SLA row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div className="tkt-stat-tile">
              <div className="tkt-stat-tile__label">Affected</div>
              <div className="tkt-stat-tile__number"
                style={{ color: focused.affectedUsers > 500 ? '#ef7868' : undefined }}>
                {focused.affectedUsers.toLocaleString()}
              </div>
              <div className="tkt-stat-tile__sub">users</div>
            </div>
            <div className="tkt-stat-tile">
              <div className="tkt-stat-tile__label">SLA</div>
              <div className="tkt-stat-tile__number"
                style={{ color: focused.slaBreached ? '#ef7868' : '#6db48c', fontSize: '1rem', letterSpacing: 0 }}>
                {focused.slaBreached ? 'Breached' : 'On Track'}
              </div>
              <div className="tkt-stat-tile__sub">{focused.sla}</div>
            </div>
          </div>

          {/* Category + Volume row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div className="tkt-stat-tile">
              <div className="tkt-stat-tile__label">Category</div>
              <div className="tkt-stat-tile__big">{focused.category}</div>
              <div className="tkt-stat-tile__sub">{focused.region}</div>
            </div>
            <div className="tkt-stat-tile">
              <div className="tkt-stat-tile__label">Queue</div>
              <div className="tkt-stat-tile__number">{filteredTickets.length}</div>
              <div className="tkt-stat-tile__sub">tickets</div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          FILTER BAR
          ══════════════════════════════════════════════════════════════ */}
      <section className="page-section tkt-filter-section">
        <div className="tkt-filter-bar">
          <div className="tkt-filter-bar__left">
            <div className="section-header">
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.68rem',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
              }}>
                Queue Lanes
              </span>
            </div>
          </div>
          <div className="tkt-filter-bar__right">
            <div className="tkt-filter-pills" role="tablist" aria-label="Ticket priority filters">
              {filters.map((filter) => (
                <button
                  key={filter}
                  role="tab"
                  aria-selected={activeFilter === filter}
                  className={`tkt-filter-pill tv-focusable${activeFilter === filter ? ' tkt-filter-pill--active' : ''}`}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>
            <div className="page-eyebrow">
              <Filter size={13} />
              {filteredTickets.length} tickets
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          PRIORITY LANES — immersive horizontal rails
          ══════════════════════════════════════════════════════════════ */}
      {ticketsByPriority.map((group) => {
        const lane = laneAccent[group.priority]
        return (
          <section key={group.priority} className="browse-row browse-row--immersive">
            <div className="ott-lane-header">
              <div>
                <div
                  className="ott-lane-title"
                  style={{ color: lane.color }}
                >
                  {group.priority} Queue
                </div>
              </div>
              <div
                className="ott-lane-count"
                style={{
                  '--lane-title-color': lane.color,
                  '--lane-title-color-soft': lane.soft,
                } as React.CSSProperties}
              >
                {group.tickets.length} tickets
              </div>
            </div>

            <div className="rail rail--ott">
              {group.tickets.map((ticket) => (
                <TicketCard
                  key={ticket.id}
                  ticket={ticket}
                  compact
                  focused={ticket.id === focused.id}
                  onFocus={(t) => setFocusedId(t.id)}
                  onClick={(t) => setSelectedTicket(t)}
                />
              ))}
            </div>
          </section>
        )
      })}

      {/* ══════════════════════════════════════════════════════════════
          RESOLVED LANE
          ══════════════════════════════════════════════════════════════ */}
      <section className="page-section">
        <div className="ott-lane-header">
          <div>
            <div
              className="ott-lane-title"
              style={{
                color: laneAccent['Resolved'].color,
                fontSize: 'clamp(1.2rem, 2vw, 1.6rem)',
              }}
            >
              Recently Stabilized
            </div>
            <div className="ott-lane-subtitle">
              Resolved work remains visible without competing with the active queue.
            </div>
          </div>
          <div
            className="ott-lane-count"
            style={{
              '--lane-title-color': laneAccent['Resolved'].color,
              '--lane-title-color-soft': laneAccent['Resolved'].soft,
            } as React.CSSProperties}
          >
            {resolvedTickets.length} resolved
          </div>
        </div>

        <div className="rail rail--ott">
          {resolvedTickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              compact
              onFocus={(t) => setFocusedId(t.id)}
              onClick={(t) => setSelectedTicket(t)}
            />
          ))}
        </div>
      </section>
    </div>
  )
}
