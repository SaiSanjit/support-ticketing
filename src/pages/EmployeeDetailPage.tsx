import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Mail, Calendar, Building2, Clock } from 'lucide-react'
import { useTicketStore } from '@/store/ticket-store'

const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
  'open':        { label: 'Open',        bg: '#fed7aa', text: '#7c2d12' },
  'in-progress': { label: 'In Progress', bg: '#bfdbfe', text: '#1e3a8a' },
  'pending':     { label: 'Pending',     bg: '#fef08a', text: '#713f12' },
  'resolved':    { label: 'Resolved',    bg: '#bbf7d0', text: '#064e3b' },
  'closed':      { label: 'Resolved',    bg: '#bbf7d0', text: '#064e3b' },
}

const priorityConfig: Record<string, { dot: string; label: string }> = {
  'urgent': { dot: '#ef4444', label: 'Urgent' },
  'high':   { dot: '#f97316', label: 'High' },
  'medium': { dot: '#eab308', label: 'Medium' },
  'low':    { dot: '#22c55e', label: 'Low' },
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const h = Math.floor(diff / 3600000)
  if (h < 1) return `${Math.floor(diff / 60000)}m ago`
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

export function EmployeeDetailPage() {
  const { employeeId } = useParams<{ employeeId: string }>()
  const navigate = useNavigate()
  const { employees, tickets, clients, seedDashboardData } = useTicketStore()

  useEffect(() => {
    if (employees.length === 0) seedDashboardData()
  }, [employees.length, seedDashboardData])

  const employee = employees.find(e => e.id === employeeId)
  const empTickets = tickets.filter(t => t.employeeId === employeeId)

  if (!employee) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-text-tertiary text-lg">Team member not found.</p>
      </div>
    )
  }

  const openCount       = empTickets.filter(t => t.status === 'open').length
  const inProgressCount = empTickets.filter(t => t.status === 'in-progress').length
  const pendingCount    = empTickets.filter(t => t.status === 'open' && !empTickets.find(x => x.id === t.id && x.status === 'in-progress')).length

  const statusBadge = {
    online:  { bg: '#bbf7d0', text: '#064e3b', label: 'Online' },
    busy:    { bg: '#fef08a', text: '#713f12', label: 'Busy' },
    offline: { bg: 'var(--color-border)', text: 'var(--color-text-tertiary)', label: 'Offline' },
  }[employee.status]

  return (
    <div className="flex-1 overflow-y-auto w-full h-full sf-scroll pb-12">
      <div className="max-w-[1400px] mx-auto p-6 md:p-8 space-y-8 animate-fade-in">

        {/* Back */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-text-tertiary hover:text-text-primary transition-colors text-sm font-medium group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>

        {/* Profile Header */}
        <div className="sf-card p-8 flex flex-col md:flex-row items-start md:items-center gap-8 relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 pointer-events-none select-none">
            <span className="text-[140px] font-black leading-none text-text-primary opacity-[0.03]">{employee.name.charAt(0)}</span>
          </div>

          <div className="relative">
            <img
              src={employee.avatar}
              alt={employee.name}
              className="w-24 h-24 rounded-[28px] border-2 border-border shadow-lg"
            />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-bg-page"
              style={{ backgroundColor: employee.status === 'online' ? '#22c55e' : employee.status === 'busy' ? '#eab308' : '#94a3b8' }} />
          </div>

          <div className="flex-1 relative z-10">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="text-3xl font-black text-text-primary tracking-tight">{employee.name}</h1>
              <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: statusBadge.bg, color: statusBadge.text }}>
                ● {statusBadge.label}
              </span>
            </div>
            <p className="text-text-secondary font-medium mb-3">{employee.role}</p>
            <div className="flex flex-wrap items-center gap-6 text-sm text-text-tertiary">
              <span className="flex items-center gap-2"><Mail size={14} />{employee.email}</span>
              <span className="flex items-center gap-2"><Building2 size={14} />{employee.department}</span>
              <span className="flex items-center gap-2"><Calendar size={14} />Since {employee.joinedAt}</span>
            </div>
          </div>

          <div className="relative z-10 text-right">
            <p className="text-[10px] font-bold uppercase tracking-widest text-text-tertiary mb-1">Resolved Tickets</p>
            <p className="text-4xl font-black text-text-primary">{employee.resolvedTickets}</p>
            <p className="text-xs text-text-tertiary mt-1">All time</p>
          </div>
        </div>

        {/* KPI Mini Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Active Tickets', value: employee.activeTickets, bg: 'var(--color-lavender-tint)', accent: 'var(--color-lavender)' },
            { label: 'Open',           value: openCount,              bg: '#fed7aa',                    accent: '#ea580c' },
            { label: 'In Progress',    value: inProgressCount,        bg: '#bfdbfe',                    accent: '#2563eb' },
            { label: 'Pending',        value: pendingCount,           bg: '#fef08a',                    accent: '#ca8a04' },
          ].map(kpi => (
            <div key={kpi.label} className="relative overflow-hidden flex flex-col justify-between p-5 rounded-[2rem] border border-border shadow-sm" style={{ backgroundColor: kpi.bg }}>
              <div className="absolute right-0 bottom-0 pointer-events-none">
                <svg width="70" height="70" viewBox="0 0 24 24" fill="none" className="opacity-[0.15] transform translate-x-3 translate-y-3" stroke={kpi.accent} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><path d="M9 12l2 2 4-4" />
                </svg>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest relative z-10" style={{ color: kpi.accent }}>{kpi.label}</p>
              <p className="text-4xl font-black leading-none mt-2 mb-3 relative z-10 tabular-nums text-[#1a1a2e] dark:text-white">{kpi.value}</p>
              <div className="h-[3px] w-8 rounded-full relative z-10" style={{ backgroundColor: kpi.accent }} />
            </div>
          ))}
        </div>

        {/* Assigned Tickets */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-black text-text-primary">Assigned Tickets</h2>
            <span className="px-3 py-1 rounded-full text-xs font-bold border border-border text-text-tertiary">{empTickets.length} total</span>
          </div>

          {empTickets.length === 0 ? (
            <div className="sf-card p-12 text-center text-text-tertiary">No tickets currently assigned.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {empTickets.map(ticket => {
                const s = statusConfig[ticket.status] ?? statusConfig['open']
                const p = priorityConfig[ticket.priority] ?? priorityConfig['medium']
                const client = clients.find(c => c.id === ticket.clientId)

                return (
                  <div
                    key={ticket.id}
                    onClick={() => navigate(`/tickets/${ticket.id}`)}
                    className="group sf-card p-6 flex flex-col gap-4 cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-xl relative overflow-hidden"
                  >
                    <div className="absolute -right-3 -bottom-3 pointer-events-none select-none">
                      <Building2 size={72} className="text-text-primary opacity-[0.04] group-hover:opacity-[0.07] transition-opacity" strokeWidth={1} />
                    </div>

                    {/* Top row */}
                    <div className="flex items-start justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-text-tertiary px-2.5 py-1 bg-bg-page rounded-lg border border-border">
                        #{ticket.id}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.dot }} />
                        <span className="text-[10px] font-semibold text-text-tertiary uppercase tracking-wide">{p.label}</span>
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-text-primary leading-snug group-hover:text-accent-mint transition-colors pr-4 relative z-10">
                      {ticket.title}
                    </h3>

                    {/* Client chip */}
                    {client && (
                      <div className="flex items-center gap-2 relative z-10">
                        <div className="w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-black"
                          style={{ backgroundColor: 'var(--color-mint-tint)', color: 'var(--color-mint)' }}>
                          {client.name.charAt(0)}
                        </div>
                        <span className="text-[11px] text-text-tertiary font-medium">{client.name}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-border relative z-10">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold" style={{ backgroundColor: s.bg, color: s.text }}>
                        {s.label}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-text-tertiary">
                        <Clock size={11} />{timeAgo(ticket.createdAt)}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
