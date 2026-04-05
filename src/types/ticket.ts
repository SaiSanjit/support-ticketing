export type TicketStatus = 'open' | 'in-progress' | 'pending' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  clientId: string;
  clientName: string;
  employeeId: string;
  employeeName: string;
  department: string;
  createdAt: string;
  updatedAt: string;
}

export interface TicketNotification {
  id: string;
  ticketId: string;
  message: string;
  type: 'new_ticket' | 'status_change' | 'priority_escalation';
  timestamp: string;
  read: boolean;
}
