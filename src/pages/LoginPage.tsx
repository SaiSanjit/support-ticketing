import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth-store'
import { Mail, Lock, Loader2 } from 'lucide-react'

export function LoginPage() {
  const [email, setEmail] = useState('demo@flow.app')
  const [password, setPassword] = useState('password')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuthStore()
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const res = await login(email, password)
    setLoading(false)
    if (res.success) navigate('/dashboard')
    else setError(res.error ?? 'Login failed')
  }

  return (
    <div>
      <h2 className="text-text-primary font-bold text-xl mb-1 tracking-tight">Welcome back</h2>
      <p className="text-text-secondary text-sm mb-6">Sign in to your Flōw workspace</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-[12px] text-text-secondary font-medium">Email</span>
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-border bg-bg-elevated focus-within:border-accent-mint transition-colors">
            <Mail size={14} className="text-text-tertiary flex-shrink-0" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-transparent text-text-primary text-sm outline-none placeholder:text-text-tertiary"
              placeholder="you@example.com"
              required
            />
          </div>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-[12px] text-text-secondary font-medium">Password</span>
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-border bg-bg-elevated focus-within:border-accent-mint transition-colors">
            <Lock size={14} className="text-text-tertiary flex-shrink-0" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1 bg-transparent text-text-primary text-sm outline-none placeholder:text-text-tertiary"
              placeholder="••••••••"
              required
            />
          </div>
        </label>

        {error && (
          <p className="text-[12px] text-accent-peach bg-accent-peach/10 px-3 py-2 rounded-lg">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-sm text-bg-page transition-opacity disabled:opacity-70"
          style={{ background: 'var(--color-mint)' }}
        >
          {loading && <Loader2 size={14} className="animate-spin" />}
          Sign in
        </button>
      </form>

      <p className="text-center text-[12px] text-text-secondary mt-5">
        No account?{' '}
        <Link to="/signup" className="text-accent-mint hover:underline font-medium">
          Sign up
        </Link>
      </p>
    </div>
  )
}
