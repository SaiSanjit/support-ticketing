import type { User } from './user'

export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done'
export type TaskPriority = 'urgent' | 'high' | 'medium' | 'low'

export interface Task {
  id: string
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  projectId: string
  assigneeId?: string
  assignee?: User
  reporterId: string
  reporter?: User
  dueDate?: string
  completedAt?: string
  tags: string[]
  subtaskCount: number
  completedSubtaskCount: number
  commentCount: number
  attachmentCount: number
  order: number
  createdAt: string
  updatedAt: string
}

export interface CreateTaskDto {
  title: string
  description?: string
  status?: TaskStatus
  priority?: TaskPriority
  projectId: string
  assigneeId?: string
  dueDate?: string
  tags?: string[]
}

export interface UpdateTaskDto {
  title?: string
  description?: string
  status?: TaskStatus
  priority?: TaskPriority
  assigneeId?: string
  dueDate?: string
  tags?: string[]
  order?: number
}
