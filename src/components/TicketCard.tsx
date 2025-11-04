import React from 'react';
import type { Ticket } from '../types';

interface TicketCardProps {
  ticket: Ticket;
  onSelect: (ticketId: number) => void;
  isAdmin?: boolean;
}

export const TicketCard: React.FC<TicketCardProps> = ({ ticket, onSelect, isAdmin = false }) => {
  const handleClick = () => {
    if (ticket.status === 'available' || isAdmin) {
      onSelect(ticket.id);
    }
  };

  const getStatusIcon = () => {
    switch (ticket.status) {
      case 'selected':
        return '⏳';
      case 'taken':
        return '💙';
      default:
        return null;
    }
  };

  const getStatusClass = () => {
    return `ticket-card ${ticket.status} ${isAdmin ? 'admin-mode' : ''}`;
  };

  const getTooltip = () => {
    if (ticket.status === 'taken') {
      return `Taken by: ${ticket.takenBy || 'Guest'}`;
    } else if (ticket.status === 'selected') {
      return `Selected by: ${ticket.selectedBy || 'Guest'} - Pending payment`;
    }
    return 'Click to select';
  };

  return (
    <div
      onClick={handleClick}
      className={getStatusClass()}
      title={getTooltip()}
    >
      <div className="ticket-number">{ticket.id}</div>
      {ticket.status !== 'available' && (
        <div className="ticket-status">
          <span className="status-icon">{getStatusIcon()}</span>
        </div>
      )}
    </div>
  );
};
