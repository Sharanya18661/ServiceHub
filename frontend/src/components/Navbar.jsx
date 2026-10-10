import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Wrench, User, LogOut, LayoutDashboard, Briefcase, FileText, ShieldAlert, Calendar, Star } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo">
          <Wrench className="w-7 h-7 text-indigo-400" size={28} />
          <span>ServiceHub</span>
        </Link>

        <ul className="nav-links">
          <li>
            <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/services" className={`nav-link ${isActive('/services') ? 'active' : ''}`}>
              Browse Services
            </Link>
          </li>

          {user && user.role === 'CUSTOMER' && (
            <>
              <li>
                <Link to="/customer/dashboard" className={`nav-link ${isActive('/customer/dashboard') ? 'active' : ''}`}>
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/customer/requests" className={`nav-link ${isActive('/customer/requests') ? 'active' : ''}`}>
                  My Requests
                </Link>
              </li>
              <li>
                <Link to="/customer/bookings" className={`nav-link ${isActive('/customer/bookings') ? 'active' : ''}`}>
                  Bookings
                </Link>
              </li>
            </>
          )}

          {user && user.role === 'PROVIDER' && (
            <>
              <li>
                <Link to="/provider/dashboard" className={`nav-link ${isActive('/provider/dashboard') ? 'active' : ''}`}>
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/provider/services" className={`nav-link ${isActive('/provider/services') ? 'active' : ''}`}>
                  My Services
                </Link>
              </li>
              <li>
                <Link to="/provider/requests" className={`nav-link ${isActive('/provider/requests') ? 'active' : ''}`}>
                  Incoming Requests
                </Link>
              </li>
              <li>
                <Link to="/provider/jobs" className={`nav-link ${isActive('/provider/jobs') ? 'active' : ''}`}>
                  Jobs & History
                </Link>
              </li>
            </>
          )}

          {user && user.role === 'ADMIN' && (
            <li>
              <Link to="/admin/dashboard" className={`nav-link ${isActive('/admin/dashboard') ? 'active' : ''}`}>
                Admin Portal
              </Link>
            </li>
          )}
        </ul>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                  {user.role?.toLowerCase()}
                </div>
              </div>
              <button onClick={handleLogout} className="btn btn-secondary btn-sm" title="Logout">
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
