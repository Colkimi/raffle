import React, { useState } from 'react';

interface ShareModalProps {
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ onClose }) => {
  const [copied, setCopied] = useState(false);
  const raffleUrl = window.location.origin;
  const shareText = `🎉 Join our Pre-Wedding Raffle! Pick your lucky number and be part of our special day! 💍\n\n${raffleUrl}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLinks = {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(raffleUrl)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(raffleUrl)}&text=${encodeURIComponent('Join our Pre-Wedding Raffle! 🎉💍')}`,
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content share-modal" onClick={(e) => e.stopPropagation()}>
        <h2>💌 Share the Raffle</h2>
        <p className="modal-subtitle">Invite friends and family to participate!</p>

        <div className="share-preview">
          <p>{shareText}</p>
        </div>

        <div className="share-buttons">
          <a
            href={shareLinks.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="share-btn whatsapp"
          >
            <span className="share-icon">📱</span>
            WhatsApp
          </a>
          <a
            href={shareLinks.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="share-btn facebook"
          >
            <span className="share-icon">👍</span>
            Facebook
          </a>
          <a
            href={shareLinks.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="share-btn twitter"
          >
            <span className="share-icon">🐦</span>
            Twitter
          </a>
          <a
            href={shareLinks.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="share-btn telegram"
          >
            <span className="share-icon">✈️</span>
            Telegram
          </a>
        </div>

        <div className="copy-section">
          <button onClick={handleCopy} className="btn-copy-link">
            {copied ? '✓ Copied!' : '📋 Copy Link'}
          </button>
        </div>

        <div className="modal-buttons">
          <button onClick={onClose} className="btn-cancel">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
