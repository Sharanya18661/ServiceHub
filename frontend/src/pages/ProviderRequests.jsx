import React, { useEffect, useState } from 'react';
import { requestApi } from '../api/requestApi';
import { quoteApi } from '../api/quoteApi';
import { providerApi } from '../api/providerApi';
import { Badge } from '../components/Badge';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Clock, Send, CheckCircle, MapPin, Calendar, User } from 'lucide-react';

export const ProviderRequests = () => {
  const [requests, setRequests] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Quote Modal State
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [quoteData, setQuoteData] = useState({
    estimatedPrice: '',
    message: '',
    validUntil: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchRequests = async () => {
    try {
      const [pRes, reqRes] = await Promise.all([
        providerApi.getMyProfile(),
        requestApi.getIncomingForProvider(),
      ]);
      setProfile(pRes.data);
      setRequests(reqRes.data);
    } catch (err) {
      console.error("Failed to load incoming requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const openQuoteModal = (request) => {
    if (profile?.status !== 'APPROVED') {
      alert("Your provider account is currently PENDING admin approval. You cannot submit binding quotations until approved.");
      return;
    }
    setSelectedRequest(request);
    setQuoteData({
      estimatedPrice: '100.00',
      message: 'We can handle this job efficiently on your preferred date with full warranty.',
      validUntil: request.preferredDate || new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
    });
    setQuoteModalOpen(true);
  };

  const handleQuoteSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await quoteApi.create({
        serviceRequestId: selectedRequest.id,
        estimatedPrice: quoteData.estimatedPrice,
        message: quoteData.message,
        validUntil: quoteData.validUntil,
      });

      alert("Quotation submitted to customer!");
      setQuoteModalOpen(false);
      await fetchRequests();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit quotation');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div>
      <div className="flex-between mb-4">
        <div>
          <h2>Incoming Customer Service Requests</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Review client requests and send competitive price quotes</p>
        </div>
      </div>

      {requests.length === 0 ? (
        <div className="glass-card text-center p-4">
          <Clock size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem' }} />
          <h3>No Open Requests</h3>
          <p style={{ color: 'var(--text-secondary)' }}>There are no open customer requests matching your services at this time.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {requests.map((req) => (
            <div key={req.id} className="glass-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.2rem' }}>{req.title}</h3>
                    <Badge status={req.status} />
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                    {req.description}
                  </p>

                  <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.88rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <User size={15} color="var(--accent-cyan)" />
                      Client: <strong style={{ color: 'var(--text-primary)' }}>{req.customerName}</strong>
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <MapPin size={15} color="var(--accent-primary)" />
                      Address: <strong style={{ color: 'var(--text-primary)' }}>{req.address}</strong>
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Calendar size={15} color="var(--accent-emerald)" />
                      Preferred: <strong style={{ color: 'var(--text-primary)' }}>{req.preferredDate} ({req.preferredTime})</strong>
                    </span>
                  </div>
                </div>

                <div>
                  <button
                    onClick={() => openQuoteModal(req)}
                    className="btn btn-primary"
                    disabled={req.status === 'ACCEPTED' || req.status === 'COMPLETED'}
                  >
                    <Send size={16} />
                    <span>Submit Price Quote</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quote Submission Modal */}
      {quoteModalOpen && selectedRequest && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h3>Submit Price Quotation</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              For request: <strong>{selectedRequest.title}</strong> by client {selectedRequest.customerName}
            </p>

            <form onSubmit={handleQuoteSubmit}>
              <div className="form-group">
                <label className="form-label">Estimated Total Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  className="form-input"
                  required
                  value={quoteData.estimatedPrice}
                  onChange={(e) => setQuoteData({ ...quoteData, estimatedPrice: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Quote Validity Date</label>
                <input
                  type="date"
                  className="form-input"
                  required
                  value={quoteData.validUntil}
                  onChange={(e) => setQuoteData({ ...quoteData, validUntil: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Quotation Message & Scope Notes</label>
                <textarea
                  className="form-textarea"
                  rows="4"
                  required
                  placeholder="Include work breakdown, estimated duration, materials included..."
                  value={quoteData.message}
                  onChange={(e) => setQuoteData({ ...quoteData, message: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setQuoteModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Sending...' : 'Send Quotation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
