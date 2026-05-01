import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, LogOut, User, CheckSquare } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="glass" style={{ margin: '1rem 2rem', padding: '0.75rem 2rem', position: 'sticky', top: '1rem', zIndex: 100 }}>
      <div className="flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div style={{ background: 'var(--primary)', color: 'white', padding: '6px', borderRadius: '8px' }}>
            <CheckSquare size={20} />
          </div>
          <span style={{ fontWeight: 700, fontSize: '1.25rem', letterSpacing: '-0.5px' }}>TeamFlow</span>
        </Link>

        <div className="flex items-center gap-8">
          {user ? (
            <>
              <Link to="/" className="flex items-center gap-2 hover-link" style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 500 }}>
                <LayoutDashboard size={18} />
                Dashboard
              </Link>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2" style={{ background: 'rgba(0,0,0,0.03)', padding: '4px 12px', borderRadius: '20px', border: '1px solid var(--border)' }}>
                  <User size={16} style={{ color: 'var(--primary)' }} />
                  <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{user.name}</span>
                  <span style={{ fontSize: '0.7rem', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', padding: '2px 8px', borderRadius: '10px' }}>{user.role}</span>
                </div>
                <button onClick={handleLogout} className="btn-secondary" style={{ padding: '8px', borderRadius: '8px' }}>
                  <LogOut size={18} />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="btn-secondary" style={{ padding: '0.5rem 1rem' }}>Login</Link>
              <Link to="/signup" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>Get Started</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
