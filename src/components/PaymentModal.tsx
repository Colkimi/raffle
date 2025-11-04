import React, { useState } from 'react';

interface PaymentModalProps {
  ticketNumber: number;
  guestName: string;
  onComplete: (transactionCode?: string) => void;
  onCancel: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ 
  ticketNumber, 
  guestName,
  onComplete, 
  onCancel 
}) => {
  const [copied, setCopied] = useState(false);
  const [transactionCode, setTransactionCode] = useState('');
  const mpesaNumber = '0742472756'; 
  const amount = '50'; 

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content payment-modal" onClick={(e) => e.stopPropagation()}>
        <div className="payment-header">
          <h2>🎉 Ticket Reserved!</h2>
          <p className="payment-subtitle">Ticket #{ticketNumber} for {guestName}</p>
        </div>

        <div className="payment-body">
          <div className="payment-step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>Open M-Pesa</h3>
              <p>Go to M-Pesa on your phone</p>
            </div>
          </div>

          <div className="payment-step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>Select Send Money</h3>
              <p>Choose "Send Money" or "Lipa na M-Pesa"</p>
            </div>
          </div>

          <div className="payment-step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>Enter Details</h3>
              <div className="payment-details">
                <div className="detail-item">
                  <span className="detail-label">Phone Number:</span>
                  <div className="detail-value-container">
                    <span className="detail-value">{mpesaNumber}</span>
                    <button 
                      className="copy-btn"
                      onClick={() => handleCopy(mpesaNumber)}
                      title="Copy number"
                    >
                      {copied ? '✓' : '📋'}
                    </button>
                  </div>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Amount:</span>
                  <div className="detail-value-container">
                    <span className="detail-value">KSh {amount}</span>
                    <button 
                      className="copy-btn"
                      onClick={() => handleCopy(amount)}
                      title="Copy amount"
                    >
                      {copied ? '✓' : '📋'}
                    </button>
                  </div>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Reference:</span>
                  <div className="detail-value-container">
                    <span className="detail-value">Ticket {ticketNumber}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="payment-step">
            <div className="step-number">4</div>
            <div className="step-content">
              <h3>Complete Payment</h3>
              <p>Enter your M-Pesa PIN and send</p>
            </div>
          </div>

          <div className="payment-notice">
            <p>⚠️ <strong>Important:</strong> Your ticket is reserved for 24 hours. An admin will confirm your payment shortly.</p>
          </div>

          <div className="transaction-code-section">
            <h3>Optional: Speed up confirmation</h3>
            <p className="transaction-help">Enter your M-Pesa transaction code (e.g., SH12XYZABC) to get instant confirmation:</p>
            <input
              type="text"
              className="transaction-input"
              placeholder="Enter M-Pesa code (optional)"
              value={transactionCode}
              onChange={(e) => setTransactionCode(e.target.value.toUpperCase())}
              maxLength={15}
            />
          </div>
        </div>

        <div className="modal-buttons">
          <button 
            type="button" 
            onClick={() => onComplete(transactionCode || undefined)} 
            className="btn-confirm"
          >
            {transactionCode ? 'Submit Payment Code 🚀' : "I've Sent Payment 💸"}
          </button>
          <button 
            type="button" 
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
