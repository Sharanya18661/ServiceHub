import React, { useEffect, useState } from 'react';
import { providerApi } from '../api/providerApi';
import { serviceApi } from '../api/serviceApi';
import { categoryApi } from '../api/categoryApi';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { PlusCircle, Edit, Trash2, Briefcase, CheckCircle } from 'lucide-react';

export const ProviderServices = () => {
  const [profile, setProfile] = useState(null);
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [formData, setFormData] = useState({
    categoryId: '',
    title: '',
    description: '',
    price: '',
    priceType: 'Fixed',
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      const pRes = await providerApi.getMyProfile();
      setProfile(pRes.data);
      const [sRes, cRes] = await Promise.all([
        serviceApi.getByProvider(pRes.data.id),
        categoryApi.getAll(),
      ]);
      setServices(sRes.data);
      setCategories(cRes.data);
      if (cRes.data.length > 0 && !formData.categoryId) {
        setFormData(prev => ({ ...prev, categoryId: cRes.data[0].id }));
      }
    } catch (err) {
      console.error("Failed to load provider services:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = () => {
    setEditingServiceId(null);
    setFormData({
      categoryId: categories[0]?.id || '',
      title: '',
      description: '',
      price: '',
      priceType: 'Fixed',
    });
    setModalOpen(true);
  };

  const openEditModal = (service) => {
    setEditingServiceId(service.id);
    setFormData({
      categoryId: service.categoryId,
      title: service.title,
      description: service.description,
      price: service.price,
      priceType: service.priceType || 'Fixed',
    });
    setModalOpen(true);
  };

  const handleDelete = async (serviceId) => {
    if (!window.confirm("Are you sure you want to remove this service listing?")) return;
    try {
      await serviceApi.delete(serviceId);
      await fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete service');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingServiceId) {
        await serviceApi.update(editingServiceId, formData);
      } else {
        await serviceApi.create(formData);
      }
      setModalOpen(false);
      await fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save service');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div>
      <div className="flex-between mb-4">
        <div>
          <h2>Manage My Offered Services</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Add or update service packages visible to prospective clients</p>
        </div>
        <button onClick={openAddModal} className="btn btn-primary">
          <PlusCircle size={18} />
          <span>Add New Service Package</span>
        </button>
      </div>

      {services.length === 0 ? (
        <div className="glass-card text-center p-4">
          <Briefcase size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem' }} />
          <h3>No Services Listed</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Create your first service package to attract clients.</p>
          <button onClick={openAddModal} className="btn btn-primary">Add Service</button>
        </div>
      ) : (
        <div className="grid-3">
          {services.map((s) => (
            <div key={s.id} className="glass-card flex-between" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
              <div>
                <span className="badge badge-in_progress" style={{ marginBottom: '0.5rem' }}>{s.categoryName}</span>
                <h3 style={{ fontSize: '1.15rem', margin: '0.5rem 0' }}>{s.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '1rem' }}>{s.description}</p>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-emerald)', marginBottom: '1rem' }}>
                  ${s.price} <span style={{ fontSize: '0.75rem', fontWeight: 400, color: 'var(--text-muted)' }}>/{s.priceType}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                <button onClick={() => openEditModal(s)} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
                  <Edit size={14} />
                  <span>Edit</span>
                </button>
                <button onClick={() => handleDelete(s.id)} className="btn btn-danger btn-sm">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Service Modal */}
      {modalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h3>{editingServiceId ? 'Edit Service Package' : 'Create New Service Package'}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              Define the price and work scope for your service offering
            </p>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  required
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Service Title</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  placeholder="e.g. Master Drain Unblocking & Sanitization"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    className="form-input"
                    required
                    placeholder="99.00"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Pricing Type</label>
                  <select
                    className="form-select"
                    value={formData.priceType}
                    onChange={(e) => setFormData({ ...formData, priceType: e.target.value })}
                  >
                    <option value="Fixed">Fixed Rate</option>
                    <option value="Per Hour">Per Hour</option>
                    <option value="Starting From">Starting From</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Detailed Description</label>
                <textarea
                  className="form-textarea"
                  rows="4"
                  required
                  placeholder="Describe included tools, work guarantees, parts replacement terms..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Saving...' : (editingServiceId ? 'Update Service' : 'Create Service')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
