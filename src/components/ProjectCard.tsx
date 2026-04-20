import { Clock3, MoreHorizontal } from 'lucide-react'
import type { Project } from '../data/projects'
import Avatar from './Avatar'

interface ProjectCardProps {
  project: Project
  isActive?: boolean
  onFocus?: () => void
  onClick?: () => void
}

export function ProjectCard({ project, isActive, onFocus, onClick }: ProjectCardProps) {
  return (
    <div
      tabIndex={0}
      className={`tv-focusable ${isActive ? 'active' : ''}`}
      onFocus={onFocus}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
      role="button"
      style={{
        aspectRatio: '16/9',
        width: '420px',
        height: '236px',
        flexShrink: 0,
        borderRadius: '40px',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        background: '#1a1f24',
        border: isActive ? `4px solid ${project.accentColor}` : '4px solid var(--surface-border)',
        boxShadow: isActive
          ? `0 0 0 4px ${project.accentColor}33, 0 24px 48px rgba(0,0,0,0.3)`
          : '0 8px 24px rgba(0,0,0,0.1)',
        transform: isActive ? 'scale(1.1) translateY(-6px)' : 'scale(1) translateY(0)',
        transition: 'all var(--duration-base) var(--ease-out-expo)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0.05) 100%), radial-gradient(circle at top right, ${project.accentColor}44, transparent 50%)`,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div className="ott-poster-shimmer" />

      {/* Large typographic percentage overlay */}
      <div style={{
        position: 'absolute',
        top: '16px',
        right: '16px',
        fontSize: '4.5rem',
        fontWeight: 900,
        fontFamily: 'var(--font-display)',
        color: 'rgba(255, 255, 255, 0.1)',
        lineHeight: 1,
        letterSpacing: '-0.04em',
        zIndex: 0,
      }}>
        {project.progress}%
      </div>

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{
            fontSize: 'var(--text-xs)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            padding: '4px 10px',
            background: 'var(--surface-soft)',
            borderRadius: 'var(--radius-pill)',
            border: `1px solid ${project.accentColor}44`,
            color: 'var(--text-primary)',
          }}>
            {project.status}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#e0e0e0', fontSize: 'var(--text-xs)' }}>
            <Clock3 size={14} />
            {project.progress}%
          </div>
        </div>

        <div style={{ fontSize: 'var(--text-xs)', color: project.accentColor, fontWeight: 700 }}>
          {project.clientName}
        </div>

        <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: '#fff', lineHeight: 1.1 }}>
          {project.title}
        </h3>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 }}>
          <div style={{ display: 'flex', marginLeft: -8 }}>
            {project.team.slice(0, 3).map((member, i) => (
              <div key={member} style={{ marginLeft: i === 0 ? 0 : -10, position: 'relative', zIndex: 3 - i, border: '2px solid rgba(0,0,0,0.5)', borderRadius: '50%' }}>
                <Avatar name={member} size={28} />
              </div>
            ))}
            {project.team.length > 3 && (
              <div style={{
                width: 28, height: 28, borderRadius: '50%', background: 'var(--surface-soft)', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: -10, zIndex: 0,
                border: '2px solid rgba(0,0,0,0.5)'
              }}>
                <MoreHorizontal size={14} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
