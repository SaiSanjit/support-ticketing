import { Target } from 'lucide-react'

export function GoalsPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-8">
      <div className="w-12 h-12 rounded-2xl bg-accent-lavender/10 flex items-center justify-center">
        <Target size={22} className="text-accent-lavender" />
      </div>
      <h1 className="text-text-primary font-bold text-2xl tracking-tight">Goals</h1>
      <p className="text-text-secondary text-sm max-w-sm">
        Track OKRs and team objectives across projects. Coming soon.
      </p>
    </div>
  )
}
