import { useParams } from 'react-router-dom'

export function PortalPage() {
  const { token } = useParams<{ token: string }>()

  return (
    <div className="min-h-screen bg-bg-page flex flex-col items-center justify-center gap-4">
      <span className="text-accent-mint font-bold text-3xl tracking-tight">Flōw</span>
      <div className="border border-border rounded-xl p-8 bg-bg-surface max-w-sm w-full text-center">
        <h1 className="text-text-primary font-bold text-xl mb-2">Shared Portal</h1>
        <p className="text-text-secondary text-sm">Token: <code className="text-accent-lavender">{token}</code></p>
        <p className="text-text-tertiary text-xs mt-3">Shared view — no login required.</p>
      </div>
    </div>
  )
}
