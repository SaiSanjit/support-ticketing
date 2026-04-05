import { Settings } from 'lucide-react'

export function SettingsGeneralPage() {
  return (
    <div className="p-6 max-w-2xl">
      <div className="flex items-center gap-2 mb-6">
        <Settings size={18} className="text-text-secondary" />
        <h1 className="text-text-primary font-semibold text-lg">General Settings</h1>
      </div>
      <div className="flex flex-col gap-4">
        {['Workspace name', 'Workspace URL', 'Language'].map((label) => (
          <div key={label} className="flex flex-col gap-1.5">
            <label className="text-[12px] text-text-secondary font-medium">{label}</label>
            <input
              type="text"
              className="px-3 py-2.5 rounded-lg border border-border bg-bg-elevated text-text-primary text-sm outline-none focus:border-accent-mint transition-colors"
              placeholder={label}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
