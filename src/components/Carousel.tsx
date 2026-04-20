// Carousel — TV-style horizontal scroll with D-pad left/right navigation
import { useRef, useState, type KeyboardEvent } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Ticket } from '../data/tickets'
import { FeaturedCard } from './Card'

interface CarouselProps {
  tickets: Ticket[]
}

export default function Carousel({ tickets }: CarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  const scrollTo = (index: number) => {
    const clamped = Math.max(0, Math.min(index, tickets.length - 1))
    setActiveIndex(clamped)
    const el = scrollRef.current?.children[clamped] as HTMLElement
    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
    ;(el?.querySelector('[tabindex="0"]') as HTMLElement)?.focus()
  }

  // D-pad: Left/Right within carousel, Down passes focus to client watchlists
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>, index: number) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); scrollTo(index + 1) }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); scrollTo(index - 1) }
    if (e.key === 'ArrowDown')  {
      e.preventDefault()
      const next = document.getElementById('client-watchlists')
      next?.querySelector<HTMLElement>('[tabindex="0"]')?.focus()
    }
  }

  return (
    <div
      className="ios-surface"
      style={{
        borderRadius: 36,
        padding: '28px',
        overflow: 'hidden',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-6)', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--text-primary)' }}>
            Urgent Alerts
          </h2>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginTop: 6 }}>
            {tickets.length} live issues across critical and high-priority queues
          </p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-2)', padding: 6, borderRadius: 'var(--radius-pill)', background: 'rgba(255, 255, 255, 0.62)', border: '1px solid rgba(255,255,255,0.7)' }}>
          <button onClick={() => scrollTo(activeIndex - 1)} style={{ width: 40, height: 40, borderRadius: 16, background: 'var(--surface-soft)', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <ChevronLeft size={18} />
          </button>
          <button onClick={() => scrollTo(activeIndex + 1)} style={{ width: 40, height: 40, borderRadius: 16, background: 'var(--surface-soft)', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div ref={scrollRef} style={{ display: 'flex', gap: 'var(--space-5)', overflowX: 'auto', paddingTop: '24px', paddingBottom: '32px', marginTop: '-24px', marginBottom: '-16px', scrollbarWidth: 'none' }}>
        {tickets.map((ticket, i) => (
          <div key={ticket.id} onKeyDown={(e) => handleKeyDown(e, i)}>
            <FeaturedCard
              ticket={ticket}
              isActive={i === activeIndex}
              onFocus={() => setActiveIndex(i)}
            />
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-5)', justifyContent: 'center' }}>
        {tickets.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            style={{
              width: i === activeIndex ? 24 : 8,
              height: 8,
              borderRadius: 'var(--radius-pill)',
              background: i === activeIndex ? 'var(--teal)' : 'rgba(86, 124, 141, 0.18)',
              transition: 'all var(--duration-base) var(--ease-out-expo)',
              cursor: 'pointer',
              border: 'none',
            }}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
