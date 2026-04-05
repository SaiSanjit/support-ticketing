import { useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useTaskStore } from '@/store/task-store'
import { SEED_USERS } from '@/mock/seed'
import type { Task, TaskStatus, TaskPriority } from '@/types'
import {
  MessageSquare, Paperclip, Calendar,
  CheckSquare, MoreHorizontal, Clock, Plus, Search,
  LayoutGrid, List, AlignJustify, ArrowUpRight, PhoneCall
} from 'lucide-react'

// ── Config ──────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<TaskStatus, {
  label: string
  color: string
}> = {
  // Using dashboard neon colors
  'todo':        { label: 'To Do',       color: '#FFA27D' }, // Peach
  'in-progress': { label: 'In Progress', color: '#FFF87C' }, // Yellow (like Credits)
  'review':      { label: 'Review',      color: '#DDCBF5' }, // Lavender
  'done':        { label: 'Done',        color: '#88FF9D' }, // Neon Green (like Paid)
}

const PRIORITY_CONFIG: Record<TaskPriority, { label: string; bg: string; text: string }> = {
  urgent: { label: 'Urgent', bg: 'rgba(255,92,92,0.15)', text: '#FF5C5C' },
  high:   { label: 'High',   bg: 'rgba(255,162,125,0.15)', text: '#FFA27D' },
  medium: { label: 'Medium', bg: 'rgba(255,248,124,0.12)', text: '#FFF87C' },
  low:    { label: 'Low',    bg: 'rgba(154,154,184,0.10)', text: '#9A9AB8' },
}

const STATUS_ORDER: TaskStatus[] = ['todo', 'in-progress', 'review', 'done']
const userMap = Object.fromEntries(SEED_USERS.map((u) => [u.id, u]))

// Accent palette cycling for activity cards (matching dashboard timeline)
const ACTIVITY_ACCENTS = ['#E3D3F9', '#FFF87C', '#88FF9D', '#FFA27D']

// ── Task Card ────────────────────────────────────────────────────────
function TaskCard({ task }: { task: Task }) {
  const prio = PRIORITY_CONFIG[task.priority]
  const assignee = task.assigneeId ? userMap[task.assigneeId] : null
  const dueDateStr = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : null
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done'

  return (
    <div className="sf-card p-4 group cursor-pointer hover:border-border-active transition-all flex flex-col gap-3">
      {/* Top row: priority + menu */}
      <div className="flex items-center justify-between gap-2">
        <span
          className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full"
          style={{ color: prio.text, background: prio.bg }}
        >
          {prio.label}
        </span>
        <button className="opacity-0 group-hover:opacity-100 p-1 rounded-full transition-opacity text-text-tertiary hover:text-text-primary hover:bg-bg-hover">
          <MoreHorizontal size={13} />
        </button>
      </div>


      {/* Title */}
      <p className="text-text-primary text-[13px] font-medium leading-snug line-clamp-2">
        {task.title}
      </p>

      {/* Description snippet */}
      {task.description && (
        <p className="text-text-tertiary text-[11px] leading-relaxed line-clamp-1 -mt-1">
          {task.description}
        </p>
      )}

      {/* Tags */}
      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {task.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-2 py-0.5 rounded-md font-medium bg-bg-surface/30 text-text-tertiary border border-border/50"
            >
              {tag}
            </span>

          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between gap-2 pt-2 mt-auto border-t border-border/50">
        {/* Counts */}
        <div className="flex items-center gap-3 text-text-tertiary text-[11px]">
          {task.subtaskCount > 0 && (
            <span className="flex items-center gap-1">
              <CheckSquare size={11} />
              <span>{task.completedSubtaskCount}/{task.subtaskCount}</span>
            </span>
          )}
          {task.commentCount > 0 && (
            <span className="flex items-center gap-1">
              <MessageSquare size={11} />
              <span>{task.commentCount}</span>
            </span>
          )}
          {task.attachmentCount > 0 && (
            <span className="flex items-center gap-1">
              <Paperclip size={11} />
              <span>{task.attachmentCount}</span>
            </span>
          )}
        </div>


        {/* Due date + avatar */}
        <div className="flex items-center gap-2">
          {dueDateStr && (
            <span
              className="flex items-center gap-1 text-[10px] font-medium"
              style={{ color: isOverdue ? '#FF5C5C' : 'var(--color-text-tertiary)' }}
            >
              {isOverdue ? <Clock size={10} /> : <Calendar size={10} />}
              {dueDateStr}
            </span>
          )}
          {assignee && (
            <img
              src={assignee.avatarUrl}
              alt={assignee.name}
              title={assignee.name}
              className="w-5 h-5 rounded-full object-cover border border-border"
            />
          )}
        </div>

      </div>
    </div>
  )
}

// ── Kanban Column ────────────────────────────────────────────────────
function KanbanColumn({ status, tasks }: { status: TaskStatus; tasks: Task[] }) {
  const cfg = STATUS_CONFIG[status]

  return (
    <div className="flex flex-col flex-shrink-0 w-[280px]">
      {/* Column header */}
      <div className="flex items-center gap-2 mb-4 px-1">
        <div
          className="w-2.5 h-2.5 rounded-full flex-shrink-0 shadow-lg"
          style={{ backgroundColor: cfg.color, boxShadow: `0 0 10px ${cfg.color}80` }}
        />
        <span className="text-text-primary text-[14px] font-medium">{cfg.label}</span>
        <span
          className="ml-auto text-[11px] font-bold px-2 py-0.5 rounded-full bg-bg-surface/20 text-text-tertiary"
        >
          {tasks.length}
        </span>
        <button className="p-1 rounded-full text-text-tertiary hover:text-text-primary hover:bg-bg-hover transition-colors">
          <Plus size={14} />
        </button>
      </div>


      {/* Cards container */}
      <div className="flex flex-col gap-3 flex-1 overflow-y-auto min-h-0 sf-scroll pr-1">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>

      {/* Add task button */}
      <button
        className="mt-3 flex items-center justify-center gap-2 py-3 rounded-2xl text-[12px] text-text-tertiary hover:text-text-secondary transition-all duration-200 border border-border bg-bg-surface/10 hover:bg-bg-surface/20"
      >
        <Plus size={14} />
        Add task
      </button>

    </div>
  )
}

// ── Activity Panel (Dashboard Style) ─────────────────────────────────
function ActivityPanel({ tasks }: { tasks: Task[] }) {
  const upcoming = tasks
    .filter((t) => t.dueDate && t.status !== 'done')
    .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
    .slice(0, 4)

  return (
    <aside className="w-[340px] sf-panel p-5 flex flex-col mx-6 my-2 h-auto flex-shrink-0 mb-6">
      <div className="flex items-center justify-between mb-8">
         <h2 className="text-xl text-text-primary font-medium pl-1">Activity</h2>
         <div className="flex items-center gap-1.5">
            <button className="w-8 h-8 rounded-full glass-btn p-0 flex items-center justify-center transition-colors">
               <Calendar size={13} />
            </button>
            <button className="w-8 h-8 rounded-full glass-btn p-0 flex items-center justify-center transition-colors">
               <PhoneCall size={13} />
            </button>
            <button className="w-8 h-8 rounded-full glass-btn p-0 flex items-center justify-center transition-colors">
               <Plus size={13} />
            </button>
         </div>
      </div>

      <div className="mb-6 flex items-end justify-between px-2">
         <h3 className="text-text-secondary font-medium">Upcoming</h3>
         <div className="flex items-baseline gap-1">
            <span className="text-2xl text-text-primary font-light">{upcoming.length}</span>
            <span className="text-[10px] text-text-tertiary">Tasks</span>
         </div>
      </div>


      {/* Timeline Cards strictly matching dashboard sf-timeline-card */}
      <div className="flex-1 space-y-2 relative sf-scroll overflow-y-auto">
         {upcoming.map((task, i) => {
           const assignee = task.assigneeId ? userMap[task.assigneeId] : null
           const accent = ACTIVITY_ACCENTS[i % ACTIVITY_ACCENTS.length]
           
           // Format date specifically for timeline
           const dateObj = new Date(task.dueDate!)
           const dayText = dateObj.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
           
           // We'll alternate shapes by applying a negative margin occasionally like the dashboard does
           const isOverlap = i > 0
           const zIndex = 20 - i

           return (
             <div 
               key={task.id}
               className={`sf-timeline-card relative ${isOverlap ? '-mt-4 pt-6 shadow-[0_-5px_20px_rgba(0,0,0,0.1)]' : ''}`}
               style={{ backgroundColor: accent, color: '#1A1A1A', zIndex }}
             >
                <div className="sf-timeline-date pr-3 border-r border-black/10 min-w-[70px]">
                   <div className="w-7 h-7 rounded-full bg-white/40 mb-2 flex items-center justify-center">
                      <Calendar size={12} />
                   </div>
                   <span className="font-bold text-[11px] block">{dayText}</span>
                   <span className="text-[9px] opacity-60">Due</span>
                </div>
                <div className="sf-timeline-content flex-1 pl-3 flex flex-col justify-center">
                   <h4 className="font-semibold text-[13px] mb-1 leading-tight line-clamp-2">{task.title}</h4>
                   {assignee && (
                      <div className="flex items-center gap-1.5 mt-1">
                         <img src={assignee.avatarUrl} className="w-4 h-4 rounded-full bg-white/50 border border-black/10" />
                         <span className="text-[10px] inline-block leading-tight">
                            <span className="font-semibold">{assignee.name}</span>
                         </span>
                      </div>
                   )}
                </div>
                <button className={`w-7 h-7 rounded-full bg-white text-black flex items-center justify-center shadow-sm absolute right-3 top-1/2 -translate-y-1/2 self-center hover:scale-105 transition-transform ${isOverlap ? 'mt-3' : ''}`}>
                   <ArrowUpRight size={13} />
                </button>
             </div>
           )
         })}

         {upcoming.length === 0 && (
           <div className="text-center py-10 px-4 mt-4 border border-border rounded-2xl bg-bg-surface/20">
              <p className="text-text-tertiary text-sm">No upcoming tasks.</p>
           </div>
         )}

      </div>
    </aside>
  )
}

// ── Board toolbar ─────────────────────────────────────────────────────
function BoardToolbar({ total }: { total: number }) {
  return (
    <div className="flex items-center justify-between px-6 py-4 flex-shrink-0 animate-fade-in">
      <div className="flex items-center gap-4">
        <div className="flex items-baseline gap-2">
           <span className="text-3xl text-text-primary font-light">{total}</span>
           <span className="text-text-tertiary text-sm">Tasks</span>
        </div>
      </div>


      <div className="flex items-center gap-3">
        {/* Search tasks */}
        <div className="flex items-center w-64 px-4 py-2 rounded-full border border-border bg-bg-surface/20 text-text-secondary focus-within:bg-bg-hover transition-all">
          <Search size={14} className="text-text-tertiary mr-2" />
          <input 
            type="text" 
            placeholder="Search board..." 
            className="bg-transparent border-none outline-none text-[13px] text-text-primary w-full placeholder:text-text-tertiary"
          />
        </div>

        {/* View toggles */}
        <div className="flex items-center rounded-full border border-border bg-bg-surface/10 p-1">
          <button className="w-8 h-8 flex items-center justify-center rounded-full bg-bg-elevated text-text-primary shadow-sm">
            <LayoutGrid size={14} />
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-full text-text-tertiary hover:text-text-primary hover:bg-bg-hover transition-colors">
            <List size={14} />
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-full text-text-tertiary hover:text-text-primary hover:bg-bg-hover transition-colors">
            <AlignJustify size={14} />
          </button>
        </div>

      </div>
    </div>
  )
}

// ── Board Page ────────────────────────────────────────────────────────
export function BoardPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const { tasks, fetchTasks, isLoading } = useTaskStore()

  useEffect(() => {
    fetchTasks(projectId)
  }, [projectId, fetchTasks])

  const taskList = useMemo(() => Object.values(tasks), [tasks])

  const byStatus = useMemo(
    () =>
      STATUS_ORDER.reduce<Record<TaskStatus, Task[]>>(
        (acc, s) => {
          acc[s] = taskList
            .filter((t) => t.status === s && t.projectId === projectId)
            .sort((a, b) => a.order - b.order)
          return acc
        },
        { todo: [], 'in-progress': [], review: [], done: [] }
      ),
    [taskList, projectId]
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 rounded-full border-2 border-border border-t-accent-mint animate-spin" />
      </div>

    )
  }

  return (
    <div className="flex flex-col h-full min-h-0 relative z-10 animate-fade-in w-full">
      <BoardToolbar total={taskList.filter((t) => t.projectId === projectId).length} />

      <div className="flex flex-1 min-h-0 w-full overflow-hidden">
        {/* Kanban columns */}
        <div className="flex-1 overflow-x-auto overflow-y-hidden sf-scroll">
          <div className="flex gap-6 h-full px-6 pb-6 pt-2" style={{ minWidth: 'max-content' }}>
            {STATUS_ORDER.map((status) => (
              <KanbanColumn key={status} status={status} tasks={byStatus[status]} />
            ))}
          </div>
        </div>

        {/* Activity panel matching Dashboard style */}
        <ActivityPanel tasks={taskList} />
      </div>
    </div>
  )
}
