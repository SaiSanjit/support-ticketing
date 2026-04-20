import type { ReactNode } from 'react'
import { Activity, Folder, Home, Moon, Sun, Ticket, Users } from 'lucide-react'
import { NavLink } from 'react-router-dom'

type ThemeMode = 'white' | 'black'

interface NavItem {
  path: string
  icon: ReactNode
  label: string
}

const navItems: NavItem[] = [
  { path: '/', icon: <Home size={16} strokeWidth={2.1} />, label: 'Overview' },
  { path: '/projects', icon: <Folder size={16} strokeWidth={2.1} />, label: 'Projects' },
  { path: '/clients', icon: <Users size={16} strokeWidth={2.1} />, label: 'Clients' },
  { path: '/tickets', icon: <Ticket size={16} strokeWidth={2.1} />, label: 'Tickets' },
  { path: '/team', icon: <Activity size={16} strokeWidth={2.1} />, label: 'Team' },
]

interface NavRailProps {
  theme: ThemeMode
  onThemeChange: (theme: ThemeMode) => void
}

export default function NavRail({ theme, onThemeChange }: NavRailProps) {
  return (
    <header className="top-nav">
      <div className="top-nav-brand">
        <div className="top-nav-chip">
          <span className="status-dot" />
          Support TV
        </div>
      </div>

      <nav className="top-nav-links" aria-label="Primary navigation">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `top-nav-link tv-focusable${isActive ? ' active' : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="top-nav-status">
        <div className="theme-toggle" role="group" aria-label="Choose theme">
          <button
            type="button"
            className={`theme-toggle-button tv-focusable${theme === 'white' ? ' active' : ''}`}
            onClick={() => onThemeChange('white')}
            aria-pressed={theme === 'white'}
          >
            <Sun size={15} strokeWidth={2} />
            White
          </button>
          <button
            type="button"
            className={`theme-toggle-button tv-focusable${theme === 'black' ? ' active' : ''}`}
            onClick={() => onThemeChange('black')}
            aria-pressed={theme === 'black'}
          >
            <Moon size={15} strokeWidth={2} />
            Black
          </button>
        </div>
        <div className="top-nav-chip">5 regions live</div>
      </div>
    </header>
  )
}
