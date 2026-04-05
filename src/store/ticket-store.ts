import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Ticket, TicketNotification } from '@/types'

export interface Client {
  id: string;
  name: string;
  logo: string;
  department: string;
  email: string;
  contactPerson: string;
  contractValue: number;
  sla: string;
  pendingTickets: number;
  inProgressTickets: number;
  totalTickets: number;
  joinedAt: string;
}

export interface Employee {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'busy';
  activeTickets: number;
  role: string;
  email: string;
  department: string;
  resolvedTickets: number;
  joinedAt: string;
}

interface TicketState {
  tickets: Ticket[]
  notifications: TicketNotification[]
  clients: Client[]
  employees: Employee[]
  isLoading: boolean
  setTickets: (tickets: Ticket[]) => void
  addTicket: (ticket: Ticket) => void
  updateTicket: (id: string, updates: Partial<Ticket>) => void
  addNotification: (notification: TicketNotification) => void
  markNotificationAsRead: (id: string) => void
  clearNotifications: () => void
  seedTickets: () => void
  seedDashboardData: () => void
}

export const useTicketStore = create<TicketState>()(
  persist(
    (set) => ({
      tickets: [],
      notifications: [],
      clients: [],
      employees: [],
      isLoading: false,

      setTickets: (tickets) => set({ tickets }),
      addTicket: (ticket) => set((state) => ({ tickets: [ticket, ...state.tickets] })),
      updateTicket: (id, updates) => set((state) => ({
        tickets: state.tickets.map((t) => t.id === id ? { ...t, ...updates } : t)
      })),
      addNotification: (notification) => set((state) => ({
        notifications: [notification, ...state.notifications].slice(0, 50)
      })),
      markNotificationAsRead: (id) => set((state) => ({
        notifications: state.notifications.map((n) => n.id === id ? { ...n, read: true } : n)
      })),
      clearNotifications: () => set({ notifications: [] }),

      seedTickets: () => set({
        tickets: [
          { id: '1', title: 'Critical Server Outage', description: 'Major service disruption in the US-East region.', status: 'in-progress', priority: 'urgent', clientId: 'c1', clientName: 'Tesla Motors', employeeId: 'e1', employeeName: 'Sarah Wilson', department: 'SCM', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          { id: '2', title: 'Login issues on mobile app', description: 'Users unable to authenticate using iOS app.', status: 'open', priority: 'high', clientId: 'c2', clientName: 'SpaceX', employeeId: 'e2', employeeName: 'Michael Chen', department: 'EPM', createdAt: new Date(Date.now() - 3600000).toISOString(), updatedAt: new Date(Date.now() - 3600000).toISOString() },
          { id: '3', title: 'Billing discrepancy for Q1', description: 'Client noticed a double charge on their March invoice.', status: 'open', priority: 'medium', clientId: 'c3', clientName: 'Apple Inc', employeeId: 'e3', employeeName: 'Alex Johnson', department: 'OTM', createdAt: new Date(Date.now() - 7200000).toISOString(), updatedAt: new Date(Date.now() - 7200000).toISOString() }
        ]
      }),

      seedDashboardData: () => set({
        tickets: [
          { id: 't1', title: 'SCM Integration Failure', description: 'Supply chain module failing to sync with ERP after last deployment. All automated PO workflows are stalled.', status: 'in-progress', priority: 'urgent', clientId: 'c1', clientName: 'Tesla Motors', employeeId: 'e1', employeeName: 'Sarah Wilson', department: 'SCM', createdAt: new Date(Date.now() - 7200000).toISOString(), updatedAt: new Date().toISOString() },
          { id: 't2', title: 'Dashboard Reports Not Loading', description: 'Analytics dashboard times out when loading Q1 fleet reports. Issue started after the March 28 deployment.', status: 'pending', priority: 'high', clientId: 'c1', clientName: 'Tesla Motors', employeeId: 'e2', employeeName: 'Michael Chen', department: 'SCM', createdAt: new Date(Date.now() - 14400000).toISOString(), updatedAt: new Date(Date.now() - 3600000).toISOString() },
          { id: 't3', title: 'User Access Permissions Issue', description: 'New team members unable to access project planning modules. Role assignment not propagating correctly.', status: 'open', priority: 'medium', clientId: 'c1', clientName: 'Tesla Motors', employeeId: 'e3', employeeName: 'Alex Johnson', department: 'SCM', createdAt: new Date(Date.now() - 86400000).toISOString(), updatedAt: new Date(Date.now() - 43200000).toISOString() },
          { id: 't4', title: 'Invoice Generation Bug', description: 'Automated invoices missing line items for subscription services billed quarterly.', status: 'open', priority: 'high', clientId: 'c1', clientName: 'Tesla Motors', employeeId: 'e1', employeeName: 'Sarah Wilson', department: 'SCM', createdAt: new Date(Date.now() - 172800000).toISOString(), updatedAt: new Date(Date.now() - 86400000).toISOString() },
          { id: 't5', title: 'API Rate Limit Exceeded', description: 'Third-party launch telemetry API hitting rate limits during peak mission windows. Fallback needed.', status: 'in-progress', priority: 'urgent', clientId: 'c2', clientName: 'SpaceX', employeeId: 'e2', employeeName: 'Michael Chen', department: 'EPM', createdAt: new Date(Date.now() - 3600000).toISOString(), updatedAt: new Date().toISOString() },
          { id: 't6', title: 'Data Export Formatting Error', description: 'CSV exports from the mission planning module have misaligned columns on rows > 1000.', status: 'pending', priority: 'low', clientId: 'c2', clientName: 'SpaceX', employeeId: 'e4', employeeName: 'Emma Davis', department: 'EPM', createdAt: new Date(Date.now() - 259200000).toISOString(), updatedAt: new Date(Date.now() - 172800000).toISOString() },
          { id: 't7', title: 'SSO Login Redirect Loop', description: 'Users routed in infinite redirect loop when accessing via company SSO. Affects ~40% of users.', status: 'open', priority: 'high', clientId: 'c2', clientName: 'SpaceX', employeeId: 'e1', employeeName: 'Sarah Wilson', department: 'EPM', createdAt: new Date(Date.now() - 43200000).toISOString(), updatedAt: new Date(Date.now() - 21600000).toISOString() },
          { id: 't8', title: 'Notification Service Down', description: 'Push notifications not being delivered for critical system alerts across all platforms.', status: 'in-progress', priority: 'medium', clientId: 'c2', clientName: 'SpaceX', employeeId: 'e3', employeeName: 'Alex Johnson', department: 'EPM', createdAt: new Date(Date.now() - 10800000).toISOString(), updatedAt: new Date(Date.now() - 1800000).toISOString() },
          { id: 't9', title: 'App Store Deploy Failure', description: 'Automated CI/CD pipeline failing at final deployment stage. Binary validation rejected by App Store Connect.', status: 'open', priority: 'urgent', clientId: 'c3', clientName: 'Apple Inc', employeeId: 'e4', employeeName: 'Emma Davis', department: 'OTM', createdAt: new Date(Date.now() - 1800000).toISOString(), updatedAt: new Date().toISOString() },
          { id: 't10', title: 'Memory Leak in SDK', description: 'iOS SDK version 14.2 leaking memory on older A12 devices, causing app crashes after ~20 minutes.', status: 'pending', priority: 'high', clientId: 'c3', clientName: 'Apple Inc', employeeId: 'e2', employeeName: 'Michael Chen', department: 'OTM', createdAt: new Date(Date.now() - 21600000).toISOString(), updatedAt: new Date(Date.now() - 7200000).toISOString() },
          { id: 't11', title: 'Payment Gateway Timeout', description: 'App Store purchases timing out for users in APAC region. Revenue impact estimated at $50K/day.', status: 'in-progress', priority: 'urgent', clientId: 'c3', clientName: 'Apple Inc', employeeId: 'e1', employeeName: 'Sarah Wilson', department: 'OTM', createdAt: new Date(Date.now() - 5400000).toISOString(), updatedAt: new Date(Date.now() - 900000).toISOString() },
          { id: 't12', title: 'Search Index Rebuild', description: 'Full-text search returning stale results after last content migration. Affects Spotlight and in-app search.', status: 'open', priority: 'medium', clientId: 'c3', clientName: 'Apple Inc', employeeId: 'e3', employeeName: 'Alex Johnson', department: 'OTM', createdAt: new Date(Date.now() - 432000000).toISOString(), updatedAt: new Date(Date.now() - 259200000).toISOString() },
          { id: 't13', title: 'HCM Module Sync Error', description: 'Employee records not syncing between HRIS and the payroll module. Payroll run is blocked.', status: 'pending', priority: 'medium', clientId: 'c4', clientName: 'Google', employeeId: 'e2', employeeName: 'Michael Chen', department: 'HCM', createdAt: new Date(Date.now() - 28800000).toISOString(), updatedAt: new Date(Date.now() - 14400000).toISOString() },
          { id: 't14', title: 'Ad Manager API Downtime', description: 'Programmatic ad spend reporting API returning 503 errors. DV360 campaigns cannot be managed.', status: 'in-progress', priority: 'high', clientId: 'c4', clientName: 'Google', employeeId: 'e4', employeeName: 'Emma Davis', department: 'HCM', createdAt: new Date(Date.now() - 9000000).toISOString(), updatedAt: new Date(Date.now() - 3600000).toISOString() },
          { id: 't15', title: 'Cloud Storage Quota Alert', description: 'Workspace GCS storage approaching 95% capacity — urgent archival/cleanup required to avoid service denial.', status: 'open', priority: 'low', clientId: 'c4', clientName: 'Google', employeeId: 'e1', employeeName: 'Sarah Wilson', department: 'HCM', createdAt: new Date(Date.now() - 50400000).toISOString(), updatedAt: new Date(Date.now() - 36000000).toISOString() },
        ],
        clients: [
          { id: 'c1', name: 'Tesla Motors', logo: 'https://logo.clearbit.com/tesla.com', department: 'SCM', email: 'ops@tesla.com', contactPerson: 'Elon R.', contractValue: 240000, sla: '99.9%', pendingTickets: 5, inProgressTickets: 3, totalTickets: 12, joinedAt: '2023-01-15' },
          { id: 'c2', name: 'SpaceX', logo: 'https://logo.clearbit.com/spacex.com', department: 'EPM', email: 'it@spacex.com', contactPerson: 'Gwynne S.', contractValue: 185000, sla: '99.5%', pendingTickets: 2, inProgressTickets: 4, totalTickets: 8, joinedAt: '2023-04-01' },
          { id: 'c3', name: 'Apple Inc', logo: 'https://logo.clearbit.com/apple.com', department: 'OTM', email: 'support@apple.com', contactPerson: 'Tim C.', contractValue: 520000, sla: '99.99%', pendingTickets: 8, inProgressTickets: 2, totalTickets: 15, joinedAt: '2022-09-12' },
          { id: 'c4', name: 'Google', logo: 'https://logo.clearbit.com/google.com', department: 'HCM', email: 'enterprise@google.com', contactPerson: 'Sundar P.', contractValue: 310000, sla: '99.8%', pendingTickets: 1, inProgressTickets: 1, totalTickets: 5, joinedAt: '2023-07-20' },
        ],
        employees: [
          { id: 'e1', name: 'Sarah Wilson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', status: 'online', activeTickets: 5, role: 'Senior Support Engineer', email: 'sarah.wilson@flow.io', department: 'SCM / OTM', resolvedTickets: 142, joinedAt: '2021-03-10' },
          { id: 'e2', name: 'Michael Chen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael', status: 'busy', activeTickets: 8, role: 'Integration Specialist', email: 'michael.chen@flow.io', department: 'EPM / HCM', resolvedTickets: 98, joinedAt: '2022-06-01' },
          { id: 'e3', name: 'Alex Johnson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex', status: 'online', activeTickets: 3, role: 'Support Analyst', email: 'alex.johnson@flow.io', department: 'SCM / OTM', resolvedTickets: 76, joinedAt: '2023-01-15' },
          { id: 'e4', name: 'Emma Davis', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma', status: 'offline', activeTickets: 0, role: 'Technical Account Manager', email: 'emma.davis@flow.io', department: 'EPM / HCM', resolvedTickets: 204, joinedAt: '2020-11-08' },
        ]
      })
    }),
    {
      name: 'sf-ticket-storage',
      partialize: (state) => ({ notifications: state.notifications }),
    }
  )
)
