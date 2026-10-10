import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { providerApi } from '../api/providerApi';
import { serviceApi } from '../api/serviceApi';
import { requestApi } from '../api/requestApi';
import { bookingApi } from '../api/bookingApi';
import { useAuth } from '../context/AuthContext';
import { Briefcase, Clock, CheckCircle, AlertCircle, PlusCircle, ArrowRight, DollarSign } from 'lucide-react';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Badge } from '../components/Badge';

export const ProviderDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [services, setServices] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProviderData = async () => {
      try {
        const [profRes, servRes, reqRes, bookRes] = await Promise.all([
          providerApi.getMyProfile(),
          providerApi.getMyProfile().then(p => serviceApi.getByProvider(p.data.id)),
          requestApi.getIncomingForProvider(),
          bookingApi.getProviderBookings(),
        ]);
        setProfile(profRes.data);
        setServices(servRes.data);
        setIncomingRequests(reqRes.data);
        setBookings(bookRes.data);
      } catch (err) {
        console.error("Failed to load provider dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProviderData();
  }, []);

  if (loading) return <LoadingSpinner fullScreen />;

  const activeJobs = bookings.filter(b => b.status === 'ACCEPTED' || b.status === 'IN_PROGRESS');
  const completedJobs = bookings.filter(b => b.status === 'COMPLETED');
  const totalRevenue = completedJobs.reduce((acc, b) => acc + (b.finalPrice || 0), 0);

  return (
    <div>
      <div className="flex-between mb-4">
        <div>
          <h2>Provider Dashboard</h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            {profile?.businessName || user?.name} • Rating: ⭐ {profile?.rating || 5.0} ({profile?.totalReviews || 0} reviews)
          </p>
        </div>
        <Link to="/provider/services" className="btn btn-primary">
          <PlusCircle size={18} />
          <span>Manage Services</span>
        </Link>
      </div>

      {/* Profile Approval Alert Banner */}
      {profile?.status === 'PENDING' && (
        <div style={{ background: 'rgba(245, 158, 11, 0.15)', border: '1px solid var(--accent-amber)', color: '#fbbf24', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <AlertCircle size={24} style={{ flexShrink: 0 }} />
          <div>
            <strong>Approval Pending:</strong> Your provider registration is currently being reviewed by ServiceHub administrators. Once approved, you can submit binding quotations for customer requests.
          </div>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid-4 mb-4">
        <div className="glass-card flex-between">
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Offered Services</span>
            <h2 style={{ fontSize: '2rem', marginTop: '0.2rem' }}>{services.length}</h2>
          </div>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Briefcase color="var(--accent-primary)" size={22} />
          </div>
        </div>

        <div className="glass-card flex-between">
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Incoming Requests</span>
            <h2 style={{ fontSize: '2rem', marginTop: '0.2rem', color: 'var(--accent-cyan)' }}>{incomingRequests.length}</h2>
          </div>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock color="var(--accent-cyan)" size={22} />
          </div>
        </div>

        <div className="glass-card flex-between">
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Active Jobs</span>
            <h2 style={{ fontSize: '2rem', marginTop: '0.2rem', color: 'var(--accent-amber)' }}>{activeJobs.length}</h2>
          </div>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock color="var(--accent-amber)" size={22} />
          </div>
        </div>

        <div className="glass-card flex-between">
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Completed Earnings</span>
            <h2 style={{ fontSize: '2rem', marginTop: '0.2rem', color: 'var(--accent-emerald)' }}>${totalRevenue}</h2>
          </div>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DollarSign color="var(--accent-emerald)" size={22} />
          </div>
        </div>
      </div>

      {/* Incoming Requests Quick Table */}
      <div className="glass-card mb-4">
        <div className="flex-between mb-2">
          <h3>Incoming Service Requests</h3>
          <Link to="/provider/requests" className="btn btn-outline btn-sm">
            <span>View All & Quote</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {incomingRequests.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', padding: '1rem 0' }}>No pending service requests matching your categories.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {incomingRequests.slice(0, 3).map((req) => (
              <div key={req.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(15, 23, 42, 0.6)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div>
                  <h4 style={{ fontSize: '1rem' }}>{req.title}</h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    Customer: {req.customerName} • Location: {req.address}
                  </p>
                </div>
                <Link to="/provider/requests" className="btn btn-primary btn-sm">Send Quote</Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Active Jobs */}
      <div className="glass-card">
        <div className="flex-between mb-2">
          <h3>Jobs Currently In Progress</h3>
          <Link to="/provider/jobs" className="btn btn-outline btn-sm">
            <span>Manage Jobs</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {activeJobs.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', padding: '1rem 0' }}>No active jobs assigned at the moment.</p>
        ) : (
          <div className="grid-2">
            {activeJobs.map((j) => (
              <div key={j.id} style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <div className="flex-between mb-2">
                  <h4>{j.requestTitle}</h4>
                  <Badge status={j.status} />
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Customer: <strong>{j.customerName}</strong> ({j.customerPhone})
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                  <span style={{ fontWeight: 700, color: 'var(--accent-emerald)' }}>${j.finalPrice}</span>
                  <Link to="/provider/jobs" className="btn btn-secondary btn-sm">Update Job Status</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
