import { useEffect, useMemo } from 'react'
import { useTicketStore } from '@/store/ticket-store'
import { 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  User, 
  Building2, 
  LayoutGrid, 
  Bell,
  ArrowUpRight,
  Filter
} from 'lucide-react'

const PRIORITY_COLORS = {
  urgent: 'bg-[#FF5C5C] text-white',
  high: 'bg-[#FFA27D] text-white',
  medium: 'bg-[#FFF87C] text-[#1D1C08]',
  low: 'bg-[#AAC7D5] text-[#28353E]',
}

const STATUS_ICONS = {
  open: AlertCircle,
  'in-progress': Clock,
  resolved: CheckCircle2,
  closed: CheckCircle2,
}

export function SupportDashboardPage() {
  const { tickets, notifications, seedTickets, markNotificationAsRead } = useTicketStore()

  useEffect(() => {
    if (tickets.length === 0) {
      seedTickets()
    }
  }, [tickets.length, seedTickets])

  const stats = useMemo(() => {
    return {
      total: tickets.length,
      open: tickets.filter(t => t.status === 'open').length,
      inProgress: tickets.filter(t => t.status === 'in-progress').length,
      urgent: tickets.filter(t => t.priority === 'urgent').length,
    }
  }, [tickets])

  return (
    <div className="fixed inset-0 bg-[var(--frost-dark)] text-[var(--frost-white)] overflow-hidden flex flex-col font-sans select-none">
      
      {/* --- Top Header (Very Large for TV) --- */}
      <header className="h-[120px] px-12 flex items-center justify-between border-b border-[var(--frost-muted)]/30 bg-[var(--frost-dark)]/80 backdrop-blur-xl z-20">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-[var(--frost-light)] rounded-2xl flex items-center justify-center shadow-lg shadow-[var(--frost-light)]/20">
            <LayoutGrid className="text-[var(--frost-dark)]" size={36} />
          </div>
          <div>
            <h1 className="text-5xl font-bold tracking-tight">Support Operations</h1>
            <p className="text-[var(--frost-light)] text-xl font-medium opacity-80 uppercase tracking-[0.2em] mt-1">Live Ticket Monitor • {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <div className="flex items-center gap-12">
          <div className="flex flex-col items-end">
            <span className="text-[var(--frost-light)] text-sm font-bold uppercase tracking-widest mb-1">Total Active</span>
            <span className="text-6xl font-light tabular-nums">{stats.total}</span>
          </div>
          <div className="h-16 w-px bg-[var(--frost-muted)]/30" />
          <div className="flex flex-col items-end">
            <span className="text-[#FF5C5C] text-sm font-bold uppercase tracking-widest mb-1">Urgent Alert</span>
            <span className="text-6xl font-light text-[#FF5C5C] tabular-nums">{stats.urgent}</span>
          </div>
        </div>
      </header>

      {/* --- Main Dashboard Area --- */}
      <main className="flex-1 p-12 overflow-hidden grid grid-cols-12 gap-8">
        
        {/* --- Left Column: Summary Stats & Notifications --- */}
        <div className="col-span-3 flex flex-col gap-8">
          
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 gap-6">
            <div className="bg-[var(--frost-muted)]/20 border border-[var(--frost-muted)]/30 p-8 rounded-[2.5rem] flex items-center justify-between">
              <div>
                <p className="text-[var(--frost-light)] text-lg font-medium">In Queue</p>
                <h3 className="text-5xl font-bold mt-1 tabular-nums">{stats.open}</h3>
              </div>
              <div className="w-16 h-16 rounded-full bg-[var(--frost-muted)]/40 flex items-center justify-center">
                <Filter className="text-[var(--frost-light)]" size={28} />
              </div>
            </div>
            
            <div className="bg-[var(--frost-muted)]/20 border border-[var(--frost-muted)]/30 p-8 rounded-[2.5rem] flex items-center justify-between">
              <div>
                <p className="text-[var(--frost-light)] text-lg font-medium">In Progress</p>
                <h3 className="text-5xl font-bold mt-1 tabular-nums">{stats.inProgress}</h3>
              </div>
              <div className="w-16 h-16 rounded-full bg-[var(--frost-muted)]/40 flex items-center justify-center">
                <Clock className="text-[var(--frost-light)]" size={28} />
              </div>
            </div>
          </div>

          {/* Notifications Ticker Area */}
          <div className="flex-1 bg-[var(--frost-dark)]/40 border border-[var(--frost-muted)]/30 rounded-[3rem] p-8 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold flex items-center gap-3">
                <Bell className="text-[var(--frost-light)]" size={32} />
                Alerts
              </h2>
              {notifications.length > 0 && (
                <span className="bg-[#FF5C5C] text-white px-4 py-1 rounded-full text-lg font-bold">
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {notifications.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-30">
                  <Bell size={64} className="mb-4" />
                  <p className="text-xl">No active alerts</p>
                </div>
              ) : (
                notifications.map(n => (
                  <div key={n.id} className={`p-6 rounded-2xl border transition-all ${n.read ? 'bg-transparent border-[var(--frost-muted)]/20 opacity-60' : 'bg-[var(--frost-muted)]/30 border-[var(--frost-light)]/30 shadow-lg shadow-black/20'}`}>
                    <p className="text-lg font-medium">{n.message}</p>
                    <span className="text-sm opacity-60 mt-2 block">{new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* --- Right Column: Main Ticket Feed (Large Cards) --- */}
        <div className="col-span-9 overflow-y-auto pr-4 space-y-8 pb-12 custom-scrollbar">
          {tickets.map((ticket) => {
            const StatusIcon = STATUS_ICONS[ticket.status]
            return (
              <div key={ticket.id} className="relative group overflow-hidden">
                {/* Glow Effect for high priority */}
                {ticket.priority === 'urgent' && (
                  <div className="absolute inset-0 bg-[#FF5C5C]/5 blur-3xl animate-pulse" />
                )}
                
                <div className={`relative bg-[var(--frost-muted)]/10 border-2 transition-all p-10 rounded-[3.5rem] flex flex-col gap-8 ${ticket.priority === 'urgent' ? 'border-[#FF5C5C]/40 shadow-2xl shadow-[#FF5C5C]/10' : 'border-[var(--frost-muted)]/30'}`}>
                  
                  {/* Card Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-6">
                      <div className={`p-4 rounded-2xl ${PRIORITY_COLORS[ticket.priority]}`}>
                        <StatusIcon size={32} />
                      </div>
                      <div>
                        <div className="flex items-center gap-4 mb-2">
                          <span className={`px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider ${PRIORITY_COLORS[ticket.priority]}`}>
                            {ticket.priority}
                          </span>
                          <span className="text-[var(--frost-light)] text-xl font-medium">#{ticket.id}</span>
                        </div>
                        <h2 className="text-4xl font-bold leading-tight">{ticket.title}</h2>
                      </div>
                    </div>
                    
                    <div className="text-right">
                       <span className="text-[var(--frost-light)] text-sm font-bold uppercase tracking-[0.2em] block mb-2">Wait Time</span>
                       <span className="text-4xl font-light tabular-nums">14:20</span>
                    </div>
                  </div>

                  {/* Card Details Grid */}
                  <div className="grid grid-cols-4 gap-8">
                    <div className="flex items-center gap-4 p-6 bg-white/5 rounded-3xl">
                      <Building2 className="text-[var(--frost-light)]" size={32} />
                      <div>
                        <p className="text-sm opacity-50 uppercase tracking-widest leading-none mb-1">Client</p>
                        <p className="text-2xl font-bold leading-none">{ticket.clientName}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-6 bg-white/5 rounded-3xl">
                      <User className="text-[var(--frost-light)]" size={32} />
                      <div>
                        <p className="text-sm opacity-50 uppercase tracking-widest leading-none mb-1">Assignee</p>
                        <p className="text-2xl font-bold leading-none">{ticket.employeeName}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-6 bg-white/5 rounded-3xl">
                      <LayoutGrid className="text-[var(--frost-light)]" size={32} />
                      <div>
                        <p className="text-sm opacity-50 uppercase tracking-widest leading-none mb-1">Department</p>
                        <p className="text-2xl font-bold leading-none">{ticket.department}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-6 bg-white/5 rounded-3xl">
                      <Clock className="text-[var(--frost-light)]" size={32} />
                      <div>
                        <p className="text-sm opacity-50 uppercase tracking-widest leading-none mb-1">Received</p>
                        <p className="text-2xl font-bold leading-none">{new Date(ticket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    </div>
                  </div>

                  {/* Summary Snippet */}
                  <div className="p-8 bg-[var(--frost-dark)]/30 rounded-[2.5rem] border border-[var(--frost-muted)]/20">
                    <p className="text-2xl text-[var(--frost-light)] italic leading-relaxed">"{ticket.description}"</p>
                  </div>

                  {/* Progress Line */}
                  <div className="flex items-center gap-8">
                    <div className="flex-1 h-3 bg-[var(--frost-muted)]/20 rounded-full overflow-hidden">
                      <div className="h-full bg-[var(--frost-light)] w-[40%] rounded-full shadow-[0_0_15px_var(--frost-light)]" />
                    </div>
                    <div className="flex items-center gap-3 text-[var(--frost-light)]">
                       <span className="text-xl font-bold">40%</span>
                       <ArrowUpRight size={24} />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </main>

      {/* --- Footer Status Bar --- */}
      <footer className="h-16 px-12 flex items-center justify-between bg-[var(--frost-muted)]/10 border-t border-[var(--frost-muted)]/20">
         <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
               <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
               <span className="text-sm font-bold uppercase tracking-widest opacity-80">System Status: Optimal</span>
            </div>
            <div className="flex items-center gap-2 text-[var(--frost-light)]">
               <span className="text-sm font-bold uppercase tracking-widest opacity-80">Gateway: Primary-US-01</span>
            </div>
         </div>
         <div className="text-sm font-bold uppercase tracking-widest opacity-40 italic">
            Flow Support Dashboard v2.4.0
         </div>
      </footer>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(170, 199, 213, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(170, 199, 213, 0.3);
        }
      `}</style>
    </div>
  )
}
