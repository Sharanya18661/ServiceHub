import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { requestApi } from '../api/requestApi';
import { bookingApi } from '../api/bookingApi';
import { complaintApi } from '../api/complaintApi';
import { useAuth } from '../context/AuthContext';
import { FileText, Calendar, ShieldAlert, ArrowRight, PlusCircle, CheckCircle, Clock } from 'lucide-react';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Badge } from '../components/Badge';

export const CustomerDashboard = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reqRes, bookRes] = await Promise.all([
          requestApi.getMyRequests(),
          bookingApi.getMyBookings(),
        ]);
        setRequests(reqRes.data);
        setBookings(bookRes.data);
      } catch (err) {
        console.error("Failed to load customer dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner fullScreen />;

  const activeBookings = bookings.filter(b => b.status === 'ACCEPTED' || b.status === 'IN_PROGRESS');

  return (
    <div>
      <div className="flex-between mb-4">
        <div>
          <h2>Customer Dashboard</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Welcome back, {user?.name}</p>
        </div>
        <Link to="/services" className="btn btn-primary">
          <PlusCircle size={18} />
          <span>Request New Service</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid-3 mb-4">
        <div className="glass-card flex-between">
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total Service Requests</span>
            <h2 style={{ fontSize: '2.2rem', marginTop: '0.2rem' }}>{requests.length}</h2>
          </div>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileText color="var(--accent-primary)" size={24} />
          </div>
        </div>

        <div className="glass-card flex-between">
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Active Jobs / Bookings</span>
            <h2 style={{ fontSize: '2.2rem', marginTop: '0.2rem', color: 'var(--accent-cyan)' }}>{activeBookings.length}</h2>
          </div>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(6, 182, 212, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock color="var(--accent-cyan)" size={24} />
          </div>
        </div>

        <div className="glass-card flex-between">
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Completed Bookings</span>
            <h2 style={{ fontSize: '2.2rem', marginTop: '0.2rem', color: 'var(--accent-emerald)' }}>
              {bookings.filter(b => b.status === 'COMPLETED').length}
            </h2>
          </div>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle color="var(--accent-emerald)" size={24} />
          </div>
        </div>
      </div>

      {/* Recent Requests Section */}
      <div className="glass-card mb-4">
        <div className="flex-between mb-2">
          <h3>Recent Service Requests & Quotes</h3>
          <Link to="/customer/requests" className="btn btn-outline btn-sm">
            <span>Manage All Requests</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {requests.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', padding: '1rem 0' }}>No service requests created yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {requests.slice(0, 4).map((req) => (
              <div key={req.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(15, 23, 42, 0.6)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div>
                  <h4 style={{ fontSize: '1rem' }}>{req.title}</h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    Category: {req.categoryName} • Preferred Date: {req.preferredDate}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <Badge status={req.status} />
                  <Link to="/customer/requests" className="btn btn-secondary btn-sm">View Details</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Active Bookings Section */}
      <div className="glass-card">
        <div className="flex-between mb-2">
          <h3>Active Bookings & Trackers</h3>
          <Link to="/customer/bookings" className="btn btn-outline btn-sm">
            <span>View All Bookings</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {activeBookings.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', padding: '1rem 0' }}>No active bookings currently in progress.</p>
        ) : (
          <div className="grid-2">
            {activeBookings.map((b) => (
              <div key={b.id} style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <div className="flex-between mb-2">
                  <h4>{b.requestTitle}</h4>
                  <Badge status={b.status} />
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  Provider: <strong>{b.providerBusinessName}</strong> ({b.providerPhone})
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                  <span style={{ fontWeight: 700, color: 'var(--accent-emerald)' }}>${b.finalPrice}</span>
                  <Link to="/customer/bookings" className="btn btn-primary btn-sm">Track Progress</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
