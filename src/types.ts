export type TicketStatus = 'available' | 'selected' | 'taken';

export interface Ticket {
  id: number;
  status: TicketStatus;
  taken: boolean; // Keep for backward compatibility
  selectedBy?: string;
  selectedAt?: string;
  takenBy?: string;
  takenAt?: string;
  paymentConfirmed?: boolean;
  transactionCode?: string;
}

export interface ActionHistory {
  id: string;
  type: 'toggle' | 'bulk' | 'reset';
  timestamp: string;
  previousState: Ticket[];
  description: string;
}

export interface RaffleStats {
  totalTickets: number;
  takenTickets: number;
  selectedTickets: number;
  availableTickets: number;
  percentageTaken: number;
  percentageSelected: number;
}
