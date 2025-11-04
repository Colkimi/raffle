import type { Ticket } from '../types';

export const exportToCSV = (tickets: Ticket[]) => {
  const headers = ['Ticket Number', 'Status', 'Guest Name', 'Selected Date', 'Confirmed Date', 'Transaction Code', 'Payment Confirmed'];
  
  const rows = tickets.map(ticket => [
    ticket.id,
    ticket.status,
    ticket.selectedBy || '',
    ticket.selectedAt ? new Date(ticket.selectedAt).toLocaleString() : '',
    ticket.takenAt ? new Date(ticket.takenAt).toLocaleString() : '',
    ticket.transactionCode || '',
    ticket.paymentConfirmed ? 'Yes' : 'No'
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `raffle-tickets-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const calculateRevenue = (tickets: Ticket[]): number => {
  const takenTickets = tickets.filter(t => t.status === 'taken').length;
  return takenTickets * 50; // KSh 50 per ticket
};
