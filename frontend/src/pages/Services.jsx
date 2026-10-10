import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { serviceApi } from '../api/serviceApi';
import { categoryApi } from '../api/categoryApi';
import { requestApi } from '../api/requestApi';
import { useAuth } from '../context/AuthContext';
import { Search, Filter, Wrench, CheckCircle, AlertCircle, PlusCircle, User, Calendar, MapPin } from 'lucide-react';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const Services = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('categoryId') || '';

  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [search, setSearch] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // Service Request Modal
  const [selectedService, setSelectedService] = useState(null);
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [requestData, setRequestData] = useState({
    title: '',
    description: '',
    address: '',
    preferredDate: '',
    preferredTime: 'Morning (9 AM - 12 PM)',
  });
  const [submitting, setSubmitting] = useState(false);
  const [modalMessage, setModalMessage] = useState({ type: '', text: '' });

  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await serviceApi.search({
        categoryId: selectedCategory || null,
        search: search || null,
        minPrice: minPrice || null,
        maxPrice: maxPrice || null,
      });
      setServices(res.data);
    } catch (err) {
      console.error("Error fetching services:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const catRes = await categoryApi.getAll();
        setCategories(catRes.data);
      } catch (err) {
        console.error("Error loading categories:", err);
      }
    };
    fetchCats();
  }, []);

  useEffect(() => {
    fetchServices();
  }, [selectedCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchServices();
  };

  const openRequestModal = (service) => {
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
      title: `Request for ${service.title}`,
      description: `Hello, I would like to request ${service.title}. `,
      address: user.address || '',
      preferredDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      preferredTime: 'Morning (9 AM - 12 PM)',
    });
    setModalMessage({ type: '', text: '' });
    setRequestModalOpen(true);
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setModalMessage({ type: '', text: '' });

    try {
      await requestApi.create({
        categoryId: selectedService.categoryId,
        targetProviderId: selectedService.providerId,
        title: requestData.title,
        description: requestData.description,
        address: requestData.address,
        preferredDate: requestData.preferredDate,
        preferredTime: requestData.preferredTime,
      });

      setModalMessage({ type: 'success', text: 'Service request submitted successfully! Providers will send quotations.' });
      setTimeout(() => {
        setRequestModalOpen(false);
        navigate('/customer/requests');
      }, 1500);
    } catch (err) {
      setModalMessage({ type: 'error', text: err.response?.data?.message || 'Failed to submit request' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex-between mb-4">
        <div>
          <h2>Browse Available Services</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Find qualified local professionals and request transparent estimates</p>
        </div>
      </div>

      {/* Filter Bar */}
      <form onSubmit={handleSearchSubmit} className="glass-card mb-4" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'flex-end' }}>
          <div>
            <label className="form-label">Search Keywords</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Plumbing, Leak, AC repair..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div>
            <label className="form-label">Category</label>
            <select
              className="form-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">Min Price ($)</label>
            <input
              type="number"
              className="form-input"
              placeholder="0"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
          </div>

          <div>
            <label className="form-label">Max Price ($)</label>
            <input
              type="number"
              className="form-input"
              placeholder="1000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>

          <div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              <Filter size={18} />
              <span>Apply Filters</span>
            </button>
          </div>
        </div>
      </form>

      {/* Services Grid */}
      {loading ? (
        <LoadingSpinner />
      ) : services.length === 0 ? (
        <div className="glass-card text-center" style={{ padding: '3rem' }}>
          <Wrench size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem' }} />
          <h3>No Services Found</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Try adjusting your search criteria or category selection.</p>
        </div>
      ) : (
        <div className="grid-3">
          {services.map((service) => (
            <div key={service.id} className="glass-card flex-between" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span className="badge badge-in_progress">{service.categoryName}</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
                    ${service.price} <span style={{ fontSize: '0.75rem', fontWeight: 400, color: 'var(--text-muted)' }}>/{service.priceType}</span>
                  </span>
                </div>

                <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>{service.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '1rem', minHeight: '40px' }}>
                  {service.description}
                </p>

                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                  Provided by: <strong style={{ color: 'var(--text-primary)' }}>{service.businessName}</strong>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => openRequestModal(service)}
                  className="btn btn-primary btn-sm"
                  style={{ flex: 1 }}
                >
                  <PlusCircle size={16} />
                  <span>Request Quote</span>
                </button>
                <button
                  onClick={() => navigate(`/providers/${service.providerId}`)}
                  className="btn btn-secondary btn-sm"
                >
                  View Provider
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Service Request Modal */}
      {requestModalOpen && selectedService && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h3 style={{ marginBottom: '0.5rem' }}>Request Service Quote</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              Submitting request to <strong>{selectedService.businessName}</strong> for <em>{selectedService.title}</em>
            </p>

            {modalMessage.text && (
              <div style={{
                padding: '0.75rem',
                borderRadius: '8px',
                fontSize: '0.85rem',
                marginBottom: '1rem',
                background: modalMessage.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
                color: modalMessage.type === 'success' ? '#34d399' : '#f87171',
                border: `1px solid ${modalMessage.type === 'success' ? 'var(--accent-emerald)' : 'var(--accent-rose)'}`
              }}>
                {modalMessage.text}
              </div>
            )}

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
                <label className="form-label">Service Location / Address</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  placeholder="Street address, city"
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
                <label className="form-label">Problem Description & Details</label>
                <textarea
                  className="form-textarea"
                  rows="4"
                  required
                  placeholder="Describe the issue, work scope, or special instructions..."
                  value={requestData.description}
                  onChange={(e) => setRequestData({ ...requestData, description: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setRequestModalOpen(false)}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Service Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
