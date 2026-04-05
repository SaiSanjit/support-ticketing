import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Clock, User, Building2, AlertTriangle, CheckCircle2, Calendar, Tag, MessageSquare, Activity } from 'lucide-react'
import { useTicketStore } from '@/store/ticket-store'

const statusConfig: Record<string, { label: string; bg: string; text: string; icon: React.ReactNode }> = {
  'open':        { label: 'Open',        bg: '#fed7aa', text: '#7c2d12', icon: <AlertTriangle size={14} /> },
  'in-progress': { label: 'In Progress', bg: '#bfdbfe', text: '#1e3a8a', icon: <Activity size={14} /> },
  'pending':     { label: 'Pending',     bg: '#fef08a', text: '#713f12', icon: <Clock size={14} /> },
  'resolved':    { label: 'Resolved',    bg: '#bbf7d0', text: '#064e3b', icon: <CheckCircle2 size={14} /> },
  'closed':      { label: 'Resolved',    bg: '#bbf7d0', text: '#064e3b', icon: <CheckCircle2 size={14} /> },
}

const priorityConfig: Record<string, { dot: string; label: string; bg: string }> = {
  'urgent': { dot: '#ef4444', label: 'Urgent', bg: '#fee2e2' },
  'high':   { dot: '#f97316', label: 'High',   bg: '#ffedd5' },
  'medium': { dot: '#eab308', label: 'Medium', bg: '#fefce8' },
  'low':    { dot: '#22c55e', label: 'Low',    bg: '#f0fdf4' },
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const h = Math.floor(diff / 3600000)
  if (h < 1) return `${Math.floor(diff / 60000)}m ago`
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

const MOCK_ACTIVITY = [
  { id: 1, type: 'status', text: 'Status changed to In Progress', time: '2h ago', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
  { id: 2, type: 'comment', text: 'Investigated root cause — traced back to the March 28 deployment. Rolling back now.', time: '3h ago', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael' },
  { id: 3, type: 'assigned', text: 'Ticket assigned to Sarah Wilson', time: '5h ago', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' },
  { id: 4, type: 'created', text: 'Ticket created by client portal', time: '6h ago', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma' },
]

export function TicketDetailPage() {
  const { ticketId } = useParams<{ ticketId: string }>()
  const navigate = useNavigate()
  const { tickets, clients, employees, seedDashboardData } = useTicketStore()

  useEffect(() => {
    if (tickets.length === 0) seedDashboardData()
  }, [tickets.length, seedDashboardData])

  const ticket = tickets.find(t => t.id === ticketId)
  const client = clients.find(c => c.id === ticket?.clientId)
  const employee = employees.find(e => e.id === ticket?.employeeId)

  if (!ticket) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-text-tertiary text-lg">Ticket not found.</p>
      </div>
    )
  }

  const s = statusConfig[ticket.status] ?? statusConfig['open']
  const p = priorityConfig[ticket.priority] ?? priorityConfig['medium']

  return (
    <div className="flex-1 overflow-y-auto w-full h-full sf-scroll pb-12">
      <div className="max-w-[1400px] mx-auto p-6 md:p-8 space-y-8 animate-fade-in">

        {/* Back Button */}
        <button
          onClick={() => navigate(client ? `/clients/${client.id}` : '/dashboard')}
          className="flex items-center gap-2 text-text-tertiary hover:text-text-primary transition-colors text-sm font-medium group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          {client ? `Back to ${client.name}` : 'Back to Dashboard'}
        </button>

        <div className="flex flex-col xl:flex-row gap-6">

          {/* LEFT: Main Ticket Info */}
          <div className="flex-1 space-y-6">

            {/* Ticket Header Card */}
            <div className="sf-card p-8 relative overflow-hidden">
              <div className="absolute -right-6 -bottom-6 pointer-events-none select-none">
                <span className="text-[120px] font-black leading-none text-text-primary opacity-[0.03]">#</span>
              </div>

              <div className="flex flex-wrap items-center gap-3 mb-5 relative z-10">
                <span className="px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest border border-border text-text-tertiary bg-bg-page">
                  #{ticket.id}
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold" style={{ backgroundColor: s.bg, color: s.text }}>
                  {s.icon} {s.label}
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold" style={{ backgroundColor: p.bg, color: p.dot }}>
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.dot }} />
                  {p.label} Priority
                </span>
              </div>

              <h1 className="text-2xl md:text-3xl font-black text-text-primary leading-tight mb-4 relative z-10">
                {ticket.title}
              </h1>

              <p className="text-text-secondary leading-relaxed text-base relative z-10">
                {ticket.description}
              </p>
            </div>

            {/* Meta Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { icon: <Building2 size={16} />, label: 'Client', value: ticket.clientName },
                { icon: <Tag size={16} />, label: 'Department', value: ticket.department },
                { icon: <User size={16} />, label: 'Assigned To', value: ticket.employeeName },
                { icon: <Calendar size={16} />, label: 'Created', value: formatDate(ticket.createdAt) },
                { icon: <Clock size={16} />, label: 'Last Updated', value: timeAgo(ticket.updatedAt) },
                { icon: <Activity size={16} />, label: 'Time Open', value: timeAgo(ticket.createdAt).replace(' ago', '') },
              ].map(item => (
                <div key={item.label} className="sf-card p-5 flex items-start gap-4">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border border-border text-text-tertiary" style={{ backgroundColor: 'var(--color-mint-tint)', color: 'var(--color-mint)' }}>
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-text-tertiary mb-0.5">{item.label}</p>
                    <p className="text-sm font-bold text-text-primary">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Assignee Card */}
            {employee && (
              <div
                className="sf-card p-6 flex items-center gap-5 cursor-pointer hover:-translate-y-1 hover:shadow-xl transition-all duration-200 group"
                onClick={() => navigate(`/team/${employee.id}`)}
              >
                <img src={employee.avatar} alt={employee.name} className="w-16 h-16 rounded-2xl border-2 border-border shadow-sm" />
                <div className="flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-text-tertiary mb-1">Assigned To</p>
                  <h3 className="text-lg font-black text-text-primary group-hover:text-accent-mint transition-colors">{employee.name}</h3>
                  <p className="text-sm text-text-tertiary">{employee.role}</p>
                </div>
                <div className={`px-3 py-1.5 rounded-full text-xs font-bold ${employee.status === 'online' ? 'bg-[#bbf7d0] text-[#064e3b]' : employee.status === 'busy' ? 'bg-[#fef08a] text-[#713f12]' : 'bg-bg-page text-text-tertiary border border-border'}`}>
                  ● {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Activity Feed */}
          <div className="w-full xl:w-[360px] space-y-4">
            <div className="sf-card p-6">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border">
                <MessageSquare size={16} className="text-text-tertiary" />
                <h3 className="text-base font-bold text-text-primary">Activity</h3>
                <span className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold border border-border text-text-tertiary">{MOCK_ACTIVITY.length}</span>
              </div>

              <div className="space-y-5">
                {MOCK_ACTIVITY.map(item => (
                  <div key={item.id} className="flex items-start gap-4">
                    <img src={item.avatar} alt="" className="w-8 h-8 rounded-full border border-border shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm text-text-secondary leading-snug">{item.text}</p>
                      <p className="text-[11px] text-text-tertiary mt-1">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Client quick link */}
            {client && (
              <div
                className="sf-card p-5 flex items-center gap-4 cursor-pointer hover:-translate-y-1 hover:shadow-xl transition-all duration-200 group"
                onClick={() => navigate(`/clients/${client.id}`)}
              >
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black border border-border"
                  style={{ backgroundColor: 'var(--color-lavender-tint)', color: 'var(--color-lavender)' }}>
                  {client.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-text-tertiary mb-0.5">Client</p>
                  <h4 className="text-sm font-bold text-text-primary group-hover:text-accent-mint transition-colors">{client.name}</h4>
                  <p className="text-[11px] text-text-tertiary">{client.department} • {client.totalTickets} tickets</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
