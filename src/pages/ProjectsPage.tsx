import { useMemo, useRef, useState } from 'react'
import { projects } from '../data/projects'
import { tickets } from '../data/tickets'

// ─── Status badge colours ────────────────────────────────────────────────────
const statusBadge: Record<string, { bg: string; text: string }> = {
  'Active':    { bg: 'rgba(91,159,212,0.18)',  text: '#5b9fd4' },
  'At Risk':   { bg: 'rgba(239,120,104,0.18)', text: '#ef7868' },
  'Planning':  { bg: 'rgba(109,180,140,0.18)', text: '#6db48c' },
  'Completed': { bg: 'rgba(123,159,182,0.18)', text: '#7b9fb6' },
}

// ─── Hero accent wash per-project based on accentColor ───────────────────────
function getHeroAccent(color: string) {
  return {
    color: `${color}38`,
    soft:  `${color}18`,
  }
}

// ─── Initials from a name string ─────────────────────────────────────────────
function initials(name: string) {
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
}

export default function ProjectsPage() {
  const [selectedId, setSelectedId] = useState(projects[0].id)
  const railRef = useRef<HTMLDivElement>(null)

  const project = projects.find(p => p.id === selectedId) ?? projects[0]
  const accent  = getHeroAccent(project.accentColor)

  // Pick one active ticket for spotlight
  const projectTickets = useMemo(
    () => tickets.filter(t => t.clientId === project.clientId),
    [project.clientId]
  )
  const spotlight =
    projectTickets.find(t => t.priority === 'Critical') ??
    projectTickets.find(t => t.priority === 'High') ??
    projectTickets[0]

  const slaOk = project.progress >= project.budgetUsed

  function selectProject(id: string) {
    setSelectedId(id)
    setTimeout(() => {
      const card = railRef.current?.querySelector(
        `[data-project-id="${id}"]`
      ) as HTMLElement | null
      card?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
    }, 0)
  }

  return (
    <div className="clients-tv-shell">

      {/* ─── CINEMATIC HERO ─────────────────────────────────────────────────── */}
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

        {/* ── LEFT COLUMN: dominant project identity + metrics ── */}
        <div className="ctv-hero-left">
          <div key={project.id} className="ctv-hero-content">

            <div className="ctv-category">
              <span className="ctv-category-dot" style={{ color: project.accentColor }} />
              {project.clientName}
            </div>

            <h1 className="ctv-client-name">{project.title}</h1>

            <div className="ctv-meta-line">
              <span>{project.status}</span>
              <span className="ctv-meta-sep" />
              <span>{project.team.length} engineers</span>
              <span className="ctv-meta-sep" />
              <span>{project.startDate} → {project.endDate}</span>
            </div>

            {/* Bold, TV-readable metrics */}
            <div className="ctv-metrics">
              <div className="ctv-metric">
                <span
                  className="ctv-metric-value"
                  style={{ color: project.accentColor }}
                >
                  {project.progress}%
                </span>
                <span className="ctv-metric-label">Progress</span>
              </div>
              <div className="ctv-metric">
                <span
                  className={`ctv-metric-value${project.budgetUsed > project.progress + 15 ? ' ctv-metric-value--critical' : ''}`}
                >
                  {project.budgetUsed}%
                </span>
                <span className="ctv-metric-label">Budget</span>
              </div>
              <div className="ctv-metric">
                <span className="ctv-metric-value">{project.team.length}</span>
                <span className="ctv-metric-label">Engineers</span>
              </div>
              <div className="ctv-metric">
                <span
                  className={`ctv-metric-value${slaOk ? ' ctv-metric-value--sla-ok' : ''}`}
                  style={!slaOk ? { color: '#e4a85e' } : {}}
                >
                  {project.status}
                </span>
                <span className="ctv-metric-label">Status</span>
              </div>
            </div>

            {/* Progress vs spend bar */}
            <div className="ctv-distro">
              <div className="ctv-distro-label">Progress vs Budget spend</div>
              <div
                className="ctv-distro-bar"
                role="img"
                aria-label={`Progress and budget for ${project.title}`}
                style={{ height: 10 }}
              >
                <span
                  className="ctv-distro-bar-seg"
                  style={{
                    width: `${project.progress}%`,
                    background: project.accentColor,
                  }}
                />
              </div>
              <div className="ctv-distro-bar" style={{ height: 4, marginTop: -4 }}>
                <span
                  className="ctv-distro-bar-seg"
                  style={{
                    width: `${project.budgetUsed}%`,
                    background: project.budgetUsed > project.progress
                      ? '#ef7868'
                      : '#6db48c',
                    opacity: 0.55,
                  }}
                />
              </div>
              <div className="ctv-distro-legend">
                <span className="ctv-distro-legend-item">
                  <span
                    className="ctv-distro-legend-dot"
                    style={{ background: project.accentColor }}
                  />
                  {project.progress}% complete
                </span>
                <span className="ctv-distro-legend-item">
                  <span
                    className="ctv-distro-legend-dot"
                    style={{
                      background: project.budgetUsed > project.progress
                        ? '#ef7868'
                        : '#6db48c',
                    }}
                  />
                  {project.budgetUsed}% budget used
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN: spotlight ── */}
        <div className="ctv-hero-right">
          <div key={`${project.id}-spotlight`} className="ctv-hero-content">

            <div className="ctv-spotlight-label">Team spotlight</div>

            {/* Team member avatars */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
              {project.team.map(name => (
                <div
                  key={name}
                  className="ctv-assignee-avatar"
                  style={{
                    width: 40,
                    height: 40,
                    fontSize: '0.78rem',
                    background: `${project.accentColor}28`,
                    borderColor: `${project.accentColor}44`,
                  }}
                  title={name}
                >
                  {initials(name)}
                </div>
              ))}
            </div>

            {/* Project description */}
            <div
              style={{
                fontSize: '0.9rem',
                lineHeight: 1.65,
                color: 'rgba(255,255,255,0.48)',
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical' as const,
                WebkitLineClamp: 4,
                overflow: 'hidden',
                marginBottom: 28,
              }}
            >
              {project.description}
            </div>

            {/* Spotlight ticket if any */}
            {spotlight && (
              <>
                <div
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase' as const,
                    color: 'rgba(255,255,255,0.25)',
                    marginBottom: 10,
                  }}
                >
                  Latest ticket
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  <div className="ctv-assignee-avatar">{initials(spotlight.assignee)}</div>
                  <span className="ctv-assignee-name">{spotlight.title}</span>
                  <span
                    className="ctv-spotlight-badge"
                    style={{
                      background:
                        statusBadge[spotlight.priority]?.bg ??
                        'rgba(255,255,255,0.08)',
                      color:
                        statusBadge[spotlight.priority]?.text ??
                        'rgba(255,255,255,0.6)',
                    }}
                  >
                    {spotlight.priority}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ─── CARD DOCK ──────────────────────────────────────────────────────── */}
      <div className="ctv-dock">
        <div className="ctv-dock-header">
          <span className="ctv-dock-title">All projects</span>
          <span className="ctv-dock-count">{projects.length} initiatives</span>
        </div>

        <div className="ctv-dock-rail" ref={railRef}>
          {projects.map(p => {
            const isFocused = p.id === selectedId
            const badge = statusBadge[p.status]

            return (
              <div
                key={p.id}
                data-project-id={p.id}
                tabIndex={0}
                role="button"
                aria-label={`${p.title}: ${p.status}, ${p.progress}% progress`}
                aria-pressed={isFocused}
                className={`ctv-client-card${isFocused ? ' ctv-client-card--focused' : ''}`}
                onFocus={() => selectProject(p.id)}
                onMouseEnter={() => selectProject(p.id)}
                onKeyDown={e => {
                  if (e.key === 'ArrowRight') {
                    const all = Array.from(
                      railRef.current?.querySelectorAll<HTMLElement>(
                        '.ctv-client-card'
                      ) ?? []
                    )
                    const idx = all.indexOf(e.currentTarget as HTMLElement)
                    if (idx < all.length - 1) all[idx + 1].focus()
                  }
                  if (e.key === 'ArrowLeft') {
                    const all = Array.from(
                      railRef.current?.querySelectorAll<HTMLElement>(
                        '.ctv-client-card'
                      ) ?? []
                    )
                    const idx = all.indexOf(e.currentTarget as HTMLElement)
                    if (idx > 0) all[idx - 1].focus()
                  }
                }}
              >
                {/* Accent line at bottom */}
                <span
                  className="ctv-client-card-accent"
                  style={{ background: p.accentColor }}
                />

                {/* Status badge + project id */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 8,
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.65rem',
                      color: 'rgba(255,255,255,0.28)',
                      letterSpacing: '0.06em',
                    }}
                  >
                    {p.id}
                  </span>
                  <span
                    className="ctv-spotlight-badge"
                    style={{
                      background: badge?.bg ?? 'rgba(255,255,255,0.06)',
                      color: badge?.text ?? 'rgba(255,255,255,0.5)',
                      marginLeft: 0,
                      fontSize: '0.6rem',
                    }}
                  >
                    {p.status}
                  </span>
                </div>

                <div className="ctv-client-card-name" style={{ fontSize: '0.95rem' }}>
                  {p.title}
                </div>

                {/* Progress bar */}
                <div>
                  <div
                    style={{
                      height: 4,
                      borderRadius: 999,
                      background: 'rgba(255,255,255,0.07)',
                      overflow: 'hidden',
                      marginBottom: 6,
                    }}
                  >
                    <div
                      style={{
                        width: `${p.progress}%`,
                        height: '100%',
                        background: p.accentColor,
                        borderRadius: 999,
                        transition: 'width 600ms var(--ease-out-expo)',
                      }}
                    />
                  </div>
                  <div className="ctv-client-card-stats">
                    <div className="ctv-client-card-stat">
                      <span
                        className="ctv-client-card-stat-value"
                        style={{ color: p.accentColor }}
                      >
                        {p.progress}%
                      </span>
                      <span className="ctv-client-card-stat-label">Done</span>
                    </div>
                    <div className="ctv-client-card-stat">
                      <span className="ctv-client-card-stat-value">
                        {p.team.length}
                      </span>
                      <span className="ctv-client-card-stat-label">Team</span>
                    </div>
                    <div className="ctv-client-card-stat">
                      <span
                        className="ctv-client-card-stat-value"
                        style={{
                          color:
                            p.budgetUsed > p.progress
                              ? '#ef7868'
                              : 'rgba(255,255,255,0.85)',
                        }}
                      >
                        {p.budgetUsed}%
                      </span>
                      <span className="ctv-client-card-stat-label">Budget</span>
                    </div>
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
