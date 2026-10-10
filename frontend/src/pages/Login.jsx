import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, AlertCircle, User, Briefcase, Shield, CheckCircle } from 'lucide-react';

export const Login = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') || 'CUSTOMER';

  const [activeRole, setActiveRole] = useState(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const isExpired = searchParams.get('expired') === 'true';

  // Preset demo accounts
  const demoAccounts = {
    CUSTOMER: { email: 'customer.alice@gmail.com', password: 'Customer@123', label: 'Demo Customer (Alice)' },
    PROVIDER: { email: 'pro.john@servicehub.com', password: 'Provider@123', label: 'Demo Provider (John)' },
    ADMIN: { email: 'admin@servicehub.com', password: 'Admin@12345', label: 'Demo Admin' },
  };

  const handleRoleTabChange = (role) => {
    setActiveRole(role);
    // Autofill demo account for convenience if fields are empty or set to previous demo
    const demo = demoAccounts[role];
    if (demo) {
      setEmail(demo.email);
      setPassword(demo.password);
    }
  };

  const handleFillDemo = (role) => {
    setActiveRole(role);
    const demo = demoAccounts[role];
    if (demo) {
      setEmail(demo.email);
      setPassword(demo.password);
    }
  };

  const extractErrorMessage = (err, defaultMsg) => {
    if (err.response?.data) {
      const data = err.response.data;
      if (data.message) return data.message;
      if (data.errors && typeof data.errors === 'object') {
        const messages = Object.values(data.errors);
        if (messages.length > 0) return messages.join('. ');
      }
      if (typeof data === 'string') return data;
    }
    if (err.message && err.message !== 'Network Error') {
      return err.message;
    }
    if (err.message === 'Network Error' || !err.response) {
      return 'Unable to connect to backend server. Please check your network connection or CORS configuration.';
    }
    return defaultMsg;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login({ email, password });
      if (res.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else if (res.role === 'PROVIDER') {
        navigate('/provider/dashboard');
      } else {
        navigate('/customer/dashboard');
      }
    } catch (err) {
      setError(extractErrorMessage(err, 'Invalid email or password'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '2rem 0' }}>
      <div className="glass-card" style={{ maxWidth: '480px', width: '100%', padding: '2.5rem' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '0.4rem' }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Select your account type to sign in to ServiceHub
          </p>
        </div>

        {/* Role Selection Tabs */}
        <div style={{ display: 'flex', background: 'rgba(15, 23, 42, 0.8)', padding: '0.35rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid var(--border-color)' }}>
          <button
            type="button"
            style={{
              flex: 1,
              padding: '0.65rem 0.5rem',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem',
              background: activeRole === 'CUSTOMER' ? 'var(--gradient-primary)' : 'transparent',
              color: activeRole === 'CUSTOMER' ? '#fff' : 'var(--text-secondary)',
              transition: 'all 0.2s',
            }}
            onClick={() => handleRoleTabChange('CUSTOMER')}
          >
            <User size={15} />
            <span>Customer</span>
          </button>

          <button
            type="button"
            style={{
              flex: 1,
              padding: '0.65rem 0.5rem',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem',
              background: activeRole === 'PROVIDER' ? 'var(--gradient-primary)' : 'transparent',
              color: activeRole === 'PROVIDER' ? '#fff' : 'var(--text-secondary)',
              transition: 'all 0.2s',
            }}
            onClick={() => handleRoleTabChange('PROVIDER')}
          >
            <Briefcase size={15} />
            <span>Provider</span>
          </button>

          <button
            type="button"
            style={{
              flex: 1,
              padding: '0.65rem 0.5rem',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem',
              background: activeRole === 'ADMIN' ? 'var(--gradient-primary)' : 'transparent',
              color: activeRole === 'ADMIN' ? '#fff' : 'var(--text-secondary)',
              transition: 'all 0.2s',
            }}
            onClick={() => handleRoleTabChange('ADMIN')}
          >
            <Shield size={15} />
            <span>Admin</span>
          </button>
        </div>

        {/* Selected Account Role Banner */}
        <div style={{
          background: 'rgba(99, 102, 241, 0.1)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          borderRadius: '8px',
          padding: '0.6rem 0.9rem',
          fontSize: '0.85rem',
          color: 'var(--accent-cyan)',
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <span>Signing in as: <strong>{activeRole} ACCOUNT</strong></span>
          <span className={`badge badge-${activeRole.toLowerCase()}`}>{activeRole}</span>
        </div>

        {isExpired && (
          <div style={{ background: 'rgba(245, 158, 11, 0.15)', border: '1px solid var(--accent-amber)', color: '#fbbf24', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={16} />
            <span>Your session expired. Please log in again.</span>
          </div>
        )}

        {error && (
          <div style={{ background: 'rgba(244, 63, 94, 0.15)', border: '1px solid var(--accent-rose)', color: '#f87171', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">{activeRole === 'ADMIN' ? 'Admin Email' : activeRole === 'PROVIDER' ? 'Provider Email' : 'Customer Email'}</label>
            <input
              type="email"
              className="form-input"
              required
              placeholder={demoAccounts[activeRole]?.email || "user@example.com"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.75rem' }} disabled={loading}>
            <LogIn size={18} />
            <span>{loading ? 'Authenticating...' : `Sign In as ${activeRole}`}</span>
          </button>
        </form>

        {/* Quick Demo Credentials Section */}
        <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Quick Demo Accounts (Click to Fill)
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => handleFillDemo('CUSTOMER')}
              className="btn btn-secondary btn-sm"
              style={{ justifyContent: 'space-between', width: '100%', fontSize: '0.82rem' }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <User size={14} color="var(--accent-cyan)" />
                <strong>Customer:</strong> customer.alice@gmail.com
              </span>
              <span style={{ color: 'var(--text-muted)' }}>Customer@123</span>
            </button>

            <button
              type="button"
              onClick={() => handleFillDemo('PROVIDER')}
              className="btn btn-secondary btn-sm"
              style={{ justifyContent: 'space-between', width: '100%', fontSize: '0.82rem' }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Briefcase size={14} color="var(--accent-amber)" />
                <strong>Provider:</strong> pro.john@servicehub.com
              </span>
              <span style={{ color: 'var(--text-muted)' }}>Provider@123</span>
            </button>

            <button
              type="button"
              onClick={() => handleFillDemo('ADMIN')}
              className="btn btn-secondary btn-sm"
              style={{ justifyContent: 'space-between', width: '100%', fontSize: '0.82rem' }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Shield size={14} color="var(--accent-emerald)" />
                <strong>Admin:</strong> admin@servicehub.com
              </span>
              <span style={{ color: 'var(--text-muted)' }}>Admin@12345</span>
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Don't have an account?{' '}
          <Link to={`/register?role=${activeRole}`} style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>
            Register Now
          </Link>
        </div>
      </div>
    </div>
  );
};
