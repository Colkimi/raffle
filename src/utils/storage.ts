import type { Ticket, RaffleStats } from '../types';

const STORAGE_KEY = 'prewedding_raffle_tickets';

export const initializeTickets = (): Ticket[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      // Migrate old data format if needed
      return parsed.map((ticket: any) => ({
        ...ticket,
        status: ticket.status || (ticket.taken ? 'taken' : 'available'),
        taken: ticket.taken || ticket.status === 'taken',
      }));
    } catch (e) {
      console.error('Failed to parse stored tickets:', e);
    }
  }

  return Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    status: 'available' as const,
    taken: false,
  }));
};

export const saveTickets = (tickets: Ticket[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
};

export const calculateStats = (tickets: Ticket[]): RaffleStats => {
  const totalTickets = tickets.length;
  const takenTickets = tickets.filter(t => t.status === 'taken').length;
  const selectedTickets = tickets.filter(t => t.status === 'selected').length;
  const availableTickets = tickets.filter(t => t.status === 'available').length;
  const percentageTaken = (takenTickets / totalTickets) * 100;
  const percentageSelected = (selectedTickets / totalTickets) * 100;

  return {
    totalTickets,
    takenTickets,
    selectedTickets,
    availableTickets,
    percentageTaken,
    percentageSelected,
  };
};

export const resetTickets = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
