import { Activity, CheckCircle2, Ticket } from 'lucide-react'
import { useState } from 'react'
import Avatar from '../components/Avatar'
import { TicketCard } from '../components/Card'
import { team } from '../data/team'
import { tickets } from '../data/tickets'

type TeamFilter = 'All' | 'Available' | 'Busy' | 'Away'

const filters: TeamFilter[] = ['All', 'Available', 'Busy', 'Away']

const statusColor: Record<TeamFilter | (typeof team)[number]['status'], string> = {
  All: 'var(--primary)',
  Available: 'var(--status-resolved)',
  Busy: 'var(--status-high)',
  Away: 'var(--text-muted)',
}

export default function TeamPage() {
  const [activeFilter, setActiveFilter] = useState<TeamFilter>('All')
  const [selectedMemberId, setSelectedMemberId] = useState(team[0].id)

  const filteredTeam = activeFilter === 'All' ? team : team.filter((member) => member.status === activeFilter)

  const selectedMember = team.find((member) => member.id === selectedMemberId) ?? team[0]
  const assignedTickets = tickets.filter((ticket) => ticket.assignee === selectedMember.name)

  return (
    <div className="page-stack">
      <section className="page-header-board">
        <article className="headline-board">
          <div className="headline-kicker">Team spotlight</div>
          <h1 className="headline-title">{selectedMember.name}</h1>
          <p className="headline-subtitle">
            Large-screen staffing view with availability first, then owned work and shift throughput.
          </p>
          <div className="signal-strip">
            <span className="signal-pill">{selectedMember.role}</span>
            <span className="signal-pill">{selectedMember.specialization}</span>
            <span className="signal-pill">{selectedMember.status}</span>
          </div>
        </article>

        <div className="summary-grid">
          <article className="summary-tile">
            <div className="summary-label">Current status</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 14 }}>
              <Avatar name={selectedMember.name} size={44} />
              <div>
                <div style={{ fontWeight: 800, fontSize: 'var(--text-lg)' }}>{selectedMember.name}</div>
                <div style={{ color: statusColor[selectedMember.status], fontSize: 'var(--text-sm)' }}>{selectedMember.status}</div>
              </div>
            </div>
          </article>
          <article className="summary-tile">
            <div className="summary-label">Shift output</div>
            <div className="summary-value">{selectedMember.resolvedToday}</div>
            <div className="summary-copy">{selectedMember.openTickets} active tickets on this person right now.</div>
          </article>
        </div>
      </section>

      <section className="page-section">
        <div className="section-header">
          <div>
            <h2>Availability tabs</h2>
            <p>Quick status filters for office viewing.</p>
          </div>
        </div>

        <div className="tab-strip" role="tablist" aria-label="Team availability">
          {filters.map((filter) => (
            <button
              key={filter}
              className={`tab-button tv-focusable${filter === activeFilter ? ' active' : ''}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
      </section>

      <section className="page-section">
        <div className="section-header">
          <div>
            <h2>Roster rail</h2>
            <p>Profiles stay large and recognizable at a distance.</p>
          </div>
        </div>

        <div className="rail">
          {filteredTeam.map((member) => (
            <article
              key={member.id}
              className="member-card tv-focusable"
              tabIndex={0}
              onFocus={() => setSelectedMemberId(member.id)}
              onClick={() => setSelectedMemberId(member.id)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Avatar name={member.name} size={44} />
                <div>
                  <div style={{ fontWeight: 700 }}>{member.name}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>{member.role}</div>
                </div>
              </div>

              <div className="wire-card-copy">{member.specialization}</div>

              <div className="wire-card-footer">
                <span className="meta-pill" style={{ color: statusColor[member.status] }}>
                  {member.status}
                </span>
                <span style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>{member.openTickets} active</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="page-section">
        <div className="section-header">
          <div>
            <h2>Ownership queue</h2>
            <p>Owned work remains visible in a dedicated rail.</p>
          </div>
        </div>

        <div className="rail rail--wide">
          {assignedTickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} compact />
          ))}
        </div>
      </section>

      <section className="page-section">
        <div className="section-header">
          <div>
            <h2>Shift pulse</h2>
            <p>Three high-value shift metrics anchor the team screen.</p>
          </div>
        </div>

        <div className="rail">
          <article className="wire-card">
            <div className="page-eyebrow">
              <Activity size={14} />
              Busy engineers
            </div>
            <div className="info-card-value">{team.filter((member) => member.status === 'Busy').length}</div>
            <p className="wire-card-copy">Currently working active tickets or incidents.</p>
          </article>
          <article className="wire-card">
            <div className="page-eyebrow">
              <CheckCircle2 size={14} />
              Resolved today
            </div>
            <div className="info-card-value">{team.reduce((sum, member) => sum + member.resolvedToday, 0)}</div>
            <p className="wire-card-copy">Combined throughput from the current support rotation.</p>
          </article>
          <article className="wire-card">
            <div className="page-eyebrow">
              <Ticket size={14} />
              Open assignments
            </div>
            <div className="info-card-value">{team.reduce((sum, member) => sum + member.openTickets, 0)}</div>
            <p className="wire-card-copy">Live tickets being handled across the team right now.</p>
          </article>
        </div>
      </section>
    </div>
  )
}
