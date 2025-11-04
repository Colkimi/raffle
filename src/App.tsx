import { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import type { Ticket } from './types';
import { RaffleBoard } from './components/RaffleBoard';
import { AdminLogin } from './components/AdminLogin';
import { AdminPanel } from './components/AdminPanel';
import { AnimatedStatsTicker } from './components/AnimatedStatsTicker';
import { ToastProvider, useToast } from './components/Toast';
import { FindTicketModal } from './components/FindTicketModal';
import { ShareModal } from './components/ShareModal';
import { ThemeProvider, useTheme } from './components/ThemeContext';
import { initializeTickets, saveTickets, calculateStats, resetTickets } from './utils/storage';

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'prewedding2025';

function MainRaffle() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [showFindTicket, setShowFindTicket] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const { showToast } = useToast();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const initialTickets = initializeTickets();
    setTickets(initialTickets);
  }, []);

  useEffect(() => {
    if (tickets.length > 0) {
      saveTickets(tickets);
    }
  }, [tickets]);

  const handleTicketSelect = (ticketId: number, guestName: string, transactionCode?: string) => {
    setTickets(prevTickets =>
      prevTickets.map(ticket =>
        ticket.id === ticketId
          ? {
              ...ticket,
              status: 'selected' as const,
              taken: false,
              selectedBy: guestName,
              selectedAt: new Date().toISOString(),
              transactionCode,
              paymentConfirmed: !!transactionCode, // Auto-confirm if transaction code provided
            }
          : ticket
      )
    );
    
    if (transactionCode) {
      showToast(`Ticket #${ticketId} confirmed! Transaction code: ${transactionCode}`, 'success');
    } else {
      showToast(`Ticket #${ticketId} reserved! Awaiting admin confirmation.`, 'info');
    }
  };

  const stats = calculateStats(tickets);

  return (
    <div className="app">
      <header className="app-header">
        <button className="theme-toggle" onClick={toggleTheme} title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
        <div className="header-actions">
          <button onClick={() => setShowFindTicket(true)} className="btn-find-ticket">
            🔍 Find My Ticket
          </button>
          <button onClick={() => setShowShare(true)} className="btn-share">
            💌 Share & Invite
          </button>
        </div>
        <h1 className="app-title">
          <span className="heart-icon">💙</span>
          Pre-Wedding Raffle
          <span className="heart-icon">💙</span>
        </h1>
        <p className="app-subtitle">Pick your lucky number and join the celebration!</p>
        <div className="stats-bar">
          <span className="stat-item">
            <strong>{stats.availableTickets}</strong> tickets available
          </span>
          <span className="stat-divider">•</span>
          <span className="stat-item">
            <strong>{stats.takenTickets}</strong> already chosen
          </span>
        </div>
      </header>
      <div className="poster-section" style={{width: '65%'}}>
        <img 
          src="/pre-wedding.jpeg" 
          alt="Pre-Wedding Celebration" 
          className="poster-image"
        />
      </div>
      <main className="app-main">
        <AnimatedStatsTicker stats={stats} />
        <RaffleBoard tickets={tickets} onTicketSelect={handleTicketSelect} />
      </main>

      <footer className="app-footer">
        <p>💍 Made with love for your special day 💒</p>
      </footer>

      {showFindTicket && (
        <FindTicketModal tickets={tickets} onClose={() => setShowFindTicket(false)} />
      )}

      {showShare && (
        <ShareModal onClose={() => setShowShare(false)} />
      )}
    </div>
  );
}

function AdminRoute() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [history, setHistory] = useState<Ticket[][]>([]);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    // Check localStorage for existing admin session
    const savedAuth = localStorage.getItem('raffle_admin_auth');
    return savedAuth === 'true';
  });
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    const initialTickets = initializeTickets();
    setTickets(initialTickets);
  }, []);

  useEffect(() => {
    if (tickets.length > 0) {
      saveTickets(tickets);
    }
  }, [tickets]);

  const handleAdminLogin = (username: string, password: string): boolean => {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setIsAdminLoggedIn(true);
      // Persist admin session to localStorage
      localStorage.setItem('raffle_admin_auth', 'true');
      return true;
    }
    return false;
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    // Clear admin session from localStorage
    localStorage.removeItem('raffle_admin_auth');
    navigate('/');
  };

  const handleTicketToggle = (ticketId: number) => {
    // Save current state to history
    setHistory(prev => [...prev.slice(-9), tickets]);
    
    setTickets(prevTickets =>
      prevTickets.map(ticket => {
        if (ticket.id === ticketId) {
          // Cycle through states: available -> selected -> taken -> available
          let newStatus: 'available' | 'selected' | 'taken';
          if (ticket.status === 'available') {
            newStatus = 'selected';
          } else if (ticket.status === 'selected') {
            newStatus = 'taken';
          } else {
            newStatus = 'available';
          }

          return {
            ...ticket,
            status: newStatus,
            taken: newStatus === 'taken',
            selectedBy: newStatus === 'available' ? undefined : ticket.selectedBy || 'Admin',
            selectedAt: newStatus === 'available' ? undefined : ticket.selectedAt || new Date().toISOString(),
            takenBy: newStatus === 'taken' ? ticket.selectedBy || 'Admin' : undefined,
            takenAt: newStatus === 'taken' ? new Date().toISOString() : undefined,
            paymentConfirmed: newStatus === 'taken',
          };
        }
        return ticket;
      })
    );
    showToast('Ticket status updated', 'success');
  };

  const handleUndo = () => {
    if (history.length > 0) {
      const previousState = history[history.length - 1];
      setTickets(previousState);
      setHistory(prev => prev.slice(0, -1));
      showToast('Action undone', 'info');
    }
  };

  const handleReset = () => {
    resetTickets();
    const freshTickets = Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      status: 'available' as const,
      taken: false,
    }));
    setTickets(freshTickets);
  };

  const handleAssignTicket = (ticketId: number, guestName: string, transactionCode?: string) => {
    // Save current state to history for undo
    setHistory(prev => [...prev.slice(-9), tickets]);

    setTickets(prevTickets =>
      prevTickets.map(ticket =>
        ticket.id === ticketId
          ? {
              ...ticket,
              status: 'selected' as const,
              taken: false,
              selectedBy: guestName,
              selectedAt: new Date().toISOString(),
              transactionCode,
              paymentConfirmed: !!transactionCode, // Auto-confirm if transaction code provided
            }
          : ticket
      )
    );
    
    if (transactionCode) {
      showToast(`Ticket #${ticketId} assigned to ${guestName} and confirmed!`, 'success');
    } else {
      showToast(`Ticket #${ticketId} assigned to ${guestName} - awaiting payment confirmation`, 'info');
    }
  };

  const stats = calculateStats(tickets);

  if (!isAdminLoggedIn) {
    return <AdminLogin onLogin={handleAdminLogin} />;
  }

  return (
    <AdminPanel
      tickets={tickets}
      stats={stats}
      onTicketToggle={handleTicketToggle}
      onAssign={handleAssignTicket}
      onLogout={handleAdminLogout}
      onReset={handleReset}
      onUndo={handleUndo}
      canUndo={history.length > 0}
    />
  );
}

function App() {
  return (
    <HashRouter>
      <ThemeProvider>
        <ToastProvider>
          <Routes>
            <Route path="/" element={<MainRaffle />} />
            <Route path="/admin" element={<AdminRoute />} />
          </Routes>
        </ToastProvider>
      </ThemeProvider>
    </HashRouter>
  );
}

export default App;
