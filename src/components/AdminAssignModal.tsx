import React, { useState } from 'react';
import type { Ticket } from '../types';

interface AdminAssignModalProps {
  ticket: Ticket;
  onAssign: (guestName: string, transactionCode?: string) => void;
  onCancel: () => void;
}

export const AdminAssignModal: React.FC<AdminAssignModalProps> = ({ ticket, onAssign, onCancel }) => {
  const [guestName, setGuestName] = useState('');
  const [transactionCode, setTransactionCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;
    onAssign(guestName.trim(), transactionCode.trim() || undefined);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal assign-modal">
        <h3>Assign Ticket #{ticket.id}</h3>
        <form onSubmit={handleSubmit} className="assign-form">
          <label>
            Guest Name
            <input
              type="text"
              value={guestName}
              onChange={e => setGuestName(e.target.value)}
              placeholder="Enter guest name"
              required
            />
          </label>

          <label>
            Transaction Code (optional)
            <input
              type="text"
              value={transactionCode}
              onChange={e => setTransactionCode(e.target.value)}
              placeholder="MPESA code (optional)"
            />
          </label>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn-confirm">
              Assign & Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminAssignModal;
