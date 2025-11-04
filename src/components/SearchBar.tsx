import React from 'react';
import type { TicketStatus } from '../types';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  statusFilter: TicketStatus | 'all';
  onStatusFilterChange: (status: TicketStatus | 'all') => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}) => {
  return (
    <div className="search-bar">
      <div className="search-input-container">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="search-input"
          placeholder="Search ticket number..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchTerm && (
          <button
            className="clear-search"
            onClick={() => onSearchChange('')}
            title="Clear search"
          >
            ✕
          </button>
        )}
      </div>
      
      <div className="filter-buttons">
        <button
          className={`filter-btn ${statusFilter === 'all' ? 'active' : ''}`}
          onClick={() => onStatusFilterChange('all')}
        >
          All
        </button>
        <button
          className={`filter-btn ${statusFilter === 'available' ? 'active' : ''}`}
          onClick={() => onStatusFilterChange('available')}
        >
          Available
        </button>
        <button
          className={`filter-btn ${statusFilter === 'selected' ? 'active' : ''}`}
          onClick={() => onStatusFilterChange('selected')}
        >
          Pending
        </button>
        <button
          className={`filter-btn ${statusFilter === 'taken' ? 'active' : ''}`}
          onClick={() => onStatusFilterChange('taken')}
        >
          Taken
        </button>
      </div>
    </div>
  );
};
