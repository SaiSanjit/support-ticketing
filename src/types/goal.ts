import type { User } from './user'

export type GoalStatus = 'on-track' | 'at-risk' | 'off-track' | 'completed' | 'paused'
export type GoalTimeframe = 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'annual' | 'custom'

export interface Goal {
  id: string
  title: string
  description?: string
  status: GoalStatus
  timeframe: GoalTimeframe
  progress: number         // 0–100
  ownerId: string
  owner?: User
  linkedProjectIds: string[]
  startDate?: string
  dueDate?: string
  createdAt: string
  updatedAt: string
}
