export type UserRole = 'owner' | 'admin' | 'member' | 'viewer'

export interface User {
  id: string
  name: string
  email: string
  avatarUrl?: string
  role: UserRole
  createdAt: string
  updatedAt: string
}
