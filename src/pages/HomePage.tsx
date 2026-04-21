import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart2,
  Clock,
  Ticket,
  TrendingUp,
  Users,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { clients } from '../data/clients'
import { team } from '../data/team'
import { tickets } from '../data/tickets'

// ─── Colour tokens ───────────────────────────────────────────────────────────
const C = {
  critical: '#EF7868',
  high:     '#E4A85E',
  medium:   '#7B9FB6',
  resolved: '#6DB48C',
  escalated:'#C85A9A',
}

// ─── 7-day throughput data ────────────────────────────────────────────────────
const throughput = [
  { label: 'Mon', opened: 12, resolved: 7 },
  { label: 'Tue', opened: 16, resolved: 10 },
  { label: 'Wed', opened: 14, resolved: 11 },
  { label: 'Thu', opened: 18, resolved: 12 },
  { label: 'Fri', opened: 21, resolved: 15 },
  { label: 'Sat', opened: 17, resolved: 13 },
  { label: 'Sun', opened: 15, resolved: 12 },
]

// ─── SVG path helpers ────────────────────────────────────────────────────────
function linePath(vals: number[], W: number, H: number, max: number) {
  return vals.map((v, i) => {
    const x = (i / (vals.length - 1)) * W
    const y = H - (v / max) * (H - 4)
    return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`
  }).join(' ')
}
function areaPath(vals: number[], W: number, H: number, max: number) {
  const pts = vals.map((v, i) => {
    const x = (i / (vals.length - 1)) * W
    const y = H - (v / max) * (H - 4)
    return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`
  })
  return `${pts.join(' ')} L ${W} ${H} L 0 ${H} Z`
}

// ─── Avatar initials ─────────────────────────────────────────────────────────
function av(name: string) {
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
}

export default function HomePage() {
  const navigate = useNavigate()

  // ── Core KPI derivations ─────────────────────────────────────────────────
  const openCount      = tickets.filter(t => t.status !== 'Resolved').length
  const criticalCount  = tickets.filter(t => t.priority === 'Critical').length
  const slaBreached    = tickets.filter(t => t.slaBreached).length
  const escalations    = tickets.filter(t => t.status === 'Escalated').length
  const resolvedCount  = tickets.filter(t => t.status === 'Resolved').length
  const avgSla         = Math.round(
    clients.reduce((s, c) => s + parseFloat(c.slaCompliance), 0) / clients.length
  )
  const engineersOn    = team.filter(t => t.status !== 'Away').length
  const engineersAvail = team.filter(t => t.status === 'Available').length

  // ── Priority breakdown ───────────────────────────────────────────────────
  const pBreak = [
    { label: 'Critical', count: criticalCount,                                                   color: C.critical  },
    { label: 'High',     count: tickets.filter(t => t.priority === 'High').length,               color: C.high      },
    { label: 'Medium',   count: tickets.filter(t => t.priority === 'Medium').length,             color: C.medium    },
    { label: 'Resolved', count: resolvedCount,                                                   color: C.resolved  },
  ]
  const pTotal = pBreak.reduce((s, p) => s + p.count, 0)

  // ── Category breakdown ───────────────────────────────────────────────────
  const catMap: Record<string, number> = {}
  tickets.forEach(t => { catMap[t.category] = (catMap[t.category] ?? 0) + 1 })
  const categories = Object.entries(catMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 7)
  const maxCat = Math.max(...categories.map(c => c[1]))

  // ── SLA per client ────────────────────────────────────────────────────────
  const clientSla = clients.map(c => ({
    name:  c.name,
    sla:   parseFloat(c.slaCompliance),
    color: parseFloat(c.slaCompliance) >= 97 ? C.resolved
         : parseFloat(c.slaCompliance) >= 92 ? C.high
         : C.critical,
  }))

  // ── Throughput SVG ────────────────────────────────────────────────────────
  const W = 640, H = 130
  const maxT = Math.max(...throughput.flatMap(p => [p.opened, p.resolved]))
  const openedLine = linePath(throughput.map(p => p.opened), W, H, maxT)
  const openedArea = areaPath(throughput.map(p => p.opened), W, H, maxT)
  const resolvedLine = linePath(throughput.map(p => p.resolved), W, H, maxT)

  // ── Incidents feed ────────────────────────────────────────────────────────
  const liveIncidents = tickets
    .filter(t => t.slaBreached || t.status === 'Escalated')
    .sort((a, b) => (b.affectedUsers - a.affectedUsers))
  // ── Ticket flow balance ─────────────────────────────────────────────────
  const weekOpened   = throughput.reduce((s, p) => s + p.opened, 0)
  const weekResolved = throughput.reduce((s, p) => s + p.resolved, 0)
  const flowBalance  = Math.round((weekResolved / weekOpened) * 100)

  return (
    <div className="ops-dashboard">

      {/* ═══════════════════════════════════════════════════════════════════
          STATUS BAR
      ═══════════════════════════════════════════════════════════════════ */}
      <div className="ops-status-bar">
        <div className="ops-status-brand">
          <Activity size={15} />
          Live Operations
        </div>
        <div className="ops-status-chips">
          <span className="ops-chip ops-chip--alert">
            <span className="ops-chip-dot" style={{ background: C.critical }} />
            {criticalCount} Critical
          </span>
          <span className="ops-chip ops-chip--alert">
            <span className="ops-chip-dot" style={{ background: C.escalated }} />
            {escalations} Escalated
          </span>
          <span className="ops-chip ops-chip--warn">
            <span className="ops-chip-dot" style={{ background: C.high }} />
            {slaBreached} SLA Breached
          </span>
          <span className="ops-chip">
            <span className="ops-chip-dot" style={{ background: C.resolved }} />
            {engineersAvail}/{engineersOn} Engineers Available
          </span>
        </div>
        <div className="ops-status-time">
          {new Intl.DateTimeFormat(undefined, { weekday: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date())}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          KPI GRID — 5 clean tiles, number-forward
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="ops-section">
        <div className="ops-kpi-grid">

          <div className="ops-kpi ops-kpi--highlight" style={{ '--kpi-accent': C.critical } as React.CSSProperties}>
            <div className="ops-kpi-icon" style={{ background: `${C.critical}15`, color: C.critical }}>
              <AlertTriangle size={18} />
            </div>
            <div className="ops-kpi-body">
              <div className="ops-kpi-value" style={{ color: criticalCount > 0 ? C.critical : undefined }}>
                {criticalCount}
              </div>
              <div className="ops-kpi-label">Critical Tickets</div>
              <div className="ops-kpi-sub">Needs immediate action</div>
            </div>
          </div>

          <div className="ops-kpi" style={{ '--kpi-accent': C.high } as React.CSSProperties}>
            <div className="ops-kpi-icon" style={{ background: `${C.high}15`, color: C.high }}>
              <Clock size={18} />
            </div>
            <div className="ops-kpi-body">
              <div className="ops-kpi-value" style={{ color: slaBreached > 0 ? C.high : undefined }}>
                {slaBreached}
              </div>
              <div className="ops-kpi-label">SLA Breached</div>
              <div className="ops-kpi-sub">Compliance at risk</div>
            </div>
          </div>

          <div className="ops-kpi">
            <div className="ops-kpi-icon">
              <Ticket size={18} />
            </div>
            <div className="ops-kpi-body">
              <div className="ops-kpi-value">{openCount}</div>
              <div className="ops-kpi-label">Open Tickets</div>
              <div className="ops-kpi-sub">Total active backlog</div>
            </div>
          </div>

          <div className="ops-kpi">
            <div className="ops-kpi-icon">
              <Users size={18} />
            </div>
            <div className="ops-kpi-body">
              <div className="ops-kpi-value">{engineersAvail}<span className="ops-kpi-value-small">/{engineersOn}</span></div>
              <div className="ops-kpi-label">Engineers Available</div>
              <div className="ops-kpi-sub">On shift today</div>
            </div>
          </div>

          <div className="ops-kpi">
            <div className="ops-kpi-icon" style={{ background: 'rgba(109,180,140,0.12)', color: C.resolved }}>
              <TrendingUp size={18} />
            </div>
            <div className="ops-kpi-body">
              <div className="ops-kpi-value" style={{ color: avgSla >= 95 ? C.resolved : C.high }}>{avgSla}%</div>
              <div className="ops-kpi-label">Avg SLA Compliance</div>
              <div className="ops-kpi-sub">Across all clients</div>
            </div>
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          ROW 1 — Throughput Chart + Priority Breakdown (number grid)
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="ops-section">
        <div className="ops-charts-wide">

          {/* ── Ticket Throughput ── */}
          <article className="ops-card ops-card--span2">
            <div className="ops-card-header">
              <div>
                <div className="ops-card-title">
                  <BarChart2 size={15} />
                  Ticket Throughput — 7 Day
                </div>
                <div className="ops-card-sub">Opened vs resolved trend this week</div>
              </div>
              <div className="ops-card-kpi-pair">
                <div>
                  <div className="ops-card-kpi-value" style={{ color: flowBalance >= 70 ? C.resolved : C.high }}>
                    {flowBalance}%
                  </div>
                  <div className="ops-card-kpi-label">Flow balance</div>
                </div>
                <div>
                  <div className="ops-card-kpi-value">{weekOpened}</div>
                  <div className="ops-card-kpi-label">Opened</div>
                </div>
                <div>
                  <div className="ops-card-kpi-value" style={{ color: C.resolved }}>{weekResolved}</div>
                  <div className="ops-card-kpi-label">Resolved</div>
                </div>
              </div>
            </div>

            <div className="ops-chart-area">
              <svg viewBox={`0 0 ${W} ${H}`} className="ops-svg" preserveAspectRatio="none">
                {/* Very subtle grid lines */}
                {[H * 0.25, H * 0.5, H * 0.75].map(y => (
                  <line key={y} x1="0" y1={y} x2={W} y2={y}
                    stroke="currentColor" strokeOpacity="0.06" strokeWidth="1" />
                ))}
                <defs>
                  <linearGradient id="openGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#567C8D" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#567C8D" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d={openedArea} fill="url(#openGrad)" />
                <path d={openedLine} fill="none" stroke="#7B9FB6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d={resolvedLine} fill="none" stroke={C.resolved} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="5 5" opacity="0.7" />
                {throughput.map((p, i) => {
                  const x = (i / (throughput.length - 1)) * W
                  const oy = H - (p.opened  / maxT) * (H - 4)
                  const ry = H - (p.resolved / maxT) * (H - 4)
                  return (
                    <g key={p.label}>
                      <circle cx={x} cy={oy} r="3.5" fill="#7B9FB6" />
                      <circle cx={x} cy={ry} r="3.5" fill={C.resolved} opacity="0.7" />
                    </g>
                  )
                })}
              </svg>
              <div className="ops-axis">
                {throughput.map(p => <span key={p.label}>{p.label}</span>)}
              </div>
              <div className="ops-legend">
                <span><span className="ops-legend-dot" style={{ background: '#7B9FB6' }} />Opened</span>
                <span><span className="ops-legend-dot" style={{ background: C.resolved, opacity: 0.8 }} />Resolved</span>
              </div>
            </div>
          </article>

          {/* ── Priority Breakdown — clean number grid ── */}
          <article className="ops-card">
            <div className="ops-card-header">
              <div>
                <div className="ops-card-title">Priority Breakdown</div>
                <div className="ops-card-sub">Current queue by severity</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="ops-card-kpi-value" style={{ fontSize: '1.6rem' }}>{pTotal}</div>
                <div className="ops-card-kpi-label">total</div>
              </div>
            </div>

            {/* Clean number-first list */}
            <div className="ops-priority-list">
              {pBreak.map(p => (
                <div key={p.label} className="ops-priority-row">
                  <div className="ops-priority-dot" style={{ background: p.color, opacity: 0.8 }} />
                  <div className="ops-priority-label">{p.label}</div>
                  <div className="ops-priority-bar-wrap">
                    <div
                      className="ops-priority-bar"
                      style={{ width: `${pTotal > 0 ? (p.count / pTotal) * 100 : 0}%`, background: p.color }}
                    />
                  </div>
                  <div className="ops-priority-count" style={{ color: p.count > 3 ? p.color : undefined }}>
                    {p.count}
                  </div>
                </div>
              ))}
            </div>

            {/* Thin stacked bar at bottom as a summary */}
            <div className="ops-stacked-mini">
              {pBreak.map(p => (
                <div
                  key={p.label}
                  style={{ flex: p.count, background: p.color, opacity: 0.65, borderRadius: 2, height: '100%' }}
                  title={`${p.label}: ${p.count}`}
                />
              ))}
            </div>
          </article>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          ROW 2 — Category load + Team Workload + SLA per client
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="ops-section">
        <div className="ops-charts-trio">

          {/* ── Category Breakdown — clean ranked list ── */}
          <article className="ops-card">
            <div className="ops-card-header">
              <div>
                <div className="ops-card-title">Ticket Categories</div>
                <div className="ops-card-sub">Volume by issue type</div>
              </div>
            </div>
            <div className="ops-cat-list">
              {categories.map(([cat, count], i) => (
                <div key={cat} className="ops-cat-row">
                  <span className="ops-cat-rank">0{i + 1}</span>
                  <span className="ops-cat-name">{cat}</span>
                  <div className="ops-cat-bar-wrap">
                    <div
                      className="ops-cat-bar"
                      style={{
                        width: `${(count / maxCat) * 100}%`,
                        background: count >= 3
                          ? `${C.critical}90`
                          : count >= 2
                            ? `${C.high}90`
                            : `${C.medium}90`,
                      }}
                    />
                  </div>
                  <span className="ops-cat-count">{count}</span>
                </div>
              ))}
            </div>
          </article>

          {/* ── Team Workload — clean person list ── */}
          <article className="ops-card">
            <div className="ops-card-header">
              <div>
                <div className="ops-card-title">Engineer Workload</div>
                <div className="ops-card-sub">Open tickets vs resolved today</div>
              </div>
            </div>
            <div className="ops-team-list">
              {team.map(m => (
                <div key={m.id} className="ops-team-row">
                  <div className="ops-team-avatar">
                    <div
                      className="ops-team-av"
                      style={{
                        background: m.status === 'Available' ? 'rgba(109,180,140,0.12)'
                                  : m.status === 'Busy'      ? 'rgba(239,120,104,0.12)'
                                  : 'rgba(255,255,255,0.05)',
                        color: m.status === 'Available' ? C.resolved
                             : m.status === 'Busy'      ? C.critical
                             : 'rgba(255,255,255,0.35)',
                        borderColor: 'transparent',
                      }}
                    >
                      {av(m.name)}
                    </div>
                    <div
                      className="ops-team-status-dot"
                      style={{
                        background: m.status === 'Available' ? C.resolved
                                  : m.status === 'Busy'      ? C.critical
                                  : C.high,
                      }}
                    />
                  </div>
                  <div className="ops-team-info">
                    <div className="ops-team-name">{m.name.split(' ')[0]}</div>
                    <div className="ops-team-role">{m.role}</div>
                  </div>
                  <div className="ops-team-stats">
                    <div>
                      <div className="ops-team-stat-val" style={{ color: m.openTickets > 2 ? C.high : undefined }}>
                        {m.openTickets}
                      </div>
                      <div className="ops-team-stat-lbl">open</div>
                    </div>
                    <div>
                      <div className="ops-team-stat-val" style={{ color: C.resolved }}>{m.resolvedToday}</div>
                      <div className="ops-team-stat-lbl">done</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </article>

          {/* ── SLA Health per Client — number-first ── */}
          <article className="ops-card">
            <div className="ops-card-header">
              <div>
                <div className="ops-card-title">SLA Health</div>
                <div className="ops-card-sub">Per-client compliance score</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="ops-card-kpi-value" style={{ color: avgSla >= 95 ? C.resolved : C.high, fontSize: '1.6rem' }}>
                  {avgSla}%
                </div>
                <div className="ops-card-kpi-label">avg</div>
              </div>
            </div>
            <div className="ops-sla-list">
              {clientSla.map(c => (
                <div key={c.name} className="ops-sla-row">
                  <div className="ops-sla-name">{c.name}</div>
                  <div className="ops-sla-bar-wrap">
                    <div
                      className="ops-sla-bar"
                      style={{ width: `${c.sla}%`, background: c.color }}
                    />
                    <div className="ops-sla-target" title="95% target" />
                  </div>
                  <div className="ops-sla-score" style={{ color: c.sla < 92 ? C.critical : c.sla < 97 ? C.high : undefined }}>
                    {c.sla}%
                  </div>
                </div>
              ))}
            </div>
            <div className="ops-sla-legend">
              <span><span className="ops-legend-dot" style={{ background: C.resolved }} />≥97%</span>
              <span><span className="ops-legend-dot" style={{ background: C.high }} />92–96%</span>
              <span><span className="ops-legend-dot" style={{ background: C.critical }} />At Risk</span>
            </div>
          </article>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          LIVE INCIDENTS FEED
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="ops-section">
        <article className="ops-card">
          <div className="ops-card-header">
            <div>
              <div className="ops-card-title">
                <span className="ops-live-dot" />
                Live Incidents — SLA Breached &amp; Escalated
              </div>
              <div className="ops-card-sub">
                {liveIncidents.length} active incidents requiring immediate attention
              </div>
            </div>
            <button className="ops-action-btn" onClick={() => navigate('/tickets')}>
              All tickets <ArrowRight size={14} />
            </button>
          </div>

          <div className="ops-incident-table">
            <div className="ops-incident-thead">
              <span>Ticket</span>
              <span>Client · Category</span>
              <span>Assignee</span>
              <span>Affected Users</span>
              <span>Region</span>
              <span>Status</span>
            </div>
            {liveIncidents.map(t => (
              <div key={t.id} className="ops-incident-row">
                <div>
                  <div className="ops-incident-id">{t.id}</div>
                  <div className="ops-incident-title">{t.title}</div>
                </div>
                <div>
                  <div className="ops-incident-client">{t.client}</div>
                  <div className="ops-incident-cat">{t.category}</div>
                </div>
                <div className="ops-incident-assignee">
                  <div
                    className="ops-av-sm"
                    style={{ background: 'rgba(255,255,255,0.08)' }}
                  >
                    {av(t.assignee)}
                  </div>
                  <span>{t.assignee.split(' ')[0]}</span>
                </div>
                <div className="ops-incident-users">
                  {t.affectedUsers > 0 ? (
                    <span style={{ color: t.affectedUsers > 2000 ? C.critical : t.affectedUsers > 500 ? C.high : 'inherit' }}>
                      {t.affectedUsers.toLocaleString()}
                    </span>
                  ) : (
                    <span style={{ opacity: 0.35 }}>—</span>
                  )}
                </div>
                <div className="ops-incident-region">{t.region}</div>
                <div>
                  <span
                    className="ops-badge"
                    style={{
                      background: t.slaBreached    ? `${C.critical}18`
                                : t.status === 'Escalated' ? `${C.escalated}18`
                                : 'rgba(255,255,255,0.06)',
                      color: t.slaBreached    ? C.critical
                           : t.status === 'Escalated' ? C.escalated
                           : 'rgba(255,255,255,0.6)',
                    }}
                  >
                    {t.slaBreached ? 'SLA Breached' : t.status}
                  </span>
                  <div className="ops-incident-sla">{t.sla}</div>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          TEAM ON-SHIFT QUICK VIEW
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="ops-section">
        <div className="ops-card-header" style={{ marginBottom: 16 }}>
          <div>
            <div className="ops-card-title" style={{ fontSize: '1rem' }}>
              <Users size={15} /> On-Shift Team
            </div>
            <div className="ops-card-sub">{engineersOn} active · {engineersAvail} available for new tickets</div>
          </div>
          <button className="ops-action-btn" onClick={() => navigate('/team')}>
            Full roster <ArrowRight size={14} />
          </button>
        </div>
        <div className="ops-team-grid">
          {team.map(m => (
            <div
              key={m.id}
              className="ops-team-card"
              style={{
                borderColor: m.status === 'Available' ? `${C.resolved}33`
                           : m.status === 'Busy'      ? `${C.critical}22`
                           : 'var(--surface-border)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                  className="ops-team-av"
                  style={{
                    width: 40, height: 40, fontSize: '0.78rem',
                    background: m.status === 'Available' ? 'rgba(109,180,140,0.1)'
                              : m.status === 'Busy'      ? 'rgba(239,120,104,0.1)'
                              : 'rgba(255,255,255,0.05)',
                    color: m.status === 'Available' ? C.resolved
                         : m.status === 'Busy'      ? C.critical
                         : 'rgba(255,255,255,0.35)',
                    borderColor: 'transparent',
                  }}
                >
                  {av(m.name)}
                </div>
                <div>
                  <div className="ops-team-card-name">{m.name}</div>
                  <div className="ops-team-card-role">{m.role}</div>
                </div>
                <span
                  className="ops-badge"
                  style={{
                    marginLeft: 'auto',
                    background: m.status === 'Available' ? `${C.resolved}12`
                              : m.status === 'Busy'      ? `${C.critical}12`
                              : 'rgba(255,255,255,0.04)',
                    color: m.status === 'Available' ? `${C.resolved}cc`
                         : m.status === 'Busy'      ? `${C.critical}cc`
                         : 'rgba(255,255,255,0.35)',
                  }}
                >
                  {m.status}
                </span>
              </div>
              <div className="ops-team-card-metrics">
                <div>
                  <div className="ops-team-stat-val" style={{ fontSize: '1.3rem', color: m.openTickets > 2 ? C.high : undefined }}>
                    {m.openTickets}
                  </div>
                  <div className="ops-team-stat-lbl">Open</div>
                </div>
                <div>
                  <div className="ops-team-stat-val" style={{ fontSize: '1.3rem', color: C.resolved }}>{m.resolvedToday}</div>
                  <div className="ops-team-stat-lbl">Resolved</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div className="ops-team-stat-lbl" style={{ marginBottom: 5 }}>{m.specialization}</div>
                  <div style={{ height: 3, borderRadius: 2, background: 'var(--surface-soft)', overflow: 'hidden' }}>
                    <div style={{
                      width: `${Math.min(100, (m.openTickets / Math.max(...team.map(x => x.openTickets + x.resolvedToday), 1)) * 100)}%`,
                      height: '100%',
                      background: m.openTickets > 2 ? `${C.high}aa` : `${C.medium}aa`,
                      borderRadius: 2,
                    }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}
