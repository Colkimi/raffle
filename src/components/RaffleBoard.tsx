import React, { useState } from 'react';
import type { Ticket, TicketStatus } from '../types';
import { TicketCard } from './TicketCard';
import { GuestModal } from './GuestModal';
import { PaymentModal } from './PaymentModal';
import { Confetti } from './Confetti';
import { SearchBar } from './SearchBar';

interface RaffleBoardProps {
  tickets: Ticket[];
  onTicketSelect: (ticketId: number, guestName: string, transactionCode?: string) => void;
  isAdmin?: boolean;
}

export const RaffleBoard: React.FC<RaffleBoardProps> = ({ tickets, onTicketSelect, isAdmin = false }) => {
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
  const [guestName, setGuestName] = useState<string>('');
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'all'>('all');

  // Filter tickets based on search and status
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = searchTerm === '' || ticket.id.toString().includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleTicketClick = (ticketId: number) => {
    const ticket = tickets.find(t => t.id === ticketId);
    
    if (isAdmin) {
      // Admin can toggle tickets
      onTicketSelect(ticketId, 'Admin');
      return;
    }

    if (ticket && ticket.status === 'available') {
      setSelectedTicketId(ticketId);
      setShowGuestModal(true);
    }
  };

  const handleGuestConfirm = (name: string) => {
    setGuestName(name);
    setShowGuestModal(false);
    setShowPaymentModal(true);
  };

  const handlePaymentComplete = (transactionCode?: string) => {
    if (selectedTicketId !== null) {
      onTicketSelect(selectedTicketId, guestName, transactionCode);
      setShowPaymentModal(false);
      setSelectedTicketId(null);
      setGuestName('');
      
      // Show confetti celebration
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  const handleCancel = () => {
    setShowGuestModal(false);
    setShowPaymentModal(false);
    setSelectedTicketId(null);
    setGuestName('');
  };

  return (
    <div className="raffle-board">
      <Confetti show={showConfetti} />
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />
      <div className="tickets-grid">
        {filteredTickets.map(ticket => (
          <TicketCard
            key={ticket.id}
            ticket={ticket}
            onSelect={handleTicketClick}
            isAdmin={isAdmin}
          />
        ))}
      </div>
      {filteredTickets.length === 0 && (
        <div className="no-results">
          <p>🔍 No tickets found matching your search</p>
        </div>
      )}
      {showGuestModal && selectedTicketId !== null && (
        <GuestModal
          ticketNumber={selectedTicketId}
          onConfirm={handleGuestConfirm}
          onCancel={handleCancel}
        />
      )}
      {showPaymentModal && selectedTicketId !== null && (
        <PaymentModal
          ticketNumber={selectedTicketId}
          guestName={guestName}
          onComplete={handlePaymentComplete}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};
