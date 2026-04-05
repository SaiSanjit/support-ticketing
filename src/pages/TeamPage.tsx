import { Users } from 'lucide-react'
import { SEED_USERS } from '@/mock/seed'

export function TeamPage() {
  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Users size={18} className="text-text-secondary" />
        <h1 className="text-text-primary font-semibold text-lg">Team</h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SEED_USERS.map((u) => (
          <div key={u.id} className="flex items-center gap-3 p-4 rounded-xl border border-border bg-bg-elevated">
            <img src={u.avatarUrl} alt={u.name} className="w-10 h-10 rounded-full object-cover" />
            <div>
              <p className="text-text-primary text-[13px] font-medium">{u.name}</p>
              <p className="text-text-tertiary text-[11px]">{u.email}</p>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-bg-surface text-text-secondary border border-border mt-1 inline-block capitalize">
                {u.role}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
