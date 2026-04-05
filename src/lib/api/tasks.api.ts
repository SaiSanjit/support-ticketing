import { apiClient } from './client'
import type { Task, CreateTaskDto, UpdateTaskDto } from '@/types'

export type TaskFilters = {
  projectId?: string
  status?: string
  assigneeId?: string
  priority?: string
}

export const tasksApi = {
  list: (filters?: TaskFilters) => {
    const params = new URLSearchParams(
      Object.entries(filters ?? {}).filter(([, v]) => v !== undefined) as [string, string][]
    ).toString()
    return apiClient<Task[]>(`/api/tasks${params ? `?${params}` : ''}`)
  },

  get: (id: string) => apiClient<Task>(`/api/tasks/${id}`),

  create: (dto: CreateTaskDto) =>
    apiClient<Task>('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(dto),
    }),

  update: (id: string, dto: UpdateTaskDto) =>
    apiClient<Task>(`/api/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(dto),
    }),

  delete: (id: string) =>
    apiClient<void>(`/api/tasks/${id}`, { method: 'DELETE' }),
}
