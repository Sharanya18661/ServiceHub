import React, { useEffect, useState } from 'react';
import { bookingApi } from '../api/bookingApi';
import { reviewApi } from '../api/reviewApi';
import { Badge } from '../components/Badge';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { StarRating } from '../components/StarRating';
import { CheckCircle, Clock, Play, Phone, MapPin, Calendar, Star } from 'lucide-react';

export const ProviderJobs = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchBookings = async () => {
    try {
      const res = await bookingApi.getProviderBookings();
      setBookings(res.data);
    } catch (err) {
      console.error("Failed to load provider jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleUpdateStatus = async (bookingId, newStatus) => {
    setUpdatingId(bookingId);
    try {
      await bookingApi.updateStatus(bookingId, newStatus);
      await fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update job status');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div>
      <div className="flex-between mb-4">
        <div>
          <h2>Provider Jobs & History</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Manage active client jobs and view completed contracts</p>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="glass-card text-center p-4">
          <Clock size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem' }} />
          <h3>No Jobs Assigned Yet</h3>
          <p style={{ color: 'var(--text-secondary)' }}>When customers accept your submitted quotes, jobs will appear here.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {bookings.map((b) => (
            <div key={b.id} className="glass-card">
              <div className="flex-between mb-2">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                    <h3 style={{ fontSize: '1.2rem' }}>{b.requestTitle}</h3>
                    <Badge status={b.status} />
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    Job ID: #{b.id} • Scheduled Date: <strong>{b.scheduledDate}</strong>
                  </p>
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
                  ${b.finalPrice}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)', margin: '1rem 0' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Clock size={16} color="var(--accent-cyan)" />
                  Client: <strong style={{ color: 'var(--text-primary)' }}>{b.customerName}</strong>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Phone size={16} color="var(--accent-emerald)" />
                  Phone: <strong style={{ color: 'var(--text-primary)' }}>{b.customerPhone}</strong>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <MapPin size={16} color="var(--accent-primary)" />
                  Address: <strong style={{ color: 'var(--text-primary)' }}>{b.customerAddress}</strong>
                </span>
              </div>

              {/* Status Controls */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                {b.status === 'ACCEPTED' && (
                  <button
                    onClick={() => handleUpdateStatus(b.id, 'IN_PROGRESS')}
                    className="btn btn-primary btn-sm"
                    disabled={updatingId === b.id}
                  >
                    <Play size={14} />
                    <span>Start Job (Mark In Progress)</span>
                  </button>
                )}

                {b.status === 'IN_PROGRESS' && (
                  <button
                    onClick={() => handleUpdateStatus(b.id, 'COMPLETED')}
                    className="btn btn-success btn-sm"
                    disabled={updatingId === b.id}
                  >
                    <CheckCircle size={14} />
                    <span>Mark Job Completed</span>
                  </button>
                )}

                {b.status === 'COMPLETED' && (
                  <span className="badge badge-completed">
                    ✓ Job Completed
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
