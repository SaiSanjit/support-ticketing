import { Users } from 'lucide-react'

export function SettingsMembersPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-8">
      <div className="w-12 h-12 rounded-2xl bg-accent-yellow/10 flex items-center justify-center">
        <Users size={22} className="text-accent-yellow" />
      </div>
      <h1 className="text-text-primary font-bold text-2xl tracking-tight">Members</h1>
      <p className="text-text-secondary text-sm max-w-sm">Manage workspace members and permissions. Coming soon.</p>
    </div>
  )
}
