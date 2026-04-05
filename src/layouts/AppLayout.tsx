import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom'
import {
  Search, ArrowLeft,
  CreditCard, Edit2, Trash2
} from 'lucide-react'
import { useAuthStore } from '@/store/auth-store'
import { DynamicSidebar } from '@/components/DynamicSidebar'

// ─── AppLayout ─────────────────────────────────────────────────────
export function AppLayout() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  // Get current page title
  const segments = location.pathname.split('/').filter(Boolean)
  let title = 'Dashboard'
  if (segments[0] && segments[0] !== 'dashboard') {
    title = segments[0].charAt(0).toUpperCase() + segments[0].slice(1)
  }

  return (
    <div
      className="flex h-screen w-full overflow-hidden"
      style={{ background: 'var(--gradient-page)' }}
    >
      <DynamicSidebar />

      <div className="flex flex-col flex-1 min-w-0 pl-24 md:pl-28 transition-all duration-300">
        {/* ── Header ──────────────────────────────────────── */}
        <header className="flex items-center justify-between pr-6 md:pr-8 py-5 flex-shrink-0 animate-fade-in relative z-50">

          {/* Left: Logo & Nav */}
          <div className="flex items-center gap-6">
            <Link to="/" className="text-2xl font-bold italic tracking-tighter text-text-primary hover:opacity-80 transition-opacity">
              sf.
            </Link>

            <div className="flex items-center gap-2">

            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-full bg-bg-surface/20 border border-border flex items-center justify-center text-text-secondary hover:text-text-primary transition-all hover:bg-bg-hover"
            >
              <ArrowLeft size={16} />
            </button>

            <h1 className="text-xl font-medium text-text-primary ml-2 tracking-wide">{title}</h1>

          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">



          <div className="flex items-center gap-3">
            <div className="relative group cursor-pointer">
              <img
                src={user?.avatarUrl ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=User`}
                alt={user?.name ?? 'User'}
                className="w-9 h-9 rounded-full object-cover border-2 border-border group-hover:border-border-active transition-all"
              />
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-accent-mint rounded-full border-2 border-bg-page"></div>
            </div>
            <button className="w-9 h-9 rounded-full glass-btn p-0 flex items-center justify-center transition-colors">
              <Search size={14} />
            </button>

          </div>
        </div>
      </header>

      {/* ── Main Content ────────────────────────────────── */}
      <main className="flex-1 min-h-0 relative z-10 flex flex-col pr-6 md:pr-8 pb-6">
        <Outlet />
      </main>
      
      </div>
    </div>
  )
}
