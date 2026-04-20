import { Activity, ArrowRight, CheckCircle2, Clock3, Layers3, Shield, Ticket, Users } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { KpiCard, TicketCard } from '../components/Card'
import Avatar from '../components/Avatar'
import ClientCard from '../components/ClientCard'
import { clients } from '../data/clients'
import { team } from '../data/team'
import { tickets, urgentTickets } from '../data/tickets'

const throughputTrend = [
  { label: 'Mon', opened: 12, resolved: 7 },
  { label: 'Tue', opened: 16, resolved: 10 },
  { label: 'Wed', opened: 14, resolved: 11 },
  { label: 'Thu', opened: 18, resolved: 12 },
  { label: 'Fri', opened: 21, resolved: 15 },
  { label: 'Sat', opened: 17, resolved: 13 },
  { label: 'Sun', opened: 15, resolved: 12 },
]

function buildLinePath(values: number[], width: number, height: number, maxValue: number) {
  return values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * width
      const y = height - (value / maxValue) * height
      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`
    })
    .join(' ')
}

function buildAreaPath(values: number[], width: number, height: number, maxValue: number) {
  const line = values.map((value, index) => {
    const x = (index / (values.length - 1)) * width
    const y = height - (value / maxValue) * height
    return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`
  })

  return `${line.join(' ')} L ${width} ${height} L 0 ${height} Z`
}

function buildConicGradient(segments: Array<{ color: string; value: number }>) {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0)

  if (!total) {
    return 'conic-gradient(var(--surface-soft) 0deg 360deg)'
  }

  let start = 0

  return `conic-gradient(${segments
    .map((segment) => {
      const end = start + (segment.value / total) * 360
      const stop = `${segment.color} ${start.toFixed(2)}deg ${end.toFixed(2)}deg`
      start = end
      return stop
    })
    .join(', ')})`
}

export default function HomePage() {
  const navigate = useNavigate()
  const now = new Date()
  const [focusedClientId, setFocusedClientId] = useState(clients[0].id)
  const openTickets = tickets.filter((ticket) => ticket.status !== 'Resolved').length
  const resolvedToday = tickets.filter((ticket) => ticket.status === 'Resolved').length
  const liveEscalations = tickets.filter((ticket) => ticket.status === 'Escalated').length
  const availableEngineers = team.filter((member) => member.status === 'Available').length
  const slaCompliance = 96
  const avgResolutionTime = '4.2h'
  const focusedClient = clients.find((client) => client.id === focusedClientId) ?? clients[0]
  const focusedClientTickets = useMemo(
    () => tickets.filter((ticket) => ticket.clientId === focusedClient.id),
    [focusedClient.id],
  )
  const focusedClientHero = focusedClientTickets[0] ?? urgentTickets[0]

  const priorityBreakdown = [
    {
      label: 'Critical',
      count: tickets.filter((ticket) => ticket.priority === 'Critical').length,
      color: 'var(--status-critical)',
    },
    {
      label: 'High',
      count: tickets.filter((ticket) => ticket.priority === 'High').length,
      color: 'var(--status-high)',
    },
    {
      label: 'Medium',
      count: tickets.filter((ticket) => ticket.priority === 'Medium').length,
      color: 'var(--status-medium)',
    },
    {
      label: 'Resolved',
      count: tickets.filter((ticket) => ticket.priority === 'Resolved').length,
      color: 'var(--status-resolved)',
    },
  ]

  const totalTickets = priorityBreakdown.reduce((sum, item) => sum + item.count, 0)
  const donutGradient = buildConicGradient(priorityBreakdown.map((item) => ({ color: item.color, value: item.count })))

  const regionBreakdown = [...new Set(tickets.map((ticket) => ticket.region))]
    .map((region) => ({
      region,
      count: tickets.filter((ticket) => ticket.region === region).length,
    }))
    .sort((left, right) => right.count - left.count)
    .slice(0, 4)

  const clientRows = clients.map((client) => {
    const clientTickets = tickets.filter((ticket) => ticket.clientId === client.id)

    return {
      client,
      totalTickets: clientTickets.length,
      criticalTickets: clientTickets.filter((ticket) => ticket.priority === 'Critical').length,
      mediumTickets: clientTickets.filter((ticket) => ticket.priority === 'Medium').length,
      resolvedTickets: clientTickets.filter((ticket) => ticket.status === 'Resolved').length,
    }
  })

  const maxRegionCount = Math.max(...regionBreakdown.map((item) => item.count), 1)
  const maxTrendValue = Math.max(...throughputTrend.flatMap((point) => [point.opened, point.resolved]))
  const openedValues = throughputTrend.map((point) => point.opened)
  const resolvedValues = throughputTrend.map((point) => point.resolved)
  const openedPath = buildLinePath(openedValues, 620, 180, maxTrendValue)
  const openedArea = buildAreaPath(openedValues, 620, 180, maxTrendValue)
  const resolvedPath = buildLinePath(resolvedValues, 620, 180, maxTrendValue)
  const urgentNow = urgentTickets.slice(0, 4)
  const busiestClient = [...clients].sort((left, right) => right.openTickets - left.openTickets)[0]
  const refreshLabel = new Intl.DateTimeFormat(undefined, {
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(now)

  return (
    <div className="page-stack">
      <section className="immersive-board">
        <article className="immersive-preview">
          <div className="immersive-preview-copy">
            <div className="immersive-kicker">
              <Activity size={14} />
              Live client preview
            </div>
            <h1 className="immersive-title">{focusedClient.name}</h1>
            <p className="immersive-subtitle">
              {focusedClient.industry} · {focusedClient.region} · {focusedClient.projects} active projects. Highest-pressure ticket is{' '}
              {focusedClientHero.title}.
            </p>
            <div className="immersive-meta">
              <span className="signal-pill">{focusedClient.openTickets} open tickets</span>
              <span className="signal-pill">{focusedClient.criticalCount} critical</span>
              <span className="signal-pill">{focusedClient.slaCompliance} SLA</span>
              <span className="signal-pill">Refreshed {refreshLabel}</span>
            </div>
          </div>

          <div className="immersive-meta">
            <span className="meta-pill">
              <Layers3 size={14} />
              {focusedClientTickets.length} tickets in portfolio
            </span>
            <span className="meta-pill">
              <Clock3 size={14} />
              Spotlight: {focusedClientHero.timeAgo}
            </span>
          </div>
        </article>

        <div className="immersive-side">
          <article className="summary-tile">
            <div className="summary-label">Top incident</div>
            <div className="summary-value">{focusedClientHero.client}</div>
            <div className="summary-copy">{focusedClientHero.title}</div>
          </article>
          <article className="summary-tile">
            <div className="summary-label">Incident owner</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 14 }}>
              <Avatar name={focusedClientHero.assignee} size={46} />
              <div>
                <div style={{ fontWeight: 800, fontSize: 'var(--text-lg)' }}>{focusedClientHero.assignee}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>{focusedClientHero.status}</div>
              </div>
            </div>
          </article>
          <article className="summary-tile">
            <div className="summary-label">Average resolution</div>
            <div className="summary-value">{avgResolutionTime}</div>
            <div className="summary-copy">Measured across current operational tickets.</div>
          </article>
          <article className="summary-tile">
            <div className="summary-label">Busiest account</div>
            <div className="summary-value">{busiestClient.name}</div>
            <div className="summary-copy">{busiestClient.openTickets} open tickets in queue.</div>
          </article>
        </div>
      </section>

      <section className="browse-row">
        <div className="row-header">
          <div>
            <div className="row-title">Clients spotlight</div>
            <div className="row-subtitle">Focus or hover a client card to update the immersive preview, then select to open the detail screen.</div>
          </div>
          <div className="row-count">{clients.length} clients</div>
        </div>

        <div className="rail rail--wide">
          {clientRows.map((row) => (
            <ClientCard
              key={row.client.id}
              client={row.client}
              totalTickets={row.totalTickets}
              criticalTickets={row.criticalTickets}
              mediumTickets={row.mediumTickets}
              resolvedTickets={row.resolvedTickets}
              active={row.client.id === focusedClient.id}
              onFocus={() => setFocusedClientId(row.client.id)}
              onClick={() => navigate(`/clients?client=${row.client.id}`)}
            />
          ))}
        </div>
      </section>

      <section className="page-section">
        <div className="section-header">
          <div>
            <h2>Operations at a glance</h2>
            <p>The overview now keeps KPI cards in a grid instead of a scroll rail.</p>
          </div>
        </div>

        <div className="overview-kpi-grid">
          <KpiCard label="Open tickets" value={openTickets} delta="+2 today" icon={<Ticket size={18} />} />
          <KpiCard label="Live escalations" value={liveEscalations} icon={<Shield size={18} />} accent="var(--status-critical-soft)" />
          <KpiCard label="Resolved today" value={resolvedToday} delta="+5 today" icon={<CheckCircle2 size={18} />} accent="var(--status-resolved-soft)" />
          <KpiCard label="Available engineers" value={availableEngineers} icon={<Users size={18} />} />
        </div>
      </section>

      <section className="page-section">
        <div className="overview-visual-grid">
          <article className="chart-card chart-card--wide">
            <div className="chart-header">
              <div>
                <div className="chart-title">Weekly ticket throughput</div>
                <div className="chart-subtitle">Opened versus resolved tickets over the last seven days.</div>
              </div>
              <div>
                <div className="chart-value">73%</div>
                <div className="chart-value-caption">resolution coverage</div>
              </div>
            </div>

            <div className="trend-chart">
              <svg viewBox="0 0 620 180" className="trend-svg" aria-label="Opened and resolved ticket trend">
                {[30, 60, 90, 120, 150].map((y) => (
                  <line
                    key={y}
                    x1="0"
                    y1={y}
                    x2="620"
                    y2={y}
                    stroke="var(--surface-border)"
                    strokeDasharray="4 8"
                    strokeWidth="1"
                  />
                ))}
                <path d={openedArea} fill="var(--sky)" opacity="0.42" />
                <path d={openedPath} fill="none" stroke="var(--primary)" strokeWidth="4" strokeLinecap="round" />
                <path d={resolvedPath} fill="none" stroke="var(--status-resolved)" strokeWidth="4" strokeLinecap="round" />
                {throughputTrend.map((point, index) => {
                  const x = (index / (throughputTrend.length - 1)) * 620
                  const openedY = 180 - (point.opened / maxTrendValue) * 180
                  const resolvedY = 180 - (point.resolved / maxTrendValue) * 180

                  return (
                    <g key={point.label}>
                      <circle cx={x} cy={openedY} r="4.5" fill="var(--primary)" />
                      <circle cx={x} cy={resolvedY} r="4.5" fill="var(--status-resolved)" />
                    </g>
                  )
                })}
              </svg>

              <div className="trend-axis">
                {throughputTrend.map((point) => (
                  <span key={point.label}>{point.label}</span>
                ))}
              </div>

              <div className="trend-legend">
                <span className="legend-item">
                  <span className="legend-dot" style={{ background: 'var(--primary)' }} />
                  Opened
                </span>
                <span className="legend-item">
                  <span className="legend-dot" style={{ background: 'var(--status-resolved)' }} />
                  Resolved
                </span>
              </div>
            </div>
          </article>

          <article className="chart-card">
            <div className="chart-header">
              <div>
                <div className="chart-title">Priority mix</div>
                <div className="chart-subtitle">Pie view of the current support queue.</div>
              </div>
            </div>

            <div className="donut-layout">
              <div className="donut-chart" style={{ background: donutGradient }}>
                <div className="donut-hole">
                  <div style={{ textAlign: 'center' }}>
                    <strong>{totalTickets}</strong>
                    <span>total</span>
                  </div>
                </div>
              </div>

              <div className="metric-list">
                {priorityBreakdown.map((item) => (
                  <div key={item.label} className="metric-row">
                    <div className="metric-copy">
                      <span className="legend-dot" style={{ background: item.color }} />
                      <span>{item.label}</span>
                    </div>
                    <strong>{item.count}</strong>
                  </div>
                ))}
              </div>
            </div>
          </article>

          <article className="chart-card">
            <div className="chart-header">
              <div>
                <div className="chart-title">Regional load</div>
                <div className="chart-subtitle">Where active demand is concentrated right now.</div>
              </div>
              <div>
                <div className="chart-value">{clients.length}</div>
                <div className="chart-value-caption">accounts tracked</div>
              </div>
            </div>

            <div className="bar-list">
              {regionBreakdown.map((item) => (
                <div key={item.region} className="bar-row">
                  <div className="bar-header">
                    <span>{item.region}</span>
                    <strong>{item.count}</strong>
                  </div>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${(item.count / maxRegionCount) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="chart-card chart-card--wide">
            <div className="chart-header">
              <div>
                <div className="chart-title">Urgent priorities</div>
                <div className="chart-subtitle">Critical and high-priority work that still needs attention.</div>
              </div>
              <button className="section-action tv-focusable" onClick={() => navigate('/tickets')}>
                Open ticket board
                <ArrowRight size={16} />
              </button>
            </div>

            <div className="overview-ticket-list">
              {urgentNow.map((ticket) => (
                <div key={ticket.id} className="overview-ticket-item">
                  <Avatar name={ticket.assignee} size={38} />
                  <div>
                    <strong>{ticket.title}</strong>
                    <p>
                      {ticket.client} · {ticket.region} · {ticket.status}
                    </p>
                  </div>
                  <div className="meta-pill" style={{ whiteSpace: 'nowrap' }}>
                    <Clock3 size={14} />
                    {ticket.timeAgo}
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="chart-card">
            <div className="chart-header">
              <div>
                <div className="chart-title">Support health</div>
                <div className="chart-subtitle">Core service metrics for the current shift.</div>
              </div>
            </div>

            <div className="metric-list">
              <div className="metric-row">
                <div className="metric-copy">
                  <span className="legend-dot" style={{ background: 'var(--status-resolved)' }} />
                  <span>SLA compliance</span>
                </div>
                <strong>{slaCompliance}%</strong>
              </div>
              <div className="metric-row">
                <div className="metric-copy">
                  <span className="legend-dot" style={{ background: 'var(--primary)' }} />
                  <span>Avg resolution time</span>
                </div>
                <strong>{avgResolutionTime}</strong>
              </div>
              <div className="metric-row">
                <div className="metric-copy">
                  <span className="legend-dot" style={{ background: 'var(--status-high)' }} />
                  <span>Staff available now</span>
                </div>
                <strong>{availableEngineers}</strong>
              </div>
            </div>

            <div className="bar-list">
              <div className="bar-row">
                <div className="bar-header">
                  <span>SLA target</span>
                  <strong>{slaCompliance}%</strong>
                </div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${slaCompliance}%` }} />
                </div>
              </div>
              <div className="bar-row">
                <div className="bar-header">
                  <span>Resolution efficiency</span>
                  <strong>84%</strong>
                </div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: '84%' }} />
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="browse-row">
        <div className="row-header">
          <div>
            <div className="row-title">{focusedClient.name} queue</div>
            <div className="row-subtitle">Tickets grouped under the currently focused client, matching the OTT browse pattern.</div>
          </div>
          <div className="row-count">{focusedClientTickets.length} tickets</div>
        </div>

        <div className="rail rail--wide">
          {focusedClientTickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} compact />
          ))}
        </div>
      </section>

      <section className="page-section">
        <div className="section-header">
          <div>
            <h2>Critical cards</h2>
            <p>Key incidents stay visible as large browse cards for quick attention shifts.</p>
          </div>
        </div>

        <div className="rail rail--wide">
          {urgentTickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} compact />
          ))}
        </div>
      </section>
    </div>
  )
}
