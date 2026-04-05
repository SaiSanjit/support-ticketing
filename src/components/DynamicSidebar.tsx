import { Link, useLocation } from 'react-router-dom'
import { Home, Clock, Users, Wallet, Settings, Moon, Sun } from 'lucide-react'
import { useTheme } from '@/lib/useTheme'

const NAV_ITEMS = [
  { label: 'Dashboard', icon: Home, path: '/dashboard' },
  { label: 'Activity', icon: Clock, path: '/activity' },
  { label: 'Clients', icon: Users, path: '/clients' },
  { label: 'Billing', icon: Wallet, path: '/billing' },
]

export function DynamicSidebar() {
  const location = useLocation()
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <aside className="fixed left-6 top-1/2 -translate-y-1/2 z-[100] flex flex-col items-center py-4 px-2.5 gap-4 rounded-[40px] shadow-2xl transition-all duration-300" style={{ backgroundColor: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}>
      <div className="flex flex-col gap-3">
        {NAV_ITEMS.map((item) => {
          // treat "/" and "/dashboard" as active for dashboard
          const isActive = location.pathname.startsWith(item.path) || (item.path === '/dashboard' && location.pathname === '/')
          const Icon = item.icon
          return (
            <Link
              key={item.path}
              to={item.path}
              title={item.label}
              className={`flex items-center justify-center w-12 h-12 rounded-[20px] transition-all duration-300 ${
                isActive 
                  ? 'bg-text-primary text-bg-page shadow-lg scale-105' 
                  : 'text-text-tertiary hover:text-text-primary hover:bg-bg-hover'
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
            </Link>
          )
        })}
      </div>

      <div className="w-8 h-px bg-border my-1" />

      <div className="flex flex-col gap-3">
        <button 
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          className="flex items-center justify-center w-12 h-12 rounded-[20px] text-text-tertiary hover:text-text-primary hover:bg-bg-hover transition-all duration-300"
        >
          {theme === 'dark' ? <Sun size={20} strokeWidth={2} /> : <Moon size={20} strokeWidth={2} />}
        </button>
        
        <Link 
          to="/settings/general"
          title="Settings"
          className={`flex items-center justify-center w-12 h-12 rounded-[20px] transition-all duration-300 ${
            location.pathname.startsWith('/settings') 
              ? 'bg-text-primary text-bg-page shadow-lg scale-105' 
              : 'text-text-tertiary hover:text-text-primary hover:bg-bg-hover'
          }`}
        >
          <Settings size={20} strokeWidth={location.pathname.startsWith('/settings') ? 2.5 : 2} />
        </Link>
      </div>
    </aside>
  )
}
