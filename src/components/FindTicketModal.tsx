import React, { useState } from 'react';
import type { Ticket } from '../types';

interface FindTicketModalProps {
  tickets: Ticket[];
  onClose: () => void;
}

export const FindTicketModal: React.FC<FindTicketModalProps> = ({ tickets, onClose }) => {
  const [searchName, setSearchName] = useState('');
  const [foundTickets, setFoundTickets] = useState<Ticket[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    if (!searchName.trim()) return;
    
    const results = tickets.filter(
      ticket => ticket.selectedBy?.toLowerCase().includes(searchName.toLowerCase())
    );
    setFoundTickets(results);
    setHasSearched(true);
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'available':
        return { text: 'Available', color: '#4caf50', icon: '✓' };
      case 'selected':
        return { text: 'Pending Payment', color: '#ffc107', icon: '⏳' };
      case 'taken':
        return { text: 'Confirmed', color: '#2196f3', icon: '✅' };
      default:
        return { text: 'Unknown', color: '#999', icon: '?' };
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content find-ticket-modal" onClick={(e) => e.stopPropagation()}>
        <h2>🔍 Find My Ticket</h2>
        <p className="modal-subtitle">Enter your name to find your ticket(s)</p>

        <div className="search-section">
          <input
            type="text"
            className="name-search-input"
            placeholder="Enter your name..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            autoFocus
          />
          <button onClick={handleSearch} className="btn-search">
            Search
          </button>
        </div>

        {hasSearched && (
          <div className="search-results">
            {foundTickets.length > 0 ? (
              <div className="found-tickets">
                <h3>Found {foundTickets.length} ticket(s):</h3>
                {foundTickets.map(ticket => {
                  const status = getStatusDisplay(ticket.status);
                  return (
                    <div key={ticket.id} className="found-ticket-card">
                      <div className="found-ticket-number">#{ticket.id}</div>
                      <div className="found-ticket-details">
                        <div className="found-ticket-name">{ticket.selectedBy}</div>
                        <div className="found-ticket-status" style={{ color: status.color }}>
                          {status.icon} {status.text}
                        </div>
                        {ticket.selectedAt && (
                          <div className="found-ticket-date">
                            Selected: {new Date(ticket.selectedAt).toLocaleDateString()}
                          </div>
                        )}
                        {ticket.status === 'selected' && (
                          <div className="payment-reminder">
                            ⚠️ Payment confirmation pending
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="no-tickets-found">
                <p>😔 No tickets found for "{searchName}"</p>
                <p className="hint">Make sure you entered the same name used during selection</p>
              </div>
            )}
          </div>
        )}

        <div className="modal-buttons">
          <button onClick={onClose} className="btn-cancel">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
