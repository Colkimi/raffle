import React, { useState, useEffect } from 'react';
import type { RaffleStats } from '../types';

interface AnimatedStatsTickerProps {
  stats: RaffleStats;
}

export const AnimatedStatsTicker: React.FC<AnimatedStatsTickerProps> = ({ stats }) => {
  const [displayStats, setDisplayStats] = useState(stats);
  const [recentActivity, setRecentActivity] = useState<string[]>([]);

  useEffect(() => {
    // Animate number changes
    const animateNumbers = (start: number, end: number, setter: (val: number) => void) => {
      const duration = 500;
      const steps = 20;
      const increment = (end - start) / steps;
      let current = start;
      let step = 0;

      const timer = setInterval(() => {
        step++;
        current += increment;
        if (step >= steps) {
          setter(end);
          clearInterval(timer);
        } else {
          setter(Math.round(current));
        }
      }, duration / steps);
    };

    animateNumbers(displayStats.takenTickets, stats.takenTickets, (val) => {
      setDisplayStats(prev => ({ ...prev, takenTickets: val }));
    });

    animateNumbers(displayStats.availableTickets, stats.availableTickets, (val) => {
      setDisplayStats(prev => ({ ...prev, availableTickets: val }));
    });

    // Add activity message
    if (stats.takenTickets > displayStats.takenTickets) {
      const newTickets = stats.takenTickets - displayStats.takenTickets;
      setRecentActivity(prev => [
        `🎉 ${newTickets} new ticket${newTickets > 1 ? 's' : ''} claimed!`,
        ...prev.slice(0, 4)
      ]);
    }
  }, [stats.takenTickets, stats.availableTickets]);

  return (
    <div className="stats-ticker-container">
      <div className="stats-ticker">
        <div className="ticker-item">
          <div className="ticker-icon">🎫</div>
          <div className="ticker-content">
            <div className="ticker-value">{displayStats.availableTickets}</div>
            <div className="ticker-label">Available</div>
          </div>
        </div>
        
        <div className="ticker-item">
          <div className="ticker-icon">⏳</div>
          <div className="ticker-content">
            <div className="ticker-value">{stats.selectedTickets}</div>
            <div className="ticker-label">Pending</div>
          </div>
        </div>
        
        <div className="ticker-item">
          <div className="ticker-icon">💙</div>
          <div className="ticker-content">
            <div className="ticker-value">{displayStats.takenTickets}</div>
            <div className="ticker-label">Confirmed</div>
          </div>
        </div>
        
        <div className="ticker-item">
          <div className="ticker-icon">📊</div>
          <div className="ticker-content">
            <div className="ticker-value">{stats.percentageTaken.toFixed(0)}%</div>
            <div className="ticker-label">Complete</div>
          </div>
        </div>
    
      </div>
      
      {recentActivity.length > 0 && (
        <div className="activity-scroll">
          <div className="activity-content">
            {recentActivity.map((activity, idx) => (
              <div key={idx} className="activity-item">
                {activity}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
