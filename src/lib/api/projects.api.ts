import { apiClient } from './client'
import type { Project, CreateProjectDto, UpdateProjectDto } from '@/types'

export const projectsApi = {
  list: () => apiClient<Project[]>('/api/projects'),

  get: (id: string) => apiClient<Project>(`/api/projects/${id}`),

  create: (dto: CreateProjectDto) =>
    apiClient<Project>('/api/projects', {
      method: 'POST',
      body: JSON.stringify(dto),
    }),

  update: (id: string, dto: UpdateProjectDto) =>
    apiClient<Project>(`/api/projects/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(dto),
    }),

  delete: (id: string) =>
    apiClient<void>(`/api/projects/${id}`, { method: 'DELETE' }),
}
