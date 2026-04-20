import { Filter } from 'lucide-react'
import { useState } from 'react'
import Avatar from '../components/Avatar'
import { TicketCard } from '../components/Card'
import { getPriorityClass, getPriorityRank } from '../components/cardUtils'
import { tickets, type Priority, type Ticket } from '../data/tickets'

type FilterType = 'All' | Priority

const filters: FilterType[] = ['All', 'Critical', 'High', 'Medium', 'Resolved']

const priorityAccent: Record<string, { color: string; soft: string }> = {
  Critical: { color: 'rgba(239,120,104,0.22)', soft: 'rgba(239,120,104,0.10)' },
  High:     { color: 'rgba(228,168,94,0.22)', soft: 'rgba(228,168,94,0.10)' },
  Medium:   { color: 'rgba(123,159,182,0.22)', soft: 'rgba(123,159,182,0.10)' },
  Resolved: { color: 'rgba(109,180,140,0.22)', soft: 'rgba(109,180,140,0.10)' },
}

export default function TicketsPage() {
  const [focusedId, setFocusedId] = useState<Ticket['id']>(tickets[0].id)
  const [activeFilter, setActiveFilter] = useState<FilterType>('All')

  const filteredTickets = tickets.filter((ticket) => {
    return activeFilter === 'All' || ticket.priority === activeFilter
  })

  const focused =
    filteredTickets.find((ticket) => ticket.id === focusedId) ??
    tickets.find((ticket) => ticket.id === focusedId) ??
    filteredTickets[0] ??
    tickets[0]
  const resolvedTickets = tickets.filter((ticket) => ticket.status === 'Resolved')
  const prioritiesForDisplay: Priority[] = ['Critical', 'High', 'Medium']
  const ticketsByPriority = prioritiesForDisplay
    .map((priority) => ({
      priority,
      tickets: filteredTickets.filter((ticket) => ticket.priority === priority && ticket.status !== 'Resolved'),
    }))
    .filter((group) => group.tickets.length > 0)

  const accent = priorityAccent[focused.priority] ?? priorityAccent['Medium']

  return (
    <div className="page-stack tickets-canvas" style={{ '--page-ambient': accent.soft } as React.CSSProperties}>
      <section
        className="immersive-board"
        style={{
          '--il-accent': accent.color,
          '--il-accent-soft': accent.soft,
        } as React.CSSProperties}
      >
        <article className="immersive-preview">
          <div key={focused.id} className="immersive-preview-copy">
            <div className="immersive-kicker">Ticket spotlight</div>
            <h1 className="immersive-title">{focused.title}</h1>
            <p className="immersive-subtitle">{focused.description}</p>
            <div className="immersive-meta">
              <span className="signal-pill">{focused.id}</span>
              <span className={`badge-base ${getPriorityClass(focused.priority)}`}>{getPriorityRank(focused.priority)}</span>
              <span className="signal-pill">{focused.region}</span>
              <span className="signal-pill">{focused.timeAgo}</span>
            </div>
          </div>

          <div className="immersive-meta">
            <span className="meta-pill">{focused.client}</span>
            <span className="meta-pill">{focused.assignee}</span>
            <span className="meta-pill">{focused.status}</span>
          </div>
        </article>

        <div className="immersive-side">
          <article className="summary-tile">
            <div className="summary-label">Assigned owner</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 14 }}>
              <Avatar name={focused.assignee} size={44} />
              <div>
                <div style={{ fontWeight: 800, fontSize: 'var(--text-lg)' }}>{focused.assignee}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>{focused.status}</div>
              </div>
            </div>
          </article>
          <article className="summary-tile">
            <div className="summary-label">Filtered volume</div>
            <div className="summary-value">{filteredTickets.length}</div>
            <div className="summary-copy">Tickets currently visible in the filtered board.</div>
          </article>
        </div>
      </section>

      <section className="page-section">
        <div className="section-header">
          <div>
            <h2>Queue lanes</h2>
            <p>Big filters make the backlog easy to scan from across the room.</p>
          </div>
          <div className="page-eyebrow">
            <Filter size={14} />
            {filteredTickets.length} tickets
          </div>
        </div>

        <div className="control-bar" style={{ padding: '0 16px' }}>
          <div className="tab-strip" role="tablist" aria-label="Ticket priority filters">
            {filters.map((filter) => (
              <button
                key={filter}
                className={`tab-button tv-focusable${activeFilter === filter ? ' active' : ''}`}
                onClick={() => setActiveFilter(filter)}
                style={{
                  fontSize: 'var(--text-base)',
                  padding: '12px 24px',
                  borderRadius: 'var(--radius-pill)',
                  fontWeight: activeFilter === filter ? 800 : 500,
                  backgroundColor: activeFilter === filter ? 'var(--surface-soft)' : 'transparent',
                  border: activeFilter === filter ? '1px solid var(--surface-border)' : '1px solid transparent',
                }}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </section>

      {ticketsByPriority.map((group) => {
        const laneColor = priorityAccent[group.priority]?.color ?? 'inherit'
        const laneSoft = priorityAccent[group.priority]?.soft ?? 'inherit'

        return (
          <section key={group.priority} className="browse-row browse-row--immersive">
            <div className="ott-lane-header">
              <div>
                <div className="ott-lane-title" style={{ color: laneColor }}>{group.priority} Queue</div>
                <div className="ott-lane-subtitle">
                  Active tickets sorted into the {group.priority.toLowerCase()} priority lane.
                </div>
              </div>
              <div className="ott-lane-count" style={{ '--lane-title-color': laneColor, '--lane-title-color-soft': laneSoft } as React.CSSProperties}>
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
                onFocus={(current) => setFocusedId(current.id)}
                onClick={(current) => setFocusedId(current.id)}
              />
            ))}
          </div>
        </section>
        )
      })}

      <section className="page-section">
        <div className="ott-lane-header">
          <div>
            <div className="ott-lane-title" style={{ color: 'var(--text-primary)', fontSize: 'clamp(1.2rem, 2vw, 1.6rem)' }}>
              Recently stabilized
            </div>
            <div className="ott-lane-subtitle">Resolved work remains visible without competing with the active queue.</div>
          </div>
        </div>

        <div className="rail rail--ott">
          {resolvedTickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              compact
              onFocus={(current) => setFocusedId(current.id)}
              onClick={(current) => setFocusedId(current.id)}
            />
          ))}
        </div>
      </section>
    </div>
  )
}

