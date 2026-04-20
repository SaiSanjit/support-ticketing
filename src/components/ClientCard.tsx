import type { Client } from '../data/clients'

interface ClientCardProps {
  client: Client
  totalTickets: number
  criticalTickets: number
  mediumTickets: number
  resolvedTickets: number
  active?: boolean
  onFocus?: () => void
  onClick?: () => void
}

function toPercent(value: number, total: number) {
  if (!total) {
    return 0
  }

  return (value / total) * 100
}

export default function ClientCard({
  client,
  totalTickets,
  criticalTickets,
  mediumTickets,
  resolvedTickets,
  active,
  onFocus,
  onClick,
}: ClientCardProps) {
  const highTickets = Math.max(client.openTickets - criticalTickets - mediumTickets, 0)

  return (
    <article
      tabIndex={0}
      className="client-card tv-focusable"
      onFocus={onFocus}
      onMouseEnter={onFocus}
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          onClick?.()
        }
      }}
      style={{
        borderColor: active ? 'var(--primary)' : 'var(--surface-border)',
        borderWidth: active ? '2px' : '1px',
        boxShadow: active
          ? '0 0 0 3px var(--focus-ring-soft), 0 24px 48px rgba(49,58,67,0.18), var(--shadow-md)'
          : 'var(--shadow-card)',
        transform: active ? 'scale(1.08) translateY(-4px)' : 'scale(1) translateY(0)',
        transformOrigin: 'bottom center',
        transition:
          'transform var(--duration-base) var(--ease-out-expo), box-shadow var(--duration-base) var(--ease-out-expo), border-color var(--duration-base) var(--ease-out-expo)',
        zIndex: active ? 2 : 1,
      }}
    >
      <div className="client-card-header">
        <div>
          <div className="client-card-label">{client.industry}</div>
          <h3 className="client-card-title">{client.name}</h3>
        </div>
        <div className="client-card-pill">{client.region}</div>
      </div>

      <div className="client-card-metrics">
        <div>
          <span>Projects</span>
          <strong>{client.projects}</strong>
        </div>
        <div>
          <span>Open</span>
          <strong>{client.openTickets}</strong>
        </div>
        <div>
          <span>SLA</span>
          <strong>{client.slaCompliance}</strong>
        </div>
      </div>

      <div className="stacked-bar" aria-label={`${client.name} priority breakdown`}>
        <span style={{ width: `${toPercent(criticalTickets, totalTickets)}%`, background: 'var(--status-critical)' }} />
        <span style={{ width: `${toPercent(highTickets, totalTickets)}%`, background: 'var(--status-high)' }} />
        <span style={{ width: `${toPercent(mediumTickets, totalTickets)}%`, background: 'var(--status-medium)' }} />
        <span style={{ width: `${toPercent(resolvedTickets, totalTickets)}%`, background: 'var(--status-resolved)' }} />
      </div>

      <div className="client-card-footer">
        <span>{totalTickets} total</span>
        <span>{criticalTickets} critical</span>
      </div>
    </article>
  )
}
