import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, AlertCircle, CheckCircle } from 'lucide-react';

export const Register = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'PROVIDER' ? 'PROVIDER' : 'CUSTOMER';

  const [role, setRole] = useState(initialRole);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    businessName: '',
    bio: '',
    experienceYears: 2,
    city: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = { ...formData, role };
      const res = await register(payload);

      if (res.role === 'PROVIDER') {
        navigate('/provider/dashboard');
      } else {
        navigate('/customer/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '2rem 0' }}>
      <div className="glass-card" style={{ maxWidth: '520px', width: '100%', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Create Your Account</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Join ServiceHub to book or offer local services</p>
        </div>

        {/* Role Toggle Selector */}
        <div style={{ display: 'flex', background: 'rgba(15, 23, 42, 0.8)', padding: '0.35rem', borderRadius: '10px', marginBottom: '1.75rem', border: '1px solid var(--border-color)' }}>
          <button
            type="button"
            style={{
              flex: 1,
              padding: '0.65rem',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer',
              background: role === 'CUSTOMER' ? 'var(--gradient-primary)' : 'transparent',
              color: role === 'CUSTOMER' ? '#fff' : 'var(--text-secondary)',
              transition: 'all 0.2s',
            }}
            onClick={() => setRole('CUSTOMER')}
          >
            I am a Customer
          </button>
          <button
            type="button"
            style={{
              flex: 1,
              padding: '0.65rem',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer',
              background: role === 'PROVIDER' ? 'var(--gradient-primary)' : 'transparent',
              color: role === 'PROVIDER' ? '#fff' : 'var(--text-secondary)',
              transition: 'all 0.2s',
            }}
            onClick={() => setRole('PROVIDER')}
          >
            I am a Service Provider
          </button>
        </div>

        {error && (
          <div style={{ background: 'rgba(244, 63, 94, 0.15)', border: '1px solid var(--accent-rose)', color: '#f87171', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input type="text" name="name" className="form-input" required placeholder="John Doe" value={formData.name} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" name="email" className="form-input" required placeholder="john@example.com" value={formData.email} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label className="form-label">Password (min 6 chars)</label>
            <input type="password" name="password" className="form-input" required minLength={6} placeholder="••••••••" value={formData.password} onChange={handleChange} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input type="text" name="phone" className="form-input" placeholder="+1-555-0199" value={formData.phone} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">City / Region</label>
              <input type="text" name="city" className="form-input" placeholder="New York" value={formData.city} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Address</label>
            <input type="text" name="address" className="form-input" placeholder="123 Main St, Apt 4" value={formData.address} onChange={handleChange} />
          </div>

          {role === 'PROVIDER' && (
            <div style={{ background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.2)', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.25rem' }}>
              <h4 style={{ color: 'var(--accent-cyan)', marginBottom: '1rem', fontSize: '0.95rem' }}>Provider Business Details</h4>

              <div className="form-group">
                <label className="form-label">Business / Agency Name</label>
                <input type="text" name="businessName" className="form-input" required placeholder="Apex Repairs & Plumbing" value={formData.businessName} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label className="form-label">Experience (Years)</label>
                <input type="number" name="experienceYears" min="0" max="50" className="form-input" value={formData.experienceYears} onChange={handleChange} />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Short Bio / Specialty</label>
                <textarea name="bio" rows="3" className="form-textarea" placeholder="Licensed master plumber specializing in bathroom installations and emergency leaks." value={formData.bio} onChange={handleChange} />
              </div>
            </div>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
            <UserPlus size={18} />
            <span>{loading ? 'Creating Account...' : `Register as ${role === 'PROVIDER' ? 'Provider' : 'Customer'}`}</span>
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Already registered?{' '}
          <Link to="/login" style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};
