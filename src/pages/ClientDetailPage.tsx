import { useMemo, useRef, useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { clients } from '../data/clients'
import { tickets, type Ticket } from '../data/tickets'

// ─── Accent palette (same logic as ClientsPage for consistency) ───────────────
interface AccentConfig {
  color: string
  soft: string
  bar: string
  cardLine: string
}

function getPriorityAccent(priority: string): AccentConfig {
  switch (priority) {
    case 'Critical': return { color: 'rgba(239,80,68,0.22)', soft: 'rgba(239,80,68,0.09)', bar: '#ef7868', cardLine: 'rgba(239,120,104,0.7)' }
    case 'High':     return { color: 'rgba(220,140,60,0.20)', soft: 'rgba(220,140,60,0.08)', bar: '#e4a85e', cardLine: 'rgba(228,168,94,0.7)' }
    case 'Resolved': return { color: 'rgba(109,180,140,0.18)', soft: 'rgba(109,180,140,0.08)', bar: '#6db48c', cardLine: 'rgba(109,180,140,0.65)' }
    default:         return { color: 'rgba(123,159,182,0.18)', soft: 'rgba(123,159,182,0.08)', bar: '#7b9fb6', cardLine: 'rgba(123,159,182,0.65)' }
  }
}

const priorityBadge: Record<string, { bg: string; text: string }> = {
  Critical: { bg: 'rgba(239,120,104,0.18)', text: '#ef7868' },
  High:     { bg: 'rgba(228,168,94,0.18)',  text: '#e4a85e' },
  Medium:   { bg: 'rgba(123,159,182,0.18)', text: '#7b9fb6' },
  Resolved: { bg: 'rgba(109,180,140,0.18)', text: '#6db48c' },
}

function initials(name: string) {
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
}

export default function ClientDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const client = useMemo(() => clients.find(c => c.id === id), [id])
  const clientTickets = useMemo(() => tickets.filter(t => t.clientId === id), [id])

  const critical = useMemo(() => clientTickets.filter(t => t.priority === 'Critical'), [clientTickets])
  const highActive = useMemo(() => clientTickets.filter(t => (t.priority === 'High' || t.priority === 'Medium') && t.status !== 'Resolved'), [clientTickets])
  const resolved = useMemo(() => clientTickets.filter(t => t.status === 'Resolved'), [clientTickets])

  const defaultTicket = critical[0] || highActive[0] || resolved[0] || clientTickets[0]
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null)
  
  // Set initial selected ticket once data is loaded
  useEffect(() => {
    if (defaultTicket && !selectedTicketId) {
      setSelectedTicketId(defaultTicket.id)
    }
  }, [defaultTicket, selectedTicketId])

  const selectedTicket = useMemo(() => clientTickets.find(t => t.id === selectedTicketId) || defaultTicket, [selectedTicketId, clientTickets, defaultTicket])
  
  const lanesRef = useRef<HTMLDivElement>(null)

  if (!client) {
    return <div className="clients-tv-shell" style={{ padding: '40px' }}>Client not found</div>
  }

  const accent = getPriorityAccent(selectedTicket?.priority ?? 'Medium')

  function selectTicket(tId: string) {
    setSelectedTicketId(tId)
    setTimeout(() => {
      const card = lanesRef.current?.querySelector(`[data-ticket-id="${tId}"]`) as HTMLElement | null
      const rail = card?.closest('.cd-lane-rail') as HTMLElement | null
      if (card && rail) {
         const scrollLeft = card.offsetLeft - rail.offsetLeft - (rail.offsetWidth / 2) + (card.offsetWidth / 2)
         rail.scrollTo({ left: Math.max(0, scrollLeft), behavior: 'smooth' })
      }
    }, 0)
  }

  function handleKeyDown(e: React.KeyboardEvent, tId: string) {
    if (e.key === 'Enter') {
      // In a real app, this would open full ticket details. For now, maybe just highlight it.
    }
    
    // Very basic keyboard nav within the current DOM structure
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      const allCards = Array.from(lanesRef.current?.querySelectorAll('.cd-ticket-card') ?? []) as HTMLElement[]
      const currentIndex = allCards.findIndex(c => c.getAttribute('data-ticket-id') === tId)
      
      let nextIndex = currentIndex
      if (e.key === 'ArrowRight' && currentIndex < allCards.length - 1) nextIndex++
      if (e.key === 'ArrowLeft' && currentIndex > 0) nextIndex--
      
      // Basic up/down (just jumps to first in prev/next lane, not full spatial nav for simplicity)
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
         const currentLane = (e.currentTarget as HTMLElement).closest('.cd-lane')
         const lanes = Array.from(lanesRef.current?.querySelectorAll('.cd-lane') ?? [])
         const laneIdx = lanes.indexOf(currentLane as Element)
         
         let nextLaneIdx = laneIdx
         if (e.key === 'ArrowDown' && laneIdx < lanes.length - 1) nextLaneIdx++
         if (e.key === 'ArrowUp' && laneIdx > 0) nextLaneIdx--
         
         if (nextLaneIdx !== laneIdx) {
           const nextLaneCard = lanes[nextLaneIdx].querySelector('.cd-ticket-card') as HTMLElement
           if (nextLaneCard) nextLaneCard.focus()
         }
      } else if (nextIndex !== currentIndex) {
        allCards[nextIndex].focus()
      }
      e.preventDefault()
    }
  }

  return (
    <div className="clients-tv-shell">
      {/* ─── CONTEXT BAR ──────────────────────────────────────────────────────── */}
      <div className="cd-context-bar">
        <button className="cd-back-btn" onClick={() => navigate('/clients')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          <span className="cd-back-text">Back</span>
        </button>
        <span className="cd-context-sep"></span>
        <span className="cd-context-client">{client.name}</span>
        <span className="cd-context-dot">·</span>
        <span className="cd-context-meta">{client.industry}</span>
        <span className="cd-context-dot">·</span>
        <span className="cd-context-meta">{client.region}</span>
        
        <div className="cd-context-stats">
          <span className="cd-context-stat">{client.totalTickets} total</span>
          <span className="cd-context-stat">{client.openTickets} open</span>
          <span className="cd-context-stat">{client.slaCompliance} SLA</span>
        </div>
      </div>

      {/* ─── CINEMATIC HERO ────────────────────────────────────────────────── */}
      <div className="cd-hero ctv-hero">
        <div className="ctv-hero-base" />
        <div
          className="ctv-hero-accent"
          style={{
            background: `
              radial-gradient(ellipse at 30% 0%, ${accent.color} 0%, transparent 70%),
              radial-gradient(ellipse at 80% 60%, ${accent.soft} 0%, transparent 60%)
            `,
          }}
        />
        <div className="ctv-hero-noise" />
        <div className="ctv-hero-vignette" />

        {selectedTicket && (
           <div className="ctv-hero-left" style={{ paddingBottom: '32px' }}>
              <div key={selectedTicket.id} className="ctv-hero-content">
                 <div className="cd-hero-eyebrow">
                    Active Spotlight
                 </div>
                 
                 <div className="cd-hero-ticket">
                    <div className="cd-hero-ticket-main">
                        <div className="cd-hero-id">{selectedTicket.id}</div>
                        <h1 className="cd-hero-title">{selectedTicket.title}</h1>
                        <p className="cd-hero-desc">{selectedTicket.description}</p>
                    </div>
                    
                    <div className="cd-hero-ticket-meta">
                       <div className="cd-hero-meta-group">
                          <span className="cd-hero-meta-label">Assignee</span>
                          <div className="cd-hero-assignee">
                             <div className="ctv-assignee-avatar">
                               {initials(selectedTicket.assignee)}
                             </div>
                             <span className="ctv-assignee-name">{selectedTicket.assignee}</span>
                          </div>
                       </div>
                       
                       <div className="cd-hero-meta-group">
                          <span className="cd-hero-meta-label">Status</span>
                          <span className="cd-hero-status">{selectedTicket.status}</span>
                       </div>
                       
                       <div className="cd-hero-meta-group">
                          <span className="cd-hero-meta-label">Priority & Age</span>
                          <div className="cd-hero-priority-age">
                              <span
                                className="ctv-spotlight-badge"
                                style={{
                                  background: priorityBadge[selectedTicket.priority]?.bg ?? 'rgba(255,255,255,0.08)',
                                  color: priorityBadge[selectedTicket.priority]?.text ?? 'rgba(255,255,255,0.6)',
                                  marginLeft: 0
                                }}
                              >
                                {selectedTicket.priority}
                              </span>
                              <span className="cd-hero-age">{selectedTicket.timeAgo}</span>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        )}
      </div>

      {/* ─── BROWSE LANES ────────────────────────────────────────────────────── */}
      <div className="cd-lanes" ref={lanesRef}>
        
        {critical.length > 0 && (
          <div className="cd-lane">
            <div className="cd-lane-header">
              <span className="cd-lane-title" style={{ color: '#ef7868' }}>Critical</span>
              <span className="cd-lane-count">{critical.length} tickets</span>
            </div>
            <div className="cd-lane-rail">
              {critical.map(t => (
                <TicketRowCard key={t.id} ticket={t} isFocused={selectedTicketId === t.id} onSelect={() => selectTicket(t.id)} onKeyDown={(e) => handleKeyDown(e, t.id)} accentLine="#ef7868" />
              ))}
            </div>
          </div>
        )}

        {highActive.length > 0 && (
          <div className="cd-lane">
            <div className="cd-lane-header">
              <span className="cd-lane-title" style={{ color: '#e4a85e' }}>High / Active</span>
              <span className="cd-lane-count">{highActive.length} tickets</span>
            </div>
            <div className="cd-lane-rail">
              {highActive.map(t => (
                <TicketRowCard key={t.id} ticket={t} isFocused={selectedTicketId === t.id} onSelect={() => selectTicket(t.id)} onKeyDown={(e) => handleKeyDown(e, t.id)} accentLine={t.priority === 'High' ? '#e4a85e' : '#7b9fb6'} />
              ))}
            </div>
          </div>
        )}

        {resolved.length > 0 && (
          <div className="cd-lane">
            <div className="cd-lane-header">
              <span className="cd-lane-title" style={{ color: '#6db48c' }}>Resolved</span>
              <span className="cd-lane-count">{resolved.length} tickets</span>
            </div>
            <div className="cd-lane-rail">
              {resolved.map(t => (
                <TicketRowCard key={t.id} ticket={t} isFocused={selectedTicketId === t.id} onSelect={() => selectTicket(t.id)} onKeyDown={(e) => handleKeyDown(e, t.id)} accentLine="#6db48c" />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

function TicketRowCard({ ticket, isFocused, onSelect, onKeyDown, accentLine }: { ticket: Ticket, isFocused: boolean, onSelect: () => void, onKeyDown: (e: React.KeyboardEvent) => void, accentLine: string }) {
  return (
    <div
      data-ticket-id={ticket.id}
      tabIndex={0}
      role="button"
      className={`cd-ticket-card${isFocused ? ' cd-ticket-card--focused' : ''}`}
      onFocus={onSelect}
      onMouseEnter={onSelect}
      onKeyDown={onKeyDown}
    >
      <span className="cd-ticket-card-accent" style={{ background: accentLine }} />
      <div className="cd-ticket-card-top">
         <span className="cd-ticket-card-id">{ticket.id}</span>
         <span className="cd-ticket-card-dot" style={{ background: accentLine }}></span>
      </div>
      <div className="cd-ticket-card-title">{ticket.title}</div>
      <div className="cd-ticket-card-bottom">
         <div className="ctv-assignee-avatar cd-ticket-avatar">
           {initials(ticket.assignee)}
         </div>
      </div>
    </div>
  )
}
