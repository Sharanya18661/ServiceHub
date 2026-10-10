import React, { useEffect, useState } from 'react';
import { requestApi } from '../api/requestApi';
import { quoteApi } from '../api/quoteApi';
import { Badge } from '../components/Badge';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { StarRating } from '../components/StarRating';
import { FileText, CheckCircle, XCircle, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CustomerRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRequestId, setExpandedRequestId] = useState(null);
  const [quotesMap, setQuotesMap] = useState({});
  const [actionLoading, setActionLoading] = useState(false);
  const navigate = useNavigate();

  const fetchRequests = async () => {
    try {
      const res = await requestApi.getMyRequests();
      setRequests(res.data);
    } catch (err) {
      console.error("Failed to load requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const toggleExpand = async (requestId) => {
    if (expandedRequestId === requestId) {
      setExpandedRequestId(null);
      return;
    }

    setExpandedRequestId(requestId);
    if (!quotesMap[requestId]) {
      try {
        const res = await quoteApi.getByRequest(requestId);
        setQuotesMap((prev) => ({ ...prev, [requestId]: res.data }));
      } catch (err) {
        console.error("Failed to load quotes for request:", err);
      }
    }
  };

  const handleAcceptQuote = async (quotationId) => {
    if (!window.confirm("Are you sure you want to accept this quotation? This will create a confirmed booking.")) return;

    setActionLoading(true);
    try {
      await quoteApi.accept(quotationId);
      alert("Quotation accepted! Booking created successfully.");
      await fetchRequests();
      navigate('/customer/bookings');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to accept quotation');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectQuote = async (quotationId, requestId) => {
    setActionLoading(true);
    try {
      await quoteApi.reject(quotationId);
      // Refresh quotes for this request
      const res = await quoteApi.getByRequest(requestId);
      setQuotesMap((prev) => ({ ...prev, [requestId]: res.data }));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reject quotation');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelRequest = async (requestId) => {
    if (!window.confirm("Are you sure you want to cancel this request?")) return;
    try {
      await requestApi.cancel(requestId);
      await fetchRequests();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel request');
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div>
      <div className="flex-between mb-4">
        <div>
          <h2>My Service Requests & Quotations</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Review quotes submitted by providers and accept jobs</p>
        </div>
      </div>

      {requests.length === 0 ? (
        <div className="glass-card text-center p-4">
          <FileText size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem' }} />
          <h3>No Requests Submitted Yet</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Browse services and submit your first request.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {requests.map((req) => {
            const isExpanded = expandedRequestId === req.id;
            const quotes = quotesMap[req.id] || [];

            return (
              <div key={req.id} className="glass-card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
                      <h3 style={{ fontSize: '1.2rem' }}>{req.title}</h3>
                      <Badge status={req.status} />
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                      {req.description}
                    </p>
                    <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      <span>Category: <strong style={{ color: 'var(--text-primary)' }}>{req.categoryName}</strong></span>
                      <span>Address: <strong style={{ color: 'var(--text-primary)' }}>{req.address}</strong></span>
                      <span>Preferred Date: <strong style={{ color: 'var(--text-primary)' }}>{req.preferredDate} ({req.preferredTime})</strong></span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {req.status === 'REQUESTED' || req.status === 'QUOTATION_SENT' ? (
                      <button
                        onClick={() => handleCancelRequest(req.id)}
                        className="btn btn-secondary btn-sm"
                        style={{ color: 'var(--accent-rose)' }}
                      >
                        Cancel Request
                      </button>
                    ) : null}

                    <button
                      onClick={() => toggleExpand(req.id)}
                      className="btn btn-outline btn-sm"
                    >
                      <span>View Quotes ({quotes.length})</span>
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                </div>

                {/* Quotations Accordion Content */}
                {isExpanded && (
                  <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)' }}>
                    <h4 style={{ marginBottom: '1rem', color: 'var(--accent-cyan)' }}>Submitted Provider Quotations</h4>

                    {quotes.length === 0 ? (
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>
                        No quotes submitted by providers for this request yet. Check back soon!
                      </p>
                    ) : (
                      <div className="grid-2">
                        {quotes.map((q) => (
                          <div key={q.id} style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                            <div className="flex-between mb-2">
                              <div>
                                <h4 style={{ fontSize: '1.05rem' }}>{q.providerBusinessName}</h4>
                                <StarRating rating={q.providerRating || 5.0} />
                              </div>
                              <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
                                ${q.estimatedPrice}
                              </span>
                            </div>

                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: '0.75rem 0' }}>
                              "{q.message || 'Standard quote according to request specifications.'}"
                            </p>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                              <Badge status={q.status} />

                              {q.status === 'PENDING' && req.status !== 'ACCEPTED' && (
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                  <button
                                    onClick={() => handleRejectQuote(q.id, req.id)}
                                    className="btn btn-danger btn-sm"
                                    disabled={actionLoading}
                                  >
                                    <XCircle size={14} />
                                    <span>Reject</span>
                                  </button>
                                  <button
                                    onClick={() => handleAcceptQuote(q.id)}
                                    className="btn btn-success btn-sm"
                                    disabled={actionLoading}
                                  >
                                    <CheckCircle size={14} />
                                    <span>Accept Quote</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
