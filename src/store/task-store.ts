import { create } from 'zustand'
import type { Task, UpdateTaskDto, CreateTaskDto } from '@/types'
import { tasksApi } from '@/lib/api/tasks.api'
import { nanoid } from 'nanoid'

type TaskState = {
  tasks: Record<string, Task>
  isLoading: boolean
  error: string | null

  setTasks: (tasks: Task[]) => void
  fetchTasks: (projectId?: string) => Promise<void>

  optimisticCreate: (dto: CreateTaskDto & { projectId: string }) => Promise<void>
  optimisticUpdate: (id: string, dto: UpdateTaskDto) => Promise<void>
  optimisticDelete: (id: string) => Promise<void>
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: {},
  isLoading: false,
  error: null,

  setTasks: (tasks) =>
    set({ tasks: Object.fromEntries(tasks.map((t) => [t.id, t])) }),

  fetchTasks: async (projectId) => {
    set({ isLoading: true, error: null })
    const res = await tasksApi.list(projectId ? { projectId } : undefined)
    if (res.success) {
      set({ tasks: Object.fromEntries(res.data.map((t) => [t.id, t])), isLoading: false })
    } else {
      set({ isLoading: false, error: res.error })
    }
  },

  optimisticCreate: async (dto) => {
    const tempId = `temp-${nanoid(6)}`
    const now = new Date().toISOString()
    const optimistic: Task = {
      id: tempId,
      title: dto.title,
      description: dto.description,
      status: dto.status ?? 'todo',
      priority: dto.priority ?? 'medium',
      projectId: dto.projectId,
      assigneeId: dto.assigneeId,
      reporterId: 'u-1',
      tags: dto.tags ?? [],
      subtaskCount: 0,
      completedSubtaskCount: 0,
      commentCount: 0,
      attachmentCount: 0,
      order: Object.values(get().tasks).filter((t) => t.projectId === dto.projectId).length,
      createdAt: now,
      updatedAt: now,
    }
    set((s) => ({ tasks: { ...s.tasks, [tempId]: optimistic } }))

    const res = await tasksApi.create(dto)
    if (res.success) {
      set((s) => {
        const next = { ...s.tasks }
        delete next[tempId]
        next[res.data.id] = res.data
        return { tasks: next }
      })
    } else {
      // Rollback
      set((s) => {
        const next = { ...s.tasks }
        delete next[tempId]
        return { tasks: next }
      })
    }
  },

  optimisticUpdate: async (id, dto) => {
    const prev = get().tasks[id]
    if (!prev) return
    const optimistic = { ...prev, ...dto, updatedAt: new Date().toISOString() }
    set((s) => ({ tasks: { ...s.tasks, [id]: optimistic } }))

    const res = await tasksApi.update(id, dto)
    if (res.success) {
      set((s) => ({ tasks: { ...s.tasks, [id]: res.data } }))
    } else {
      // Rollback
      set((s) => ({ tasks: { ...s.tasks, [id]: prev } }))
    }
  },

  optimisticDelete: async (id) => {
    const prev = get().tasks[id]
    if (!prev) return
    set((s) => {
      const next = { ...s.tasks }
      delete next[id]
      return { tasks: next }
    })

    const res = await tasksApi.delete(id)
    if (!res.success) {
      // Rollback
      set((s) => ({ tasks: { ...s.tasks, [id]: prev } }))
    }
  },
}))
