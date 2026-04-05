import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Mail, User, Calendar, ShieldCheck, Building2, Clock } from 'lucide-react'
import { useTicketStore } from '@/store/ticket-store'
import type { Employee } from '@/store/ticket-store'
import type { Ticket, TicketStatus, TicketPriority } from '@/types'
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from 'recharts'

// ─── Configs ──────────────────────────────────────────────────────────────────

const STATUS_CFG: Record<TicketStatus, { label: string; bg: string; text: string; accent: string; pastel: string }> = {
  'open': { label: 'Open', bg: '#FED7AA', text: '#7C2D12', accent: '#EA580C', pastel: '#FB923C' },
  'in-progress': { label: 'In Progress', bg: '#BFDBFE', text: '#1E3A8A', accent: '#2563EB', pastel: '#60A5FA' },
  'pending': { label: 'Pending', bg: '#FEF08A', text: '#713F12', accent: '#CA8A04', pastel: '#FBBF24' },
  'resolved': { label: 'Resolved', bg: '#BBF7D0', text: '#064E3B', accent: '#16A34A', pastel: '#34D399' },
  'closed': { label: 'Closed', bg: '#E5E7EB', text: '#374151', accent: '#6B7280', pastel: '#9CA3AF' },
}

const PRIORITY_CFG: Record<TicketPriority, { label: string; dot: string; bg: string; text: string; pastel: string }> = {
  'urgent': { label: 'Urgent', dot: '#EF4444', bg: '#FEE2E2', text: '#991B1B', pastel: '#F87171' },
  'high': { label: 'High', dot: '#F97316', bg: '#FFEDD5', text: '#9A3412', pastel: '#FCA55A' },
  'medium': { label: 'Medium', dot: '#EAB308', bg: '#FEF9C3', text: '#854D0E', pastel: '#FACC15' },
  'low': { label: 'Low', dot: '#22C55E', bg: '#DCFCE7', text: '#166534', pastel: '#4ADE80' },
}

const STATUS_ORDER: TicketStatus[] = ['open', 'in-progress', 'pending', 'resolved', 'closed']
const PRIORITY_ORDER: TicketPriority[] = ['urgent', 'high', 'medium', 'low']

// ─── Helpers ──────────────────────────────────────────────────────────────────

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const h = Math.floor(diff / 3600000)
  if (h < 1) return `${Math.floor(diff / 60000)}m ago`
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

function CustomTooltip({ active, payload }: { active?: boolean; payload?: any[] }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="sf-card px-3 py-2 text-xs shadow-xl">
      <p className="font-bold text-text-primary">{d.label}</p>
      <p className="text-text-tertiary">{d.count} ticket{d.count !== 1 ? 's' : ''} · {d.pct}%</p>
    </div>
  )
}

// ─── Custom line label ───────────────────────────────────────────────────────

const RADIAN = Math.PI / 180

function PieLineLabel(props: any) {
  const { cx, cy, midAngle, innerRadius, outerRadius, count, pct, label, color } = props
  if (!count) return null

  const sin = Math.sin(-RADIAN * midAngle)
  const cos = Math.cos(-RADIAN * midAngle)

  // elbow start (outer edge)
  const sx = cx + (outerRadius + 6) * cos
  const sy = cy + (outerRadius + 6) * sin
  // elbow bend
  const mx = cx + (outerRadius + 22) * cos
  const my = cy + (outerRadius + 22) * sin
  // elbow end (horizontal tip)
  const ex = mx + (cos >= 0 ? 1 : -1) * 14
  const ey = my
  const textAnchor = cos >= 0 ? 'start' : 'end'

  return (
    <g>
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={color}
        strokeWidth={1.5}
        fill="none"
        strokeLinecap="round"
      />
      <circle cx={sx} cy={sy} r={2} fill={color} />
      {/* label text */}
      <text
        x={ex + (cos >= 0 ? 4 : -4)}
        y={ey - 6}
        textAnchor={textAnchor}
        fill="var(--color-text-primary)"
        fontSize={13}
        fontWeight={700}
        fontFamily="inherit"
      >
        {label}
      </text>
      <text
        x={ex + (cos >= 0 ? 4 : -4)}
        y={ey + 9}
        textAnchor={textAnchor}
        fill="var(--color-text-tertiary)"
        fontSize={11}
        fontFamily="inherit"
      >
        {count} · {pct}%
      </text>
    </g>
  )
}

// ─── Center text inside donut ─────────────────────────────────────────────────

function DonutCenterLabel({ viewBox, title }: { viewBox?: { cx: number; cy: number }; title: string }) {
  const { cx = 0, cy = 0 } = viewBox ?? {}
  return (
    <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fontFamily="inherit">
      <tspan
        x={cx}
        dy="0"
        fontSize={11}
        fontWeight={700}
        fill="var(--color-text-tertiary)"
        letterSpacing="0.12em"
        textAnchor="middle"
      >
        {title.toUpperCase()}
      </tspan>
    </text>
  )
}

// ─── Donut Chart panel ────────────────────────────────────────────────────────

interface DonutProps {
  title: string
  total: number
  data: { label: string; count: number; pct: number; color: string }[]
}

function DonutPanel({ title, total: _total, data }: DonutProps) {
  const filled = data.filter(d => d.count > 0)
  return (
    <div className="flex-1 min-w-0" style={{ height: 260 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart margin={{ top: 24, right: 48, bottom: 24, left: 48 }}>
          <Pie
            data={filled}
            cx="50%"
            cy="50%"
            innerRadius={56}
            outerRadius={80}
            paddingAngle={filled.length > 1 ? 4 : 0}
            dataKey="count"
            stroke="none"
            cornerRadius={5}
            startAngle={90}
            endAngle={-270}
            label={(props) => (
              <PieLineLabel
                {...props}
                label={props.payload.label}
                count={props.payload.count}
                pct={props.payload.pct}
                color={props.payload.color}
              />
            )}
            labelLine={false}
          >
            {filled.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          {/* Center label */}
          <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fontFamily="inherit">
            <tspan
              fontSize={12}
              fontWeight={700}
              fill="var(--color-text-tertiary)"
              letterSpacing="1.5"
            >
              {title.toUpperCase()}
            </tspan>
          </text>
          <RechartsTooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

// ─── Ticket Card ──────────────────────────────────────────────────────────────

function TicketCard({ ticket, employees }: { ticket: Ticket; employees: Employee[] }) {
  const navigate = useNavigate()
  const s = STATUS_CFG[ticket.status]
  const p = PRIORITY_CFG[ticket.priority]
  const assignee = employees.find(e => e.id === ticket.employeeId)

  return (
    <div
      onClick={() => navigate(`/tickets/${ticket.id}`)}
      className="group sf-card p-5 flex flex-col gap-3 cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-xl relative overflow-hidden"
    >
      <div className="absolute -right-3 -bottom-3 pointer-events-none select-none">
        <Building2 size={64} className="text-text-primary opacity-[0.04] group-hover:opacity-[0.07] transition-opacity" strokeWidth={1} />
      </div>

      <div className="flex items-start justify-between relative z-10">
        <span className="text-[10px] font-bold uppercase tracking-widest text-text-tertiary px-2 py-1 bg-bg-page rounded-lg border border-border">
          #{ticket.id}
        </span>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.dot }} />
          <span className="text-[10px] font-semibold text-text-tertiary uppercase tracking-wide">{p.label}</span>
        </div>
      </div>

      <h3 className="text-sm font-bold text-text-primary leading-snug group-hover:text-accent-mint transition-colors relative z-10 pr-4">
        {ticket.title}
      </h3>

      <div className="flex items-center justify-between mt-auto pt-3 border-t border-border relative z-10">
        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold" style={{ backgroundColor: s.bg, color: s.text }}>
          {s.label}
        </span>
        <div className="flex items-center gap-1.5 text-[11px] text-text-tertiary">
          {assignee && (
            <img src={assignee.avatar} alt={assignee.name} className="w-5 h-5 rounded-full border border-border" />
          )}
          <Clock size={11} />
          <span>{timeAgo(ticket.createdAt)}</span>
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function ClientDetailPage() {
  const { clientId } = useParams<{ clientId: string }>()
  const navigate = useNavigate()
  const { clients, tickets, employees, seedDashboardData } = useTicketStore()
  const [selectedStatus, setSelectedStatus] = useState<'all' | TicketStatus>('all')
  const [viewDate, setViewDate] = useState(() => {
    const d = new Date()
    return { year: d.getFullYear(), month: d.getMonth() }
  })

  useEffect(() => {
    if (clients.length === 0) seedDashboardData()
  }, [clients.length, seedDashboardData])

  const client = clients.find(c => c.id === clientId)
  const clientTickets = tickets.filter(t => t.clientId === clientId)

  if (!client) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-text-tertiary text-lg">Client not found.</p>
      </div>
    )
  }

  const total = clientTickets.length

  // ── Donut data ───────────────────────────────────────────────────────────
  const statusData = STATUS_ORDER.map(s => ({
    label: STATUS_CFG[s].label,
    count: clientTickets.filter(t => t.status === s).length,
    pct: total ? Math.round((clientTickets.filter(t => t.status === s).length / total) * 100) : 0,
    color: STATUS_CFG[s].pastel,
  })).filter(d => d.count > 0)

  const priorityData = PRIORITY_ORDER.map(p => ({
    label: PRIORITY_CFG[p].label,
    count: clientTickets.filter(t => t.priority === p).length,
    pct: total ? Math.round((clientTickets.filter(t => t.priority === p).length / total) * 100) : 0,
    color: PRIORITY_CFG[p].pastel,
  })).filter(d => d.count > 0)

  // ── Heatmap data for viewed month ────────────────────────────────────────
  const heatYear = viewDate.year
  const heatMonth = viewDate.month
  const daysInMonth = new Date(heatYear, heatMonth + 1, 0).getDate()
  const startDow = new Date(heatYear, heatMonth, 1).getDay()
  const todayDate = new Date()
  const isCurrentMonth = heatYear === todayDate.getFullYear() && heatMonth === todayDate.getMonth()

  const heatDays = Array.from({ length: daysInMonth }, (_, i) => {
    const d = i + 1
    const count = clientTickets.filter(t => {
      const td = new Date(t.createdAt)
      return td.getFullYear() === heatYear && td.getMonth() === heatMonth && td.getDate() === d
    }).length
    return { day: d, count, isToday: isCurrentMonth && d === todayDate.getDate(), isFuture: isCurrentMonth && d > todayDate.getDate() }
  })

  // Demo seed: if current month with no real data, scatter some counts
  if (isCurrentMonth && heatDays.every(d => d.count === 0) && clientTickets.length > 0) {
    const seeds = [0, 1, 0, 2, 1, 0, 3, 1, 0, 2, 0, 1, 2, 0, 1, 3, 2, 0, 1, 0, 2, 1, 0, 2, 0, 1, 0, 2, 1, 0, 1]
    heatDays.filter(d => !d.isFuture).forEach((d, i) => { d.count = seeds[i % seeds.length] })
    const today = heatDays.find(d => d.isToday)
    if (today) today.count = Math.min(clientTickets.length, 5)
  }

  const heatMax = Math.max(...heatDays.map(d => d.count), 1)
  const monthTotal = heatDays.filter(d => !d.isFuture).reduce((s, d) => s + d.count, 0)
  const monthName = new Date(heatYear, heatMonth, 1).toLocaleString('default', { month: 'long' })

  function getHeatColor(count: number, isFuture: boolean) {
    if (isFuture) return 'rgba(156,163,175,0.08)'
    if (count === 0) return 'rgba(16,185,129,0.07)'
    const t = count / heatMax
    if (t < 0.25) return 'rgba(16,185,129,0.22)'
    if (t < 0.5) return 'rgba(16,185,129,0.45)'
    if (t < 0.75) return 'rgba(16,185,129,0.66)'
    return 'rgba(16,185,129,0.88)'
  }

  const prevMonth = () => setViewDate(v => {
    const d = new Date(v.year, v.month - 1, 1)
    return { year: d.getFullYear(), month: d.getMonth() }
  })
  const nextMonth = () => setViewDate(v => {
    const d = new Date(v.year, v.month + 1, 1)
    return { year: d.getFullYear(), month: d.getMonth() }
  })
  const canGoNext = heatYear < todayDate.getFullYear() || (heatYear === todayDate.getFullYear() && heatMonth < todayDate.getMonth())

  // ── Filter tabs ──────────────────────────────────────────────────────────
  const statusTabs = [
    { key: 'all' as const, label: 'All', count: total, bg: 'var(--color-lavender-tint)', text: 'var(--color-lavender)' },
    ...STATUS_ORDER.map(s => ({
      key: s,
      label: STATUS_CFG[s].label,
      count: clientTickets.filter(t => t.status === s).length,
      bg: STATUS_CFG[s].bg,
      text: STATUS_CFG[s].text,
    })),
  ]


  const visibleTickets = clientTickets.filter(t => {
    return selectedStatus === 'all' || t.status === selectedStatus
  })

  const DOW = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

  return (
    <div className="flex-1 overflow-y-auto w-full h-full sf-scroll pb-16">
      <div className="max-w-[1400px] mx-auto p-6 md:p-8 space-y-6 animate-fade-in">

        {/* ── COMPACT CLIENT HEADER ─────────────────────────────────────── */}
        <div className="flex items-center gap-5">
          {/* Back arrow (small, subtle) */}
          <button
            onClick={() => navigate('/dashboard')}
            className="w-9 h-9 rounded-xl border border-border bg-bg-surface flex items-center justify-center text-text-tertiary hover:text-text-primary hover:border-border/80 transition-all flex-shrink-0"
          >
            <ArrowLeft size={15} />
          </button>

          {/* Monogram */}
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-black flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, var(--color-mint-tint) 0%, rgba(16,185,129,0.25) 100%)',
              color: 'var(--color-mint)',
              boxShadow: '0 4px 14px rgba(16,185,129,0.18)',
            }}
          >
            {client.name.charAt(0)}
          </div>

          {/* Name + badges */}
          <div className="min-w-0">
            <h1 className="text-xl font-black text-text-primary tracking-tight leading-tight truncate">{client.name}</h1>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest"
                style={{ backgroundColor: 'var(--color-mint-tint)', color: 'var(--color-mint)' }}>
                {client.department}
              </span>
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-border text-text-secondary bg-bg-surface">
                <ShieldCheck size={10} />SLA {client.sla}
              </span>
            </div>
          </div>

          {/* Right: meta info */}
          <div className="ml-auto hidden md:flex items-center gap-6 text-sm text-text-secondary flex-shrink-0">
            <span className="flex items-center gap-2"><Mail size={13} className="text-text-tertiary" />{client.email}</span>
            <span className="flex items-center gap-2"><User size={13} className="text-text-tertiary" />{client.contactPerson}</span>
            <span className="flex items-center gap-2"><Calendar size={13} className="text-text-tertiary" />Since {client.joinedAt}</span>
          </div>
        </div>

        {/* ── CHARTS ROW: Donuts left · Heatmap right ───────────────────── */}
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">

          {/* LEFT: Donut charts */}
          <div className="flex gap-4 items-center">
            <DonutPanel title="By Status" total={total} data={statusData} />
            <div className="w-px self-stretch bg-border/60 flex-shrink-0" />
            <DonutPanel title="By Priority" total={total} data={priorityData} />
          </div>

          {/* RIGHT: Monthly heatmap */}
          <div className="sf-card p-5 flex flex-col gap-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-text-tertiary">Daily Tickets</p>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <p className="text-2xl font-black text-text-primary tabular-nums">{monthTotal}</p>
                  <p className="text-xs text-text-tertiary">this month</p>
                </div>
              </div>
              {/* Month navigator */}
              <div className="flex items-center gap-2">
                <button onClick={prevMonth} className="w-7 h-7 rounded-lg border border-border bg-bg-surface flex items-center justify-center text-text-tertiary hover:text-text-primary transition-colors">
                  <ArrowLeft size={13} />
                </button>
                <span className="text-xs font-bold text-text-primary tabular-nums w-20 text-center">
                  {monthName} {heatYear}
                </span>
                <button onClick={nextMonth} disabled={!canGoNext}
                  className="w-7 h-7 rounded-lg border border-border bg-bg-surface flex items-center justify-center text-text-tertiary hover:text-text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                  <ArrowLeft size={13} className="rotate-180" />
                </button>
              </div>
            </div>

            {/* DOW labels */}
            <div className="grid grid-cols-7 gap-1">
              {DOW.map((l, i) => (
                <div key={i} className="text-center text-[9px] font-bold uppercase tracking-widest text-text-tertiary">{l}</div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: startDow }).map((_, i) => <div key={`b${i}`} />)}
              {heatDays.map(cell => (
                <div
                  key={cell.day}
                  title={cell.isFuture ? `${monthName} ${cell.day}` : `${monthName} ${cell.day} — ${cell.count} ticket${cell.count !== 1 ? 's' : ''}`}
                  className="aspect-square rounded-lg flex items-center justify-center cursor-default select-none transition-all duration-150 hover:scale-110 hover:z-10 relative"
                  style={{
                    backgroundColor: getHeatColor(cell.count, cell.isFuture),
                    border: cell.isToday
                      ? '1.5px solid rgba(16,185,129,0.75)'
                      : cell.isFuture
                        ? '1px dashed rgba(156,163,175,0.18)'
                        : '1px solid rgba(16,185,129,0.1)',
                    boxShadow: cell.isToday ? '0 0 0 3px rgba(16,185,129,0.12)' : 'none',
                  }}
                >
                  <span
                    className="text-[10px] font-semibold tabular-nums leading-none"
                    style={{
                      color: cell.isFuture
                        ? 'rgba(156,163,175,0.3)'
                        : cell.count > 0
                          ? 'rgba(6,78,59,0.9)'
                          : 'rgba(107,114,128,0.5)',
                      fontWeight: cell.isToday ? 700 : 500,
                    }}
                  >
                    {cell.day}
                  </span>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-end gap-1.5">
              <span className="text-[9px] text-text-tertiary">Low</span>
              {[0.07, 0.22, 0.45, 0.66, 0.88].map((o, i) => (
                <div key={i} className="w-4 h-4 rounded-[4px]"
                  style={{ backgroundColor: `rgba(16,185,129,${o})`, border: '1px solid rgba(16,185,129,0.12)' }} />
              ))}
              <span className="text-[9px] text-text-tertiary">High</span>
            </div>
          </div>
        </div>
        <div className="text-4xl font-bold text-text-primary">Tickets</div>
        {/* ── ENHANCED STATUS TAB BAR ─────────────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6 mt-4">
          {statusTabs.map(tab => {
            const active = selectedStatus === tab.key
            return (
              <button
                key={tab.key}
                onClick={() => setSelectedStatus(tab.key)}
                className={`
                  inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all duration-300
                  ${active
                    ? 'shadow-md scale-[1.02]'
                    : 'hover:opacity-80'
                  }
                `}
                style={!active ? { backgroundColor: '#2a2a2a', color: '#a1a1aa' } : { backgroundColor: '#ffffff', color: '#000000' }}
              >
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* ── TICKETS GRID ────────────────────────────────────────────────── */}
        <div>
          <p className="text-xs text-text-tertiary mb-4">
            Showing <span className="font-bold text-text-primary">{visibleTickets.length}</span> ticket{visibleTickets.length !== 1 ? 's' : ''}
            {selectedStatus !== 'all' && ` · ${STATUS_CFG[selectedStatus].label}`}
          </p>

          {clientTickets.length === 0 ? (
            <div className="sf-card p-12 text-center text-text-tertiary">No tickets found for this client.</div>
          ) : visibleTickets.length === 0 ? (
            <div className="sf-card p-12 text-center">
              <p className="text-sm font-semibold text-text-primary">No tickets match this filter.</p>
              <p className="mt-1 text-xs text-text-tertiary">Try a different status or priority combination.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {visibleTickets.map(ticket => (
                <TicketCard key={ticket.id} ticket={ticket} employees={employees} />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}


