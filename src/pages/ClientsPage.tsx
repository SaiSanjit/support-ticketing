import { useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { clients } from '../data/clients'
import { tickets } from '../data/tickets'

// ─── Accent palette: maps critical-ticket ratio → cinematic scrim color ───────
interface AccentConfig {
  color: string
  soft: string
  bar: string
  cardLine: string
}

function getAccent(criticalCount: number, openTickets: number, industry: string): AccentConfig {
  const ratio = openTickets > 0 ? criticalCount / openTickets : 0
  if (ratio >= 0.5) {
    return { color: 'rgba(239,80,68,0.22)', soft: 'rgba(239,80,68,0.09)', bar: '#ef7868', cardLine: 'rgba(239,120,104,0.7)' }
  }
  if (ratio >= 0.25) {
    return { color: 'rgba(220,140,60,0.20)', soft: 'rgba(220,140,60,0.08)', bar: '#e4a85e', cardLine: 'rgba(228,168,94,0.7)' }
  }
  // Industry-based tones for "stable" clients
  const industryAccents: Record<string, AccentConfig> = {
    Technology:           { color: 'rgba(80,140,200,0.18)', soft: 'rgba(80,140,200,0.07)', bar: '#5b9fd4', cardLine: 'rgba(91,159,212,0.65)' },
    'Financial Services': { color: 'rgba(91,129,148,0.22)', soft: 'rgba(91,129,148,0.09)', bar: '#7b9fb6', cardLine: 'rgba(123,159,182,0.65)' },
    'Supply Chain':       { color: 'rgba(100,160,120,0.18)', soft: 'rgba(100,160,120,0.08)', bar: '#6db48c', cardLine: 'rgba(109,180,140,0.65)' },
    Healthcare:           { color: 'rgba(120,100,180,0.18)', soft: 'rgba(120,100,180,0.08)', bar: '#9b85d0', cardLine: 'rgba(155,133,208,0.65)' },
    'Media & Streaming':  { color: 'rgba(200,80,140,0.16)', soft: 'rgba(200,80,140,0.07)', bar: '#c85a9a', cardLine: 'rgba(200,90,154,0.65)' },
  }
  return industryAccents[industry] ?? { color: 'rgba(91,129,148,0.18)', soft: 'rgba(91,129,148,0.07)', bar: '#7b9fb6', cardLine: 'rgba(123,159,182,0.65)' }
}

// ─── Priority badge colours ────────────────────────────────────────────────────
const priorityBadge: Record<string, { bg: string; text: string }> = {
  Critical: { bg: 'rgba(239,120,104,0.18)', text: '#ef7868' },
  High:     { bg: 'rgba(228,168,94,0.18)',  text: '#e4a85e' },
  Medium:   { bg: 'rgba(123,159,182,0.18)', text: '#7b9fb6' },
  Resolved: { bg: 'rgba(109,180,140,0.18)', text: '#6db48c' },
}

// ─── Initials avatar ───────────────────────────────────────────────────────────
function initials(name: string) {
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
}

function toPercent(v: number, total: number) {
  return total > 0 ? (v / total) * 100 : 0
}

export default function ClientsPage() {
  const navigate = useNavigate()
  const [selectedId, setSelectedId] = useState(clients[0].id)
  const railRef = useRef<HTMLDivElement>(null)

  const client = clients.find(c => c.id === selectedId) ?? clients[0]
  const clientTickets = useMemo(() => tickets.filter(t => t.clientId === client.id), [client.id])
  const spotlight = clientTickets.find(t => t.priority === 'Critical') ?? clientTickets.find(t => t.priority === 'High') ?? clientTickets[0]

  const accent = getAccent(client.criticalCount, client.openTickets, client.industry)

  const criticalCount = clientTickets.filter(t => t.priority === 'Critical').length
  const highCount     = clientTickets.filter(t => t.priority === 'High').length
  const mediumCount   = clientTickets.filter(t => t.priority === 'Medium').length
  const resolvedCount = clientTickets.filter(t => t.status === 'Resolved').length
  const totalCount    = clientTickets.length

  const slaOk = parseFloat(client.slaCompliance) >= 95

  function selectClient(id: string) {
    setSelectedId(id)
    // Scroll active card into view
    setTimeout(() => {
      const card = railRef.current?.querySelector(`[data-client-id="${id}"]`) as HTMLElement | null
      card?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
    }, 0)
  }

  return (
    <div className="clients-tv-shell">

      {/* ─── CINEMATIC HERO ────────────────────────────────────────────────── */}
      <div className="ctv-hero">

        {/* Atmospheric layers */}
        <div className="ctv-hero-base" />
        <div
          className="ctv-hero-accent"
          style={{
            background: `
              radial-gradient(ellipse at 70% 40%, ${accent.color} 0%, transparent 60%),
              radial-gradient(ellipse at 10% 80%, ${accent.soft} 0%, transparent 50%)
            `,
          }}
        />
        <div className="ctv-hero-noise" />
        <div className="ctv-hero-vignette" />

        {/* ── LEFT COLUMN: dominant client identity + metrics ── */}
        <div className="ctv-hero-left">
          {/* key triggers animation on client change */}
          <div key={client.id} className="ctv-hero-content">

            <div className="ctv-category">
              <span className="ctv-category-dot" style={{ color: accent.bar }} />
              {client.industry}
            </div>

            <h1 className="ctv-client-name">{client.name}</h1>

            <div className="ctv-meta-line">
              <span>{client.region}</span>
              <span className="ctv-meta-sep" />
              <span>{client.projects} projects</span>
              <span className="ctv-meta-sep" />
              <span>Since {client.since}</span>
            </div>

            {/* Bold, TV-readable metrics */}
            <div className="ctv-metrics">
              <div className="ctv-metric">
                <span className="ctv-metric-value">{client.totalTickets}</span>
                <span className="ctv-metric-label">Total Tickets</span>
              </div>
              <div className="ctv-metric">
                <span className="ctv-metric-value">{client.openTickets}</span>
                <span className="ctv-metric-label">Open</span>
              </div>
              <div className="ctv-metric">
                <span className={`ctv-metric-value${client.criticalCount > 0 ? ' ctv-metric-value--critical' : ''}`}>
                  {client.criticalCount}
                </span>
                <span className="ctv-metric-label">Critical</span>
              </div>
              <div className="ctv-metric">
                <span className={`ctv-metric-value${slaOk ? ' ctv-metric-value--sla-ok' : ''}`}>
                  {client.slaCompliance}
                </span>
                <span className="ctv-metric-label">SLA</span>
              </div>
            </div>

            {/* Horizontal segmented distribution bar */}
            <div className="ctv-distro">
              <div className="ctv-distro-label">Ticket distribution</div>
              <div className="ctv-distro-bar" role="img" aria-label={`Ticket breakdown for ${client.name}`}>
                <span className="ctv-distro-bar-seg" style={{ width: `${toPercent(criticalCount, totalCount)}%`, background: '#ef7868' }} />
                <span className="ctv-distro-bar-seg" style={{ width: `${toPercent(highCount, totalCount)}%`,     background: '#e4a85e' }} />
                <span className="ctv-distro-bar-seg" style={{ width: `${toPercent(mediumCount, totalCount)}%`,   background: '#7b9fb6' }} />
                <span className="ctv-distro-bar-seg" style={{ width: `${toPercent(resolvedCount, totalCount)}%`, background: '#6db48c' }} />
              </div>
              <div className="ctv-distro-legend">
                {criticalCount > 0 && (
                  <span className="ctv-distro-legend-item">
                    <span className="ctv-distro-legend-dot" style={{ background: '#ef7868' }} />
                    {criticalCount} Critical
                  </span>
                )}
                {highCount > 0 && (
                  <span className="ctv-distro-legend-item">
                    <span className="ctv-distro-legend-dot" style={{ background: '#e4a85e' }} />
                    {highCount} High
                  </span>
                )}
                {mediumCount > 0 && (
                  <span className="ctv-distro-legend-item">
                    <span className="ctv-distro-legend-dot" style={{ background: '#7b9fb6' }} />
                    {mediumCount} Medium
                  </span>
                )}
                {resolvedCount > 0 && (
                  <span className="ctv-distro-legend-item">
                    <span className="ctv-distro-legend-dot" style={{ background: '#6db48c' }} />
                    {resolvedCount} Resolved
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN: ticket spotlight ── */}
        {spotlight ? (
          <div className="ctv-hero-right">
            <div key={`${client.id}-spotlight`} className="ctv-hero-content">
              <div className="ctv-spotlight-label">Active spotlight</div>
              <div className="ctv-spotlight-id">{spotlight.id}</div>
              <div className="ctv-spotlight-title">{spotlight.title}</div>
              <div className="ctv-spotlight-desc">{spotlight.description}</div>
              <div className="ctv-spotlight-assignee">
                <div className="ctv-assignee-avatar">
                  {initials(spotlight.assignee)}
                </div>
                <span className="ctv-assignee-name">{spotlight.assignee}</span>
                <span
                  className="ctv-spotlight-badge"
                  style={{
                    background: priorityBadge[spotlight.priority]?.bg ?? 'rgba(255,255,255,0.08)',
                    color: priorityBadge[spotlight.priority]?.text ?? 'rgba(255,255,255,0.6)',
                  }}
                >
                  {spotlight.priority}
                </span>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* ─── CARD DOCK ─────────────────────────────────────────────────────── */}
      <div className="ctv-dock">
        <div className="ctv-dock-header">
          <span className="ctv-dock-title">All clients</span>
          <span className="ctv-dock-count">{clients.length} accounts</span>
        </div>

        <div className="ctv-dock-rail" ref={railRef}>
          {clients.map(c => {
            const isFocused = c.id === selectedId
            const cAccent = getAccent(c.criticalCount, c.openTickets, c.industry)

            return (
              <div
                key={c.id}
                data-client-id={c.id}
                tabIndex={0}
                role="button"
                aria-label={`${c.name}: ${c.openTickets} open tickets, ${c.slaCompliance} SLA`}
                aria-pressed={isFocused}
                className={`ctv-client-card${isFocused ? ' ctv-client-card--focused' : ''}`}
                onFocus={() => selectClient(c.id)}
                onMouseEnter={() => selectClient(c.id)}
                onClick={() => navigate(`/clients/${c.id}`)}
                onKeyDown={e => {
                  if (e.key === 'Enter') navigate(`/clients/${c.id}`)
                  if (e.key === 'ArrowRight') {
                    const next = railRef.current?.querySelector<HTMLElement>(`[data-client-id="${c.id}"] ~ .ctv-client-card`)
                    next?.focus()
                  }
                  if (e.key === 'ArrowLeft') {
                    const all = Array.from(railRef.current?.querySelectorAll<HTMLElement>('.ctv-client-card') ?? [])
                    const idx = all.indexOf(e.currentTarget as HTMLElement)
                    if (idx > 0) all[idx - 1].focus()
                  }
                }}
              >
                {/* Accent line at bottom */}
                <span
                  className="ctv-client-card-accent"
                  style={{ background: cAccent.cardLine }}
                />

                <div className="ctv-client-card-name">{c.name}</div>

                <div className="ctv-client-card-stats">
                  <div className="ctv-client-card-stat">
                    <span
                      className="ctv-client-card-stat-value"
                      style={{ color: c.openTickets > 0 ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.4)' }}
                    >
                      {c.openTickets}
                    </span>
                    <span className="ctv-client-card-stat-label">Open</span>
                  </div>
                  <div className="ctv-client-card-stat">
                    <span
                      className="ctv-client-card-stat-value"
                      style={{ color: parseFloat(c.slaCompliance) >= 95 ? '#6db48c' : '#e4a85e' }}
                    >
                      {c.slaCompliance}
                    </span>
                    <span className="ctv-client-card-stat-label">SLA</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
