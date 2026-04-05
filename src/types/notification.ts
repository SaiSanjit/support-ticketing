export type NotificationType =
  | 'task_assigned'
  | 'task_commented'
  | 'task_status_changed'
  | 'task_due_soon'
  | 'project_invite'
  | 'mention'
  | 'goal_update'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  body: string
  isRead: boolean
  actorId?: string
  actorName?: string
  actorAvatarUrl?: string
  resourceType: 'task' | 'project' | 'goal' | 'comment'
  resourceId: string
  resourceTitle: string
  createdAt: string
}
