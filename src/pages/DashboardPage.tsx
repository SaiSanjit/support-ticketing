import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
   Clock,
   CheckCircle2,
   List,
   Grid,
   ArrowUpRight,
   Building2,
   SlidersHorizontal,
   Hourglass,
   Plus,
   Search
} from 'lucide-react'
import { useTicketStore } from '../store/ticket-store'

export function DashboardPage() {
   const navigate = useNavigate()
   const { clients, employees, seedDashboardData } = useTicketStore()

   useEffect(() => {
      if (clients.length === 0) {
         seedDashboardData()
      }
   }, [clients.length, seedDashboardData])

   const stats = {
      total: clients.reduce((acc, c) => acc + c.totalTickets, 0),
      pending: clients.reduce((acc, c) => acc + c.pendingTickets, 0),
      inProgress: clients.reduce((acc, c) => acc + c.inProgressTickets, 0),
   }

   // Derived value for closed count
   const closed = Math.max(0, stats.total - stats.pending - stats.inProgress);

   return (
      <div className="flex-1 overflow-y-auto w-full h-full sf-scroll pb-12">
         <div className="max-w-[1400px] mx-auto p-6 md:p-8 space-y-8 animate-fade-in relative z-10">

            {/* --- Top Header Area --- */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
               {/* Main Huge Brand: Department Name */}
               <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-[2rem] border border-border flex items-center justify-center sf-card shadow-sm">
                     <Building2 className="text-accent-mint" size={28} />
                  </div>
                  <div className="flex items-baseline gap-3">
                     <span className="text-6xl font-black tracking-tight text-text-primary uppercase">SCM</span>
                     <span className="text-3xl font-light text-text-tertiary uppercase tracking-widest ml-2">Operations</span>
                  </div>
               </div>

               {/* Sub Stats Area: Premium KPIs */}
               <div className="flex items-center gap-4 pt-4">
                  {/* Total Tickets */}
                  <div className="relative overflow-hidden flex flex-col justify-between p-5 min-w-[155px] rounded-[2rem] border border-border shadow-sm transition-all duration-300 hover:-translate-y-1 cursor-default" style={{ backgroundColor: 'var(--color-lavender-tint)' }}>
                     <div className="absolute right-0 bottom-0 pointer-events-none z-0">
                        <svg width="90" height="90" viewBox="0 0 24 24" fill="none" className="opacity-[0.18] transform translate-x-3 translate-y-3" stroke="var(--color-lavender)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                           <path d="M2 9a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v1.5a1.5 1.5 0 0 0 0 3V15a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-1.5a1.5 1.5 0 0 0 0-3V9z" />
                           <line x1="9" y1="7" x2="9" y2="17" strokeDasharray="2 2" />
                        </svg>
                     </div>
                     <p className="text-[10px] font-bold uppercase tracking-widest relative z-10" style={{ color: 'var(--color-lavender)' }}>Total Tickets</p>
                     <p className="text-4xl font-black leading-none mt-2 mb-3 relative z-10 tabular-nums text-[#1a1a2e] dark:text-white">{stats.total}</p>
                     <div className="h-[3px] w-10 rounded-full relative z-10" style={{ backgroundColor: 'var(--color-lavender)' }} />
                  </div>

                  {/* Pending Tickets */}
                  <div className="relative overflow-hidden flex flex-col justify-between p-5 min-w-[155px] rounded-[2rem] border border-border shadow-sm transition-all duration-300 hover:-translate-y-1 cursor-default" style={{ backgroundColor: 'var(--color-yellow-tint)' }}>
                     <div className="absolute right-0 bottom-0 pointer-events-none z-0">
                        <svg width="90" height="90" viewBox="0 0 24 24" fill="none" className="opacity-[0.18] transform translate-x-3 translate-y-3" stroke="var(--color-yellow)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                           <circle cx="12" cy="12" r="10" />
                           <polyline points="12 6 12 12 16 14" />
                        </svg>
                     </div>
                     <p className="text-[10px] font-bold uppercase tracking-widest relative z-10" style={{ color: 'var(--color-yellow)' }}>Pending</p>
                     <p className="text-4xl font-black leading-none mt-2 mb-3 relative z-10 tabular-nums text-[#1a1a2e] dark:text-white">{stats.pending}</p>
                     <div className="h-[3px] w-10 rounded-full relative z-10" style={{ backgroundColor: 'var(--color-yellow)' }} />
                  </div>

                  {/* In Progress */}
                  <div className="relative overflow-hidden flex flex-col justify-between p-5 min-w-[155px] rounded-[2rem] border border-border shadow-sm transition-all duration-300 hover:-translate-y-1 cursor-default" style={{ backgroundColor: 'var(--color-mint-tint)' }}>
                     <div className="absolute right-0 bottom-0 pointer-events-none z-0">
                        <svg width="90" height="90" viewBox="0 0 24 24" fill="none" className="opacity-[0.18] transform translate-x-3 translate-y-3" stroke="var(--color-mint)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                           <circle cx="12" cy="12" r="10" />
                           <path d="M9 12l2 2 4-4" />
                           <path d="M12 2 A10 10 0 0 1 22 12" strokeWidth="1.5" opacity="0.5" />
                        </svg>
                     </div>
                     <p className="text-[10px] font-bold uppercase tracking-widest relative z-10" style={{ color: 'var(--color-mint)' }}>In Progress</p>
                     <p className="text-4xl font-black leading-none mt-2 mb-3 relative z-10 tabular-nums text-[#1a1a2e] dark:text-white">{stats.inProgress}</p>
                     <div className="h-[3px] w-10 rounded-full relative z-10" style={{ backgroundColor: 'var(--color-mint)' }} />
                  </div>
               </div>
            </div>


            {/* --- Metrics Bar: 5 Status Pills --- */}
            <div className="w-full pt-4 pb-2">
               <div className="flex items-stretch gap-[6px] h-[64px] w-full">

                  {/* Open — Red/Orange */}
                  <div className="relative overflow-hidden flex-1 flex items-center px-5 py-1.5 rounded-[32px] transition-all" style={{ backgroundColor: '#fed7aa', color: '#7c2d12' }}>
                     <div className="w-[36px] h-[36px] rounded-full flex shrink-0 items-center justify-center border border-current opacity-40 mr-3">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                     </div>
                     <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-70 leading-none mb-0.5">Open</p>
                        <p className="text-[22px] font-black leading-none tabular-nums">{closed}</p>
                     </div>
                     <span className="absolute bottom-2.5 right-4 text-[10px] font-semibold uppercase tracking-wide opacity-50">tickets</span>
                  </div>

                  {/* In Progress — Blue */}
                  <div className="relative overflow-hidden flex-1 flex items-center px-5 py-1.5 rounded-[32px] transition-all" style={{ backgroundColor: '#bfdbfe', color: '#1e3a8a' }}>
                     <div className="w-[36px] h-[36px] rounded-full flex shrink-0 items-center justify-center border border-current opacity-40 mr-3">
                        <CheckCircle2 size={18} strokeWidth={2} />
                     </div>
                     <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-70 leading-none mb-0.5">In Progress</p>
                        <p className="text-[22px] font-black leading-none tabular-nums">{stats.inProgress}</p>
                     </div>
                     <span className="absolute bottom-2.5 right-4 text-[10px] font-semibold uppercase tracking-wide opacity-50">tickets</span>
                  </div>

                  {/* Pending — Yellow */}
                  <div className="relative overflow-hidden flex-1 flex items-center px-5 py-1.5 rounded-[32px] transition-all" style={{ backgroundColor: '#fef08a', color: '#713f12' }}>
                     <div className="w-[36px] h-[36px] rounded-full flex shrink-0 items-center justify-center border border-current opacity-40 mr-3">
                        <Clock size={18} strokeWidth={2} />
                     </div>
                     <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-70 leading-none mb-0.5">Pending</p>
                        <p className="text-[22px] font-black leading-none tabular-nums">{stats.pending}</p>
                     </div>
                     <span className="absolute bottom-2.5 right-4 text-[10px] font-semibold uppercase tracking-wide opacity-50">tickets</span>
                  </div>

                  {/* Resolved — Green */}
                  <div className="relative overflow-hidden flex-1 flex items-center px-5 py-1.5 rounded-[32px] transition-all" style={{ backgroundColor: '#bbf7d0', color: '#064e3b' }}>
                     <div className="w-[36px] h-[36px] rounded-full flex shrink-0 items-center justify-center border border-current opacity-40 mr-3">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                     </div>
                     <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-70 leading-none mb-0.5">Resolved</p>
                        <p className="text-[22px] font-black leading-none tabular-nums">{closed}</p>
                     </div>
                     <span className="absolute bottom-2.5 right-4 text-[10px] font-semibold uppercase tracking-wide opacity-50">today</span>
                  </div>

                  {/* Overdue — Red (blinking dot) */}
                  <div className="relative overflow-hidden flex-1 flex items-center px-5 py-1.5 rounded-[32px] transition-all" style={{ backgroundColor: '#fecaca', color: '#7f1d1d' }}>
                     <div className="relative w-[36px] h-[36px] rounded-full flex shrink-0 items-center justify-center border border-current opacity-40 mr-3">
                        <Hourglass size={16} strokeWidth={2} />
                        <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-red-500 animate-ping opacity-75" />
                        <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-red-500" />
                     </div>
                     <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-70 leading-none mb-0.5">Overdue</p>
                        <p className="text-[22px] font-black leading-none tabular-nums">{Math.max(0, stats.pending - 5)}</p>
                     </div>
                     <span className="absolute bottom-2.5 right-4 text-[10px] font-semibold uppercase tracking-wide opacity-50">tickets</span>
                  </div>

               </div>
            </div>


            {/* --- Main Content Grid --- */}
            <div className="flex gap-8 mt-10">
               {/* Left Content: Clients Section */}
               <div className="flex-1 space-y-6">
                  <div className="flex items-center justify-between mb-4">
                     <div className="flex items-center gap-4">
                        <h2 className="text-2xl font-bold text-text-primary">Clients</h2>
                        <div className="px-3 py-1 bg-bg-surface border border-border rounded-full shadow-sm">
                           <span className="text-xs font-semibold text-text-tertiary">{clients.length} Active Nodes</span>
                        </div>
                     </div>
                     <div className="flex items-center gap-2 sf-card p-1.5 rounded-2xl">
                        <button className="p-2.5 bg-bg-page border border-border rounded-xl text-text-primary shadow-sm"><Grid size={18} /></button>
                        <button className="p-2.5 hover:bg-bg-page rounded-xl text-text-tertiary transition-all"><List size={18} /></button>
                        <div className="w-px h-5 bg-border mx-1" />
                        <button className="p-2.5 hover:bg-bg-page rounded-xl text-text-tertiary transition-all"><SlidersHorizontal size={18} /></button>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                     {clients.map((client) => (
                        <div key={client.id} onClick={() => navigate(`/clients/${client.id}`)} className="group relative overflow-hidden sf-card flex flex-col justify-between p-7 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[var(--color-mint)]/30" style={{ minHeight: '240px' }}>

                           {/* Watermark initial */}
                           <div className="absolute -right-4 -bottom-4 pointer-events-none select-none z-0">
                              <span className="text-[120px] font-black leading-none text-text-primary opacity-[0.04] group-hover:opacity-[0.07] transition-opacity">
                                 {client.name.charAt(0)}
                              </span>
                           </div>

                           {/* Top row */}
                           <div className="relative z-10 flex items-start justify-between">
                              <div>
                                 <div className="flex items-center gap-2 mb-3">
                                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest" style={{ backgroundColor: 'var(--color-mint-tint)', color: 'var(--color-mint)' }}>
                                       {client.department}
                                    </span>
                                    <span className="flex items-center gap-1 text-[10px] text-text-tertiary font-semibold uppercase tracking-wide">
                                       <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: 'var(--color-mint)' }} />
                                       SLA 99.9%
                                    </span>
                                 </div>
                                 <h3 className="text-2xl font-black text-text-primary leading-tight tracking-tight">{client.name}</h3>
                              </div>
                              <button className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-text-tertiary group-hover:bg-[var(--color-mint)] group-hover:text-bg-page group-hover:border-[var(--color-mint)] transition-all shadow-sm shrink-0">
                                 <ArrowUpRight size={16} />
                              </button>
                           </div>

                           {/* Stats row */}
                           <div className="relative z-10 grid grid-cols-3 gap-4 mt-6 pt-5 border-t border-border">
                              <div>
                                 <p className="text-[9px] text-text-tertiary font-bold uppercase tracking-widest mb-1">Total</p>
                                 <p className="text-[28px] font-black text-text-primary leading-none tabular-nums">{client.totalTickets}</p>
                                 <div className="mt-2 h-1 w-full bg-border rounded-full overflow-hidden">
                                    <div className="h-full bg-text-tertiary/40 rounded-full" style={{ width: '100%' }} />
                                 </div>
                              </div>

                              <div>
                                 <p className="text-[9px] font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--color-yellow)' }}>Pending</p>
                                 <p className="text-[28px] font-black leading-none tabular-nums" style={{ color: 'var(--color-yellow)' }}>{client.pendingTickets}</p>
                                 <div className="mt-2 h-1 w-full rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-yellow-tint)' }}>
                                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(client.pendingTickets / client.totalTickets) * 100}%`, backgroundColor: 'var(--color-yellow)' }} />
                                 </div>
                              </div>

                              <div>
                                 <p className="text-[9px] font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--color-mint)' }}>Active</p>
                                 <p className="text-[28px] font-black leading-none tabular-nums" style={{ color: 'var(--color-mint)' }}>{client.inProgressTickets}</p>
                                 <div className="mt-2 h-1 w-full rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-mint-tint)' }}>
                                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(client.inProgressTickets / client.totalTickets) * 100}%`, backgroundColor: 'var(--color-mint)' }} />
                                 </div>
                              </div>
                           </div>

                        </div>
                     ))}
                  </div>
               </div>

               {/* Right Panel: Support Team Sidebar */}
               <div className="w-[400px] flex flex-col space-y-6">
                  <div className="flex items-center justify-between mb-4">
                     <h2 className="text-2xl font-bold text-text-primary">Support Team</h2>
                     <div className="flex items-center gap-2">
                        <button className="w-10 h-10 rounded-xl bg-bg-surface border border-border flex items-center justify-center text-text-primary shadow-sm hover:bg-bg-page transition-colors">
                           <Plus size={18} />
                        </button>
                        <button className="w-10 h-10 rounded-xl bg-bg-surface border border-border flex items-center justify-center text-text-primary shadow-sm hover:bg-bg-page transition-colors">
                           <Search size={18} />
                        </button>
                     </div>
                  </div>

                  <div className="sf-panel p-8 space-y-6 shadow-md border border-border bg-bg-surface relative overflow-hidden">


                     <div className="space-y-4">
                        {employees.map((employee) => (
                           <div key={employee.id} onClick={() => navigate(`/team/${employee.id}`)} className="group p-4 sf-card bg-bg-page/50 flex items-center gap-5 hover:border-accent-mint/50 hover:bg-bg-surface transition-all duration-300 cursor-pointer">
                              <div className="relative">
                                 <img src={employee.avatar} className="w-14 h-14 rounded-2xl border border-border bg-bg-surface group-hover:border-accent-mint/30 transition-colors" alt={employee.name} />
                                 <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-[3px] border-bg-surface ${employee.status === 'online' ? 'bg-accent-mint' : 'bg-text-tertiary'
                                    }`} />
                              </div>
                              <div className="flex-1">
                                 <h4 className="text-base font-bold text-text-primary group-hover:text-accent-mint transition-colors">{employee.name}</h4>
                                 <p className="text-[10px] text-text-tertiary font-bold flex items-center gap-1.5 mt-1 uppercase tracking-widest">
                                    <Clock size={10} className="text-text-tertiary" />
                                    {employee.activeTickets} TICKETS LOADED
                                 </p>
                              </div>
                              <button className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-text-tertiary group-hover:text-bg-page group-hover:bg-accent-mint group-hover:border-accent-mint transition-all shadow-sm">
                                 <ArrowUpRight size={16} />
                              </button>
                           </div>
                        ))}
                     </div>

                     <button className="w-full py-4 mt-2 rounded-[1.5rem] bg-text-primary text-bg-page text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity shadow-lg">
                        Access Intelligence Grid
                     </button>
                  </div>
               </div>
            </div>

         </div>
      </div>
   )
}
