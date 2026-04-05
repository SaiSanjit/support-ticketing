import { Outlet, Link } from 'react-router-dom'

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-bg-page flex flex-col items-center justify-center px-4">
      {/* Gradient orb */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% -20%, rgba(122,255,161,0.08) 0%, transparent 70%)',
        }}
      />
      <div className="relative w-full max-w-[400px]">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 mb-8 justify-center">
          <span className="text-accent-mint font-bold text-3xl tracking-tight">Fl</span>
          <span className="text-text-primary font-bold text-3xl tracking-tight">ōw</span>
        </Link>
        {/* Card */}
        <div
          className="rounded-xl border border-border p-8"
          style={{ background: 'var(--color-bg-surface)' }}
        >
          <Outlet />
        </div>
      </div>
    </div>
  )
}
