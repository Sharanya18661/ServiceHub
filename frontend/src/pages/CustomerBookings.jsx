import React, { useEffect, useState } from 'react';
import { bookingApi } from '../api/bookingApi';
import { reviewApi } from '../api/reviewApi';
import { complaintApi } from '../api/complaintApi';
import { Badge } from '../components/Badge';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { StarRating } from '../components/StarRating';
import { Calendar, CheckCircle, Clock, Star, AlertTriangle, Phone, MapPin, User } from 'lucide-react';

export const CustomerBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Review Modal State
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedBookingForReview, setSelectedBookingForReview] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  // Complaint Modal State
  const [complaintModalOpen, setComplaintModalOpen] = useState(false);
  const [selectedBookingForComplaint, setSelectedBookingForComplaint] = useState(null);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [complaintSubmitting, setComplaintSubmitting] = useState(false);

  const fetchBookings = async () => {
    try {
      const res = await bookingApi.getMyBookings();
      setBookings(res.data);
    } catch (err) {
      console.error("Failed to load customer bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const openReviewModal = (booking) => {
    setSelectedBookingForReview(booking);
    setRating(5);
    setComment('');
    setReviewModalOpen(true);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewSubmitting(true);
    try {
      await reviewApi.create({
        bookingId: selectedBookingForReview.id,
        rating,
        comment,
      });
      alert("Thank you! Your rating and review have been submitted.");
      setReviewModalOpen(false);
      await fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setReviewSubmitting(false);
    }
  };

  const openComplaintModal = (booking) => {
    setSelectedBookingForComplaint(booking);
    setSubject(`Issue with Booking #${booking.id} - ${booking.requestTitle}`);
    setDescription('');
    setComplaintModalOpen(true);
  };

  const handleComplaintSubmit = async (e) => {
    e.preventDefault();
    setComplaintSubmitting(true);
    try {
      await complaintApi.create({
        bookingId: selectedBookingForComplaint?.id,
        subject,
        description,
      });
      alert("Complaint submitted to ServiceHub Support. An admin will review it shortly.");
      setComplaintModalOpen(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit complaint');
    } finally {
      setComplaintSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div>
      <div className="flex-between mb-4">
        <div>
          <h2>Booking History & Tracker</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Track active jobs, review completed work, or file support inquiries</p>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="glass-card text-center p-4">
          <Calendar size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem' }} />
          <h3>No Bookings Found</h3>
          <p style={{ color: 'var(--text-secondary)' }}>You don't have any accepted bookings yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {bookings.map((b) => {
            return (
              <div key={b.id} className="glass-card">
                <div className="flex-between mb-2">
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                      <h3 style={{ fontSize: '1.2rem' }}>{b.requestTitle}</h3>
                      <Badge status={b.status} />
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                      Booking ID: #{b.id} • Scheduled Date: <strong>{b.scheduledDate}</strong>
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
                      ${b.finalPrice}
                    </div>
                  </div>
                </div>

                {/* Progress Tracker Bar */}
                <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '1rem', borderRadius: '10px', margin: '1rem 0', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase' }}>
                    Job Progress Tracker
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                    <div style={{ flex: 1, textAlign: 'center', color: '#34d399', fontWeight: 600, fontSize: '0.85rem' }}>
                      ✓ Accepted
                    </div>
                    <div style={{ flex: 1, textAlign: 'center', color: b.status === 'IN_PROGRESS' || b.status === 'COMPLETED' ? '#22d3ee' : 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem' }}>
                      {b.status === 'IN_PROGRESS' || b.status === 'COMPLETED' ? '✓ In Progress' : '○ Pending Start'}
                    </div>
                    <div style={{ flex: 1, textAlign: 'center', color: b.status === 'COMPLETED' ? '#34d399' : 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem' }}>
                      {b.status === 'COMPLETED' ? '✓ Completed' : '○ Finish'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                  <div>
                    Provider: <strong style={{ color: 'var(--text-primary)' }}>{b.providerBusinessName}</strong>
                  </div>
                  <div>
                    Phone: <strong style={{ color: 'var(--text-primary)' }}>{b.providerPhone}</strong>
                  </div>
                  <div>
                    Address: <strong style={{ color: 'var(--text-primary)' }}>{b.customerAddress}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                  <button
                    onClick={() => openComplaintModal(b)}
                    className="btn btn-secondary btn-sm"
                    style={{ color: 'var(--accent-rose)' }}
                  >
                    <AlertTriangle size={14} />
                    <span>Report Issue</span>
                  </button>

                  {b.status === 'COMPLETED' && !b.reviewed && (
                    <button
                      onClick={() => openReviewModal(b)}
                      className="btn btn-primary btn-sm"
                    >
                      <Star size={14} />
                      <span>Leave Rating & Review</span>
                    </button>
                  )}

                  {b.status === 'COMPLETED' && b.reviewed && (
                    <span className="badge badge-accepted" style={{ textTransform: 'none' }}>
                      ✓ Reviewed
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Review Modal */}
      {reviewModalOpen && selectedBookingForReview && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h3>Rate & Review Service</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              For <strong>{selectedBookingForReview.providerBusinessName}</strong> on <em>{selectedBookingForReview.requestTitle}</em>
            </p>

            <form onSubmit={handleReviewSubmit}>
              <div className="form-group" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <label className="form-label" style={{ marginBottom: '0.75rem' }}>Your Star Rating</label>
                <StarRating
                  rating={rating}
                  interactive
                  onRatingChange={(newStar) => setRating(newStar)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Written Feedback / Comment</label>
                <textarea
                  className="form-textarea"
                  rows="4"
                  required
                  placeholder="Share your experience regarding punctuality, quality of work, cleanliness..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setReviewModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={reviewSubmitting}>
                  {reviewSubmitting ? 'Submitting...' : 'Post Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Complaint Modal */}
      {complaintModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h3>Submit Support Complaint</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              File a complaint for review by ServiceHub administrators
            </p>

            <form onSubmit={handleComplaintSubmit}>
              <div className="form-group">
                <label className="form-label">Subject</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Detailed Description of Issue</label>
                <textarea
                  className="form-textarea"
                  rows="4"
                  required
                  placeholder="Explain what went wrong, delay details, damage, or unfulfilled promises..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setComplaintModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-danger" disabled={complaintSubmitting}>
                  {complaintSubmitting ? 'Submitting...' : 'Submit Complaint'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
