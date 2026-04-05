import type { User } from './user'

export type ProjectStatus = 'active' | 'on-hold' | 'completed' | 'archived'

export interface Project {
  id: string
  name: string
  description?: string
  status: ProjectStatus
  color: string        // hex accent color for the project
  emoji?: string
  ownerId: string
  owner?: User
  memberIds: string[]
  members?: User[]
  taskCount: number
  completedTaskCount: number
  dueDate?: string
  createdAt: string
  updatedAt: string
}

export interface CreateProjectDto {
  name: string
  description?: string
  color?: string
  emoji?: string
  dueDate?: string
}

export interface UpdateProjectDto {
  name?: string
  description?: string
  status?: ProjectStatus
  color?: string
  emoji?: string
  dueDate?: string
}
