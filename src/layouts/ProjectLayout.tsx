import { Outlet, NavLink, useParams } from 'react-router-dom'
import { SEED_PROJECTS } from '@/mock/seed'
import { LayoutGrid, List, GitBranch } from 'lucide-react'

const VIEWS = [
  { label: 'Board', icon: LayoutGrid, path: 'board' },
  { label: 'Table', icon: List, path: 'table' },
  { label: 'Timeline', icon: GitBranch, path: 'timeline' },
]

export function ProjectLayout() {
  const { projectId } = useParams<{ projectId: string }>()
  const project = SEED_PROJECTS.find((p) => p.id === projectId)

  return (
    <div className="flex flex-col flex-1 min-h-0 text-white animate-fade-in relative z-10 w-full h-full">
      {/* ── Project header ──────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-6 pt-6 pb-4">
        <div className="flex items-center gap-4">
          {project?.emoji && (
            <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center bg-white/[0.02] text-2xl">
              {project.emoji}
            </div>
          )}
          <div className="flex flex-col">
            <h1 className="text-3xl font-light tracking-tight text-white/95">
              {project?.name ?? 'Project'}
            </h1>
            <div className="flex items-center gap-2 mt-1">
               <div className="w-2 h-2 rounded-full shadow-[0_0_10px_rgba(136,255,157,0.5)] bg-[#88FF9D]"></div>
               <span className="text-xs text-white/40 font-medium">Active</span>
            </div>
          </div>
        </div>

        {/* View tabs as pill toggles */}
        <div className="flex items-center rounded-full p-1 border border-white/5 bg-white/[0.02]">
          {VIEWS.map(({ label, icon: Icon, path }) => (
            <NavLink
              key={path}
              to={`/projects/${projectId}/${path}`}
              className={({ isActive }) =>
                `flex items-center gap-2 px-5 py-2 rounded-full text-[13px] font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-white/[0.08] text-white shadow-sm'
                    : 'text-white/40 hover:text-white/80'
                }`
              }
            >
              <Icon size={14} />
              {label}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Page content */}
      <div className="flex-1 min-h-0 overflow-hidden pt-2 px-2">
        <Outlet />
      </div>
    </div>
  )
}
