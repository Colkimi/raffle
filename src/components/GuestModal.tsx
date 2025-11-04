import React, { useState } from 'react';

interface GuestModalProps {
  ticketNumber: number;
  onConfirm: (guestName: string) => void;
  onCancel: () => void;
}

export const GuestModal: React.FC<GuestModalProps> = ({ ticketNumber, onConfirm, onCancel }) => {
  const [guestName, setGuestName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (guestName.trim()) {
      onConfirm(guestName.trim());
    }
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>🎟️ Ticket #{ticketNumber}</h2>
        <p className="modal-description">Please enter your name to claim this ticket</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            placeholder="Your name"
            autoFocus
            className="guest-input"
          />
          <div className="modal-buttons">
            <button type="submit" className="btn-confirm" disabled={!guestName.trim()}>
              Confirm 💖
            </button>
            <button type="button" onClick={onCancel} className="btn-cancel">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
