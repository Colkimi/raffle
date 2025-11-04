import React from 'react';
import type { Ticket } from '../types';

interface AdminConfirmModalProps {
  ticket: Ticket;
  onConfirm: () => void;
  onCancel: () => void;
}

export const AdminConfirmModal: React.FC<AdminConfirmModalProps> = ({ 
  ticket, 
  onConfirm, 
  onCancel 
}) => {
  const getNextStatus = () => {
    if (ticket.status === 'available') return 'selected';
    if (ticket.status === 'selected') return 'taken';
    return 'available';
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'available': return '🎫 Available';
      case 'selected': return '⏳ Selected (Pending)';
      case 'taken': return '💙 Taken (Confirmed)';
      default: return status;
    }
  };

  const getActionMessage = () => {
    if (ticket.status === 'available') {
      return 'Mark this ticket as SELECTED (pending payment)?';
    } else if (ticket.status === 'selected') {
      return 'Confirm payment and mark this ticket as TAKEN?';
    } else {
      return 'Reset this ticket to AVAILABLE?';
    }
  };

  const getActionColor = () => {
    if (ticket.status === 'selected') return 'confirm';
    if (ticket.status === 'taken') return 'warning';
    return 'default';
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content admin-confirm-modal" onClick={(e) => e.stopPropagation()}>
        <h2>🔐 Admin Confirmation</h2>
        
        <div className="confirm-ticket-info">
          <div className="confirm-ticket-number">Ticket #{ticket.id}</div>
          <div className="confirm-status-change">
            <div className="status-box current">
              <span className="status-label">Current:</span>
              <span className="status-value">{getStatusLabel(ticket.status)}</span>
            </div>
            <div className="status-arrow">→</div>
            <div className="status-box next">
              <span className="status-label">Next:</span>
              <span className="status-value">{getStatusLabel(getNextStatus())}</span>
            </div>
          </div>
        </div>

        {ticket.selectedBy && (
          <div className="guest-info">
            <p><strong>Guest:</strong> {ticket.selectedBy}</p>
            {ticket.selectedAt && (
              <p><strong>Selected:</strong> {new Date(ticket.selectedAt).toLocaleString()}</p>
            )}
          </div>
        )}

        <p className="confirm-message">{getActionMessage()}</p>

        <div className="modal-buttons">
          <button 
            onClick={onConfirm} 
            className={`btn-confirm ${getActionColor()}`}
          >
            Yes, Proceed
          </button>
          <button 
            onClick={onCancel} 
            className="btn-cancel"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
