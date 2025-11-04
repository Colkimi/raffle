import React, { useState } from 'react';
import type { Ticket, RaffleStats } from '../types';
import { RaffleBoard } from './RaffleBoard';
import { AdminConfirmModal } from './AdminConfirmModal';
import { exportToCSV, calculateRevenue } from '../utils/export';
import { useToast } from './Toast';

interface AdminPanelProps {
  tickets: Ticket[];
  stats: RaffleStats;
  onTicketToggle: (ticketId: number) => void;
  onLogout: () => void;
  onReset: () => void;
  onUndo?: () => void;
  canUndo?: boolean;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  tickets,
  stats,
  onTicketToggle,
  onLogout,
  onReset,
  onUndo,
  canUndo = false,
}) => {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [bulkMode, setBulkMode] = useState(false);
  const [selectedTickets, setSelectedTickets] = useState<Set<number>>(new Set());
  const { showToast } = useToast();

  const revenue = calculateRevenue(tickets);

  const pendingPayments = tickets
    .filter(t => t.status === 'selected')
    .sort((a, b) => {
      if (!a.selectedAt || !b.selectedAt) return 0;
      return new Date(b.selectedAt).getTime() - new Date(a.selectedAt).getTime();
    });

  const recentlyTaken = tickets
    .filter(t => t.status === 'taken')
    .sort((a, b) => {
      if (!a.takenAt || !b.takenAt) return 0;
      return new Date(b.takenAt).getTime() - new Date(a.takenAt).getTime();
    })
    .slice(0, 10);

  const handleTicketClick = (ticketId: number) => {
    const ticket = tickets.find(t => t.id === ticketId);
    if (ticket) {
      setSelectedTicket(ticket);
      setShowConfirmModal(true);
    }
  };

  const handleConfirmToggle = () => {
    if (selectedTicket) {
      onTicketToggle(selectedTicket.id);
      setShowConfirmModal(false);
      setSelectedTicket(null);
    }
  };

  const handleCancelToggle = () => {
    setShowConfirmModal(false);
    setSelectedTicket(null);
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all tickets? This cannot be undone!')) {
      onReset();
      showToast('All tickets have been reset', 'success');
    }
  };

  const handleExport = () => {
    exportToCSV(tickets);
    showToast('CSV file downloaded successfully!', 'success');
  };

  const handleBulkAction = (action: 'available' | 'taken') => {
    if (selectedTickets.size === 0) {
      showToast('Please select tickets first', 'warning');
      return;
    }
    
    const message = `Are you sure you want to mark ${selectedTickets.size} ticket(s) as ${action}?`;
    if (window.confirm(message)) {
      selectedTickets.forEach(ticketId => {
        onTicketToggle(ticketId);
      });
      setSelectedTickets(new Set());
      setBulkMode(false);
      showToast(`${selectedTickets.size} tickets updated`, 'success');
    }
  };

  const toggleBulkSelection = (ticketId: number) => {
    const newSelection = new Set(selectedTickets);
    if (newSelection.has(ticketId)) {
      newSelection.delete(ticketId);
    } else {
      newSelection.add(ticketId);
    }
    setSelectedTickets(newSelection);
  };

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>💍 Admin Dashboard</h1>
        <div className="admin-actions">
          {canUndo && onUndo && (
            <button onClick={onUndo} className="btn-undo" title="Undo last action">
              ↶ Undo
            </button>
          )}
          <button onClick={() => setBulkMode(!bulkMode)} className="btn-bulk">
            {bulkMode ? '✓ Done' : '☑ Bulk Mode'}
          </button>
          <button onClick={handleExport} className="btn-export">
            📥 Export CSV
          </button>
          <button onClick={handleReset} className="btn-reset">
            Reset All
          </button>
          <button onClick={onLogout} className="btn-logout">
            Logout
          </button>
        </div>
      </div>

      {bulkMode && selectedTickets.size > 0 && (
        <div className="bulk-actions-bar">
          <span>{selectedTickets.size} ticket(s) selected</span>
          <div>
            <button onClick={() => handleBulkAction('available')} className="btn-bulk-action">
              Mark as Available
            </button>
            <button onClick={() => handleBulkAction('taken')} className="btn-bulk-action">
              Mark as Taken
            </button>
            <button onClick={() => setSelectedTickets(new Set())} className="btn-bulk-cancel">
              Clear Selection
            </button>
          </div>
        </div>
      )}

      <div className="stats-grid">
        <div className="stat-card revenue">
          <div className="stat-value">KSh {revenue.toLocaleString()}</div>
          <div className="stat-label">Total Revenue</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.totalTickets}</div>
          <div className="stat-label">Total Tickets</div>
        </div>
        <div className="stat-card pending">
          <div className="stat-value">{stats.selectedTickets}</div>
          <div className="stat-label">Pending Payment</div>
        </div>
        <div className="stat-card taken">
          <div className="stat-value">{stats.takenTickets}</div>
          <div className="stat-label">Confirmed</div>
        </div>
        <div className="stat-card available">
          <div className="stat-value">{stats.availableTickets}</div>
          <div className="stat-label">Available</div>
        </div>
        <div className="stat-card percentage">
          <div className="stat-value">{stats.percentageTaken.toFixed(1)}%</div>
          <div className="stat-label">Completed</div>
        </div>
      </div>

      {pendingPayments.length > 0 && (
        <div className="admin-section pending-section">
          <h2>⏳ Pending Payments ({pendingPayments.length})</h2>
          <p className="section-description">Click on a ticket to confirm payment and mark as taken</p>
          <div className="pending-tickets-grid">
            {pendingPayments.map(ticket => (
              <div 
                key={ticket.id} 
                className={`pending-ticket-card ${bulkMode ? 'bulk-mode' : ''} ${selectedTickets.has(ticket.id) ? 'selected' : ''}`}
                onClick={() => bulkMode ? toggleBulkSelection(ticket.id) : handleTicketClick(ticket.id)}
              >
                {bulkMode && (
                  <div className="bulk-checkbox">
                    {selectedTickets.has(ticket.id) ? '✓' : ''}
                  </div>
                )}
                <div className="pending-ticket-number">#{ticket.id}</div>
                <div className="pending-ticket-info">
                  <div className="pending-guest">{ticket.selectedBy}</div>
                  {ticket.transactionCode && (
                    <div className="transaction-code">
                      <span className="code-label">Code:</span> {ticket.transactionCode}
                    </div>
                  )}
                  <div className="pending-time">
                    {ticket.selectedAt ? new Date(ticket.selectedAt).toLocaleString() : '-'}
                  </div>
                </div>
                {!bulkMode && <button className="btn-confirm-payment">Confirm ✓</button>}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="admin-section">
        <h2>✅ Confirmed Tickets</h2>
        <div className="recent-tickets">
          {recentlyTaken.length === 0 ? (
            <p className="no-data">No confirmed tickets yet</p>
          ) : (
            <table className="tickets-table">
              <thead>
                <tr>
                  <th>Ticket #</th>
                  <th>Guest Name</th>
                  <th>Confirmed At</th>
                </tr>
              </thead>
              <tbody>
                {recentlyTaken.map(ticket => (
                  <tr key={ticket.id}>
                    <td>#{ticket.id}</td>
                    <td>{ticket.takenBy || ticket.selectedBy || 'Guest'}</td>
                    <td>
                      {ticket.takenAt
                        ? new Date(ticket.takenAt).toLocaleString()
                        : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="admin-section">
        <h2>Manage All Tickets</h2>
        <p className="section-description">Click tickets to cycle: Available → Selected → Taken → Available</p>
        <RaffleBoard
          tickets={tickets}
          onTicketSelect={handleTicketClick}
          isAdmin={true}
        />
      </div>

      {showConfirmModal && selectedTicket && (
        <AdminConfirmModal
          ticket={selectedTicket}
          onConfirm={handleConfirmToggle}
          onCancel={handleCancelToggle}
        />
      )}
    </div>
  );
};
