import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { providerApi } from '../api/providerApi';
import { serviceApi } from '../api/serviceApi';
import { reviewApi } from '../api/reviewApi';
import { requestApi } from '../api/requestApi';
import { useAuth } from '../context/AuthContext';
import { StarRating } from '../components/StarRating';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Badge } from '../components/Badge';
import { MapPin, Phone, Mail, Award, Clock, Wrench, PlusCircle, MessageSquare } from 'lucide-react';

export const ProviderDetail = () => {
  const { id } = useParams();
  const [provider, setProvider] = useState(null);
  const [services, setServices] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Request Modal
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [requestData, setRequestData] = useState({
    title: '',
    description: '',
    address: '',
    preferredDate: '',
    preferredTime: 'Morning (9 AM - 12 PM)',
  });
  const [submitting, setSubmitting] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProviderInfo = async () => {
      try {
        const [pRes, sRes, rRes] = await Promise.all([
          providerApi.getById(id),
          serviceApi.getByProvider(id),
          reviewApi.getByProvider(id),
        ]);
        setProvider(pRes.data);
        setServices(sRes.data);
        setReviews(rRes.data);
      } catch (err) {
        console.error("Error loading provider details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProviderInfo();
  }, [id]);

  const openRequestModal = (service = null) => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'CUSTOMER') {
      alert("Only Customers can submit service requests.");
      return;
    }
    setSelectedService(service);
    setRequestData({
      title: service ? `Request for ${service.title}` : `Custom Request for ${provider?.businessName}`,
      description: service ? `I'd like to request ${service.title}. ` : '',
      address: user.address || '',
      preferredDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      preferredTime: 'Morning (9 AM - 12 PM)',
    });
    setRequestModalOpen(true);
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await requestApi.create({
        categoryId: selectedService ? selectedService.categoryId : (services[0]?.categoryId || 1),
        targetProviderId: provider.id,
        title: requestData.title,
        description: requestData.description,
        address: requestData.address,
        preferredDate: requestData.preferredDate,
        preferredTime: requestData.preferredTime,
      });

      alert("Request sent successfully! Provider will send you a quotation.");
      setRequestModalOpen(false);
      navigate('/customer/requests');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;
  if (!provider) return <div className="glass-card text-center p-4">Provider profile not found</div>;

  return (
    <div>
      {/* Provider Header Banner */}
      <div className="glass-card mb-4">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <h1 style={{ fontSize: '2rem' }}>{provider.businessName}</h1>
              <Badge status={provider.status} />
            </div>
            <p style={{ color: 'var(--accent-cyan)', fontWeight: 500, fontSize: '1rem', marginBottom: '0.5rem' }}>
              Operated by {provider.name}
            </p>
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <MapPin size={16} color="var(--accent-primary)" />
                {provider.city || 'Local Region'}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Award size={16} color="var(--accent-amber)" />
                {provider.experienceYears} Years Experience
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Phone size={16} color="var(--accent-emerald)" />
                {provider.phone || 'Contact via request'}
              </span>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ marginBottom: '0.75rem' }}>
              <StarRating rating={provider.rating || 5.0} totalReviews={provider.totalReviews || 0} />
            </div>
            <button onClick={() => openRequestModal()} className="btn btn-primary">
              <PlusCircle size={18} />
              <span>Request Quote directly</span>
            </button>
          </div>
        </div>

        <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)' }}>
          <h4>About Provider</h4>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.4rem', fontSize: '0.95rem' }}>
            {provider.bio || 'No biography provided.'}
          </p>
        </div>
      </div>

      {/* Offered Services */}
      <div className="mb-4">
        <h3 className="mb-2">Services Offered</h3>
        {services.length === 0 ? (
          <div className="glass-card text-center p-3">
            <p style={{ color: 'var(--text-muted)' }}>This provider has not listed specific service packages yet.</p>
          </div>
        ) : (
          <div className="grid-3">
            {services.map((s) => (
              <div key={s.id} className="glass-card flex-between" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                <div>
                  <span className="badge badge-in_progress" style={{ marginBottom: '0.5rem' }}>{s.categoryName}</span>
                  <h4 style={{ fontSize: '1.1rem', margin: '0.5rem 0' }}>{s.title}</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>{s.description}</p>
                </div>
                <div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent-emerald)', marginBottom: '0.75rem' }}>
                    ${s.price} <span style={{ fontSize: '0.75rem', fontWeight: 400, color: 'var(--text-muted)' }}>/{s.priceType}</span>
                  </div>
                  <button onClick={() => openRequestModal(s)} className="btn btn-primary btn-sm" style={{ width: '100%' }}>
                    Request This Service
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Customer Reviews Section */}
      <div>
        <h3 className="mb-2">Customer Reviews & Ratings ({reviews.length})</h3>
        {reviews.length === 0 ? (
          <div className="glass-card text-center p-3">
            <MessageSquare size={32} style={{ color: 'var(--text-muted)', margin: '0 auto 0.5rem' }} />
            <p style={{ color: 'var(--text-muted)' }}>No customer reviews yet. Be the first to complete a booking and leave feedback!</p>
          </div>
        ) : (
          <div className="grid-2">
            {reviews.map((rev) => (
              <div key={rev.id} className="glass-card">
                <div className="flex-between mb-2">
                  <div>
                    <h4 style={{ fontSize: '1rem' }}>{rev.customerName}</h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <StarRating rating={rev.rating} />
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>"{rev.comment}"</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Request Modal */}
      {requestModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h3>Request Service Quote</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              Sending request to <strong>{provider.businessName}</strong>
            </p>

            <form onSubmit={handleRequestSubmit}>
              <div className="form-group">
                <label className="form-label">Request Title</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  value={requestData.title}
                  onChange={(e) => setRequestData({ ...requestData, title: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Address</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  value={requestData.address}
                  onChange={(e) => setRequestData({ ...requestData, address: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Preferred Date</label>
                  <input
                    type="date"
                    className="form-input"
                    required
                    value={requestData.preferredDate}
                    onChange={(e) => setRequestData({ ...requestData, preferredDate: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Preferred Time</label>
                  <select
                    className="form-select"
                    value={requestData.preferredTime}
                    onChange={(e) => setRequestData({ ...requestData, preferredTime: e.target.value })}
                  >
                    <option value="Morning (9 AM - 12 PM)">Morning (9 AM - 12 PM)</option>
                    <option value="Afternoon (12 PM - 4 PM)">Afternoon (12 PM - 4 PM)</option>
                    <option value="Evening (4 PM - 8 PM)">Evening (4 PM - 8 PM)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description & Work Details</label>
                <textarea
                  className="form-textarea"
                  rows="4"
                  required
                  value={requestData.description}
                  onChange={(e) => setRequestData({ ...requestData, description: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setRequestModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
