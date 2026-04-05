import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/store/auth-store'

export function ProtectedRoute() {
  const { isAuthenticated, isHydrating } = useAuthStore()

  if (isHydrating) {
    return (
      <div className="flex items-center justify-center h-screen bg-bg-page">
        <div className="w-6 h-6 rounded-full border-2 border-accent-mint border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <Outlet />
}
