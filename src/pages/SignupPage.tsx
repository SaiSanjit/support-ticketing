import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth-store'
import { Mail, Lock, User, Loader2 } from 'lucide-react'

export function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signup } = useAuthStore()
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const res = await signup(name, email, password)
    setLoading(false)
    if (res.success) navigate('/dashboard')
    else setError(res.error ?? 'Signup failed')
  }

  const field = (label: string, Icon: React.ElementType, input: React.ReactNode) => (
    <label className="flex flex-col gap-1.5">
      <span className="text-[12px] text-text-secondary font-medium">{label}</span>
      <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-border bg-bg-elevated focus-within:border-accent-mint transition-colors">
        <Icon size={14} className="text-text-tertiary flex-shrink-0" />
        {input}
      </div>
    </label>
  )

  return (
    <div>
      <h2 className="text-text-primary font-bold text-xl mb-1 tracking-tight">Create your account</h2>
      <p className="text-text-secondary text-sm mb-6">Start managing work beautifully</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {field('Name', User,
          <input type="text" value={name} onChange={(e) => setName(e.target.value)}
            className="flex-1 bg-transparent text-text-primary text-sm outline-none placeholder:text-text-tertiary"
            placeholder="Alex Morgan" required />
        )}
        {field('Email', Mail,
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="flex-1 bg-transparent text-text-primary text-sm outline-none placeholder:text-text-tertiary"
            placeholder="you@example.com" required />
        )}
        {field('Password', Lock,
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            className="flex-1 bg-transparent text-text-primary text-sm outline-none placeholder:text-text-tertiary"
            placeholder="••••••••" minLength={6} required />
        )}
        {error && (
          <p className="text-[12px] text-accent-peach bg-accent-peach/10 px-3 py-2 rounded-lg">{error}</p>
        )}
        <button
          type="submit" disabled={loading}
          className="flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-sm text-bg-page disabled:opacity-70"
          style={{ background: 'var(--color-mint)' }}
        >
          {loading && <Loader2 size={14} className="animate-spin" />}
          Create account
        </button>
      </form>

      <p className="text-center text-[12px] text-text-secondary mt-5">
        Already have an account?{' '}
        <Link to="/login" className="text-accent-mint hover:underline font-medium">Sign in</Link>
      </p>
    </div>
  )
}
