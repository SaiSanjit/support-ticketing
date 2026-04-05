import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppLayout } from '@/layouts/AppLayout'
import { AuthLayout } from '@/layouts/AuthLayout'
import { ProjectLayout } from '@/layouts/ProjectLayout'
import { ProtectedRoute } from '@/components/ProtectedRoute'

// Pages
import { DashboardPage } from '@/pages/DashboardPage'
import { LoginPage } from '@/pages/LoginPage'
import { SignupPage } from '@/pages/SignupPage'
import { PortalPage } from '@/pages/PortalPage'
import { InboxPage } from '@/pages/InboxPage'
import { GoalsPage } from '@/pages/GoalsPage'
import { TeamPage } from '@/pages/TeamPage'
import { SettingsGeneralPage } from '@/pages/SettingsGeneralPage'
import { SettingsMembersPage } from '@/pages/SettingsMembersPage'
import { BoardPage } from '@/pages/BoardPage'
import { TablePage } from '@/pages/TablePage'
import { TimelinePage } from '@/pages/TimelinePage'
import { SupportDashboardPage } from '@/pages/SupportDashboardPage'
import { ClientDetailPage } from '@/pages/ClientDetailPage'
import { TicketDetailPage } from '@/pages/TicketDetailPage'
import { EmployeeDetailPage } from '@/pages/EmployeeDetailPage'

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/dashboard" replace /> },

  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/signup', element: <SignupPage /> },
    ],
  },

  { path: '/portal/:token', element: <PortalPage /> },

  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: '/dashboard', element: <DashboardPage /> },
          { path: '/inbox', element: <InboxPage /> },
          { path: '/goals', element: <GoalsPage /> },
          { path: '/team', element: <TeamPage /> },
          { path: '/settings/general', element: <SettingsGeneralPage /> },
          { path: '/settings/members', element: <SettingsMembersPage /> },

          // Detail screens
          { path: '/clients/:clientId', element: <ClientDetailPage /> },
          { path: '/tickets/:ticketId', element: <TicketDetailPage /> },
          { path: '/team/:employeeId', element: <EmployeeDetailPage /> },

          // Project views
          {
            path: '/projects/:projectId',
            element: <ProjectLayout />,
            children: [
              { index: true, element: <Navigate to="board" replace /> },
              { path: 'board', element: <BoardPage /> },
              { path: 'table', element: <TablePage /> },
              { path: 'timeline', element: <TimelinePage /> },
            ],
          },
        ],
      },
      { path: '/support-dashboard', element: <SupportDashboardPage /> },
    ],
  },
])
