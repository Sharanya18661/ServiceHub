import React, { useEffect, useState } from 'react';
import { adminApi } from '../api/adminApi';
import { providerApi } from '../api/providerApi';
import { categoryApi } from '../api/categoryApi';
import { bookingApi } from '../api/bookingApi';
import { complaintApi } from '../api/complaintApi';
import { Badge } from '../components/Badge';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Users, Briefcase, FileText, Calendar, AlertTriangle, CheckCircle, XCircle, PlusCircle, Edit, Trash2, ShieldCheck, ToggleLeft, ToggleRight } from 'lucide-react';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('approvals'); // approvals | categories | users | bookings | complaints
  const [loading, setLoading] = useState(true);

  // Tab Data States
  const [pendingProviders, setPendingProviders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [complaints, setComplaints] = useState([]);

  // Category Modal State
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({ name: '', description: '', icon: 'Wrench', imageUrl: '' });

  // Complaint Resolution Modal State
  const [complaintModalOpen, setComplaintModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [resolutionNote, setResolutionNote] = useState('');
  const [resolutionStatus, setResolutionStatus] = useState('RESOLVED');

  const fetchDashboardData = async () => {
    try {
      const [statsRes, pendingRes, catRes, userRes, bookRes, compRes] = await Promise.all([
        adminApi.getStats(),
        providerApi.getPending(),
        categoryApi.getAll(),
        adminApi.getAllUsers(),
        bookingApi.getAllBookings(),
        complaintApi.getAll(),
      ]);

      setStats(statsRes.data);
      setPendingProviders(pendingRes.data);
      setCategories(catRes.data);
      setUsers(userRes.data);
      setBookings(bookRes.data);
      setComplaints(compRes.data);
    } catch (err) {
      console.error("Failed to load admin dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Provider Approval Handler
  const handleApproveRejectProvider = async (providerId, status) => {
    try {
      await providerApi.updateStatus(providerId, status);
      await fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed');
    }
  };

  // User Enable/Disable Handler
  const handleToggleUserStatus = async (userId) => {
    try {
      await adminApi.toggleUserStatus(userId);
      await fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to toggle user status');
    }
  };

  // Category Save Handler
  const handleSaveCategory = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await categoryApi.update(editingCategory.id, categoryForm);
      } else {
        await categoryApi.create(categoryForm);
      }
      setCategoryModalOpen(false);
      await fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save category');
    }
  };

  // Category Delete Handler
  const handleDeleteCategory = async (catId) => {
    if (!window.confirm("Are you sure you want to delete this service category?")) return;
    try {
      await categoryApi.delete(catId);
      await fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete category');
    }
  };

  // Complaint Resolution Handler
  const handleResolveComplaint = async (e) => {
    e.preventDefault();
    try {
      await complaintApi.resolve(selectedComplaint.id, resolutionStatus, resolutionNote);
      setComplaintModalOpen(false);
      await fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to resolve complaint');
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div>
      <div className="flex-between mb-4">
        <div>
          <h2>Admin Control Center</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Platform metrics, provider verification, categories & dispute management</p>
        </div>
      </div>

      {/* Admin Stats Header Cards */}
      <div className="grid-3 mb-4">
        <div className="glass-card flex-between">
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Registered Customers / Providers</span>
            <h2 style={{ fontSize: '1.8rem', marginTop: '0.2rem' }}>
              {stats?.totalCustomers || 0} / {stats?.totalProviders || 0}
            </h2>
          </div>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users color="var(--accent-primary)" size={22} />
          </div>
        </div>

        <div className="glass-card flex-between">
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Pending Provider Approvals</span>
            <h2 style={{ fontSize: '1.8rem', marginTop: '0.2rem', color: 'var(--accent-amber)' }}>
              {stats?.pendingProviders || 0}
            </h2>
          </div>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck color="var(--accent-amber)" size={22} />
          </div>
        </div>

        <div className="glass-card flex-between">
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total Requests / Bookings</span>
            <h2 style={{ fontSize: '1.8rem', marginTop: '0.2rem', color: 'var(--accent-emerald)' }}>
              {stats?.totalServiceRequests || 0} / {stats?.totalBookings || 0}
            </h2>
          </div>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Calendar color="var(--accent-emerald)" size={22} />
          </div>
        </div>
      </div>

      {/* Tab Navigation Controls */}
      <div style={{ display: 'flex', gap: '0.75rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        <button
          className={`btn ${activeTab === 'approvals' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          onClick={() => setActiveTab('approvals')}
        >
          Provider Approvals ({pendingProviders.length})
        </button>
        <button
          className={`btn ${activeTab === 'categories' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          onClick={() => setActiveTab('categories')}
        >
          Categories ({categories.length})
        </button>
        <button
          className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          onClick={() => setActiveTab('users')}
        >
          User Management ({users.length})
        </button>
        <button
          className={`btn ${activeTab === 'bookings' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          onClick={() => setActiveTab('bookings')}
        >
          All Bookings ({bookings.length})
        </button>
        <button
          className={`btn ${activeTab === 'complaints' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          onClick={() => setActiveTab('complaints')}
        >
          Complaints ({complaints.length})
        </button>
      </div>

      {/* Tab 1: Provider Approvals */}
      {activeTab === 'approvals' && (
        <div className="glass-card">
          <h3 className="mb-2">Pending Provider Registrations</h3>
          {pendingProviders.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No pending provider approvals at this time.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {pendingProviders.map((p) => (
                <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(15, 23, 42, 0.6)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border-color)', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <h4 style={{ fontSize: '1.1rem' }}>{p.businessName}</h4>
                      <Badge status={p.status} />
                    </div>
                    <p style={{ fontSize: '0.88rem', color: 'var(--accent-cyan)' }}>
                      Operator: {p.name} ({p.email}) • Phone: {p.phone}
                    </p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>
                      Experience: {p.experienceYears} Years • City: {p.city}
                    </p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                      Bio: "{p.bio}"
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                      onClick={() => handleApproveRejectProvider(p.id, 'REJECTED')}
                      className="btn btn-danger btn-sm"
                    >
                      <XCircle size={14} />
                      <span>Reject</span>
                    </button>
                    <button
                      onClick={() => handleApproveRejectProvider(p.id, 'APPROVED')}
                      className="btn btn-success btn-sm"
                    >
                      <CheckCircle size={14} />
                      <span>Approve Provider</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Category Management */}
      {activeTab === 'categories' && (
        <div className="glass-card">
          <div className="flex-between mb-4">
            <h3>Service Categories</h3>
            <button
              onClick={() => {
                setEditingCategory(null);
                setCategoryForm({ name: '', description: '', icon: 'Wrench', imageUrl: '' });
                setCategoryModalOpen(true);
              }}
              className="btn btn-primary btn-sm"
            >
              <PlusCircle size={16} />
              <span>Add New Category</span>
            </button>
          </div>

          <div className="grid-3">
            {categories.map((c) => (
              <div key={c.id} style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '0.4rem' }}>{c.name}</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>{c.description}</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                  <button
                    onClick={() => {
                      setEditingCategory(c);
                      setCategoryForm({ name: c.name, description: c.description, icon: c.icon || 'Wrench', imageUrl: c.imageUrl || '' });
                      setCategoryModalOpen(true);
                    }}
                    className="btn btn-secondary btn-sm"
                    style={{ flex: 1 }}
                  >
                    <Edit size={14} />
                    <span>Edit</span>
                  </button>
                  <button onClick={() => handleDeleteCategory(c.id)} className="btn btn-danger btn-sm">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: User Management */}
      {activeTab === 'users' && (
        <div className="glass-card">
          <h3 className="mb-4">System User Directory</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '0.75rem' }}>ID</th>
                  <th style={{ padding: '0.75rem' }}>Name</th>
                  <th style={{ padding: '0.75rem' }}>Email</th>
                  <th style={{ padding: '0.75rem' }}>Role</th>
                  <th style={{ padding: '0.75rem' }}>Status</th>
                  <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.75rem' }}>#{u.id}</td>
                    <td style={{ padding: '0.75rem', fontWeight: 600 }}>{u.name}</td>
                    <td style={{ padding: '0.75rem', color: 'var(--accent-cyan)' }}>{u.email}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <span className="badge badge-in_progress">{u.role}</span>
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <span style={{ color: u.enabled ? 'var(--accent-emerald)' : 'var(--accent-rose)', fontWeight: 600 }}>
                        {u.enabled ? '● Active' : '○ Disabled'}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                      {u.role !== 'ADMIN' && (
                        <button
                          onClick={() => handleToggleUserStatus(u.id)}
                          className={`btn ${u.enabled ? 'btn-danger' : 'btn-success'} btn-sm`}
                        >
                          {u.enabled ? 'Disable Account' : 'Enable Account'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: All Bookings Audit */}
      {activeTab === 'bookings' && (
        <div className="glass-card">
          <h3 className="mb-4">System Booking Directory</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {bookings.map((b) => (
              <div key={b.id} style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <h4 style={{ fontSize: '1rem' }}>{b.requestTitle}</h4>
                    <Badge status={b.status} />
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                    Customer: {b.customerName} → Provider: {b.providerBusinessName} • Scheduled: {b.scheduledDate}
                  </p>
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
                  ${b.finalPrice}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Complaints Management */}
      {activeTab === 'complaints' && (
        <div className="glass-card">
          <h3 className="mb-4">User Complaints & Support Discrepancies</h3>
          {complaints.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No customer complaints submitted.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {complaints.map((c) => (
                <div key={c.id} style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                  <div className="flex-between mb-2">
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <h4 style={{ fontSize: '1.1rem' }}>{c.subject}</h4>
                        <Badge status={c.status} />
                      </div>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        Filed by: {c.userName} ({c.userEmail}) • {new Date(c.createdAt).toLocaleString()}
                      </p>
                    </div>

                    {c.status === 'OPEN' && (
                      <button
                        onClick={() => {
                          setSelectedComplaint(c);
                          setResolutionNote('');
                          setResolutionStatus('RESOLVED');
                          setComplaintModalOpen(true);
                        }}
                        className="btn btn-primary btn-sm"
                      >
                        Resolve Dispute
                      </button>
                    )}
                  </div>

                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '0.75rem 0' }}>
                    "{c.description}"
                  </p>

                  {c.adminResolutionNote && (
                    <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '0.75rem', borderRadius: '6px', borderLeft: '3px solid var(--accent-emerald)', fontSize: '0.85rem' }}>
                      <strong>Admin Resolution Note:</strong> {c.adminResolutionNote}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Category Modal */}
      {categoryModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h3>{editingCategory ? 'Edit Category' : 'Create New Category'}</h3>
            <form onSubmit={handleSaveCategory}>
              <div className="form-group" style={{ marginTop: '1rem' }}>
                <label className="form-label">Category Name</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  rows="3"
                  required
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Lucide Icon Name</label>
                <select
                  className="form-select"
                  value={categoryForm.icon}
                  onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })}
                >
                  <option value="Wrench">Wrench</option>
                  <option value="Zap">Zap</option>
                  <option value="Sparkles">Sparkles</option>
                  <option value="Tv">Tv</option>
                  <option value="Hammer">Hammer</option>
                  <option value="Paintbrush">Paintbrush</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setCategoryModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Complaint Resolution Modal */}
      {complaintModalOpen && selectedComplaint && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h3>Resolve Support Complaint</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              Subject: <strong>{selectedComplaint.subject}</strong>
            </p>

            <form onSubmit={handleResolveComplaint}>
              <div className="form-group">
                <label className="form-label">Resolution Status</label>
                <select
                  className="form-select"
                  value={resolutionStatus}
                  onChange={(e) => setResolutionStatus(e.target.value)}
                >
                  <option value="RESOLVED">RESOLVED</option>
                  <option value="DISMISSED">DISMISSED</option>
                  <option value="IN_REVIEW">IN_REVIEW</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Resolution Summary Note</label>
                <textarea
                  className="form-textarea"
                  rows="4"
                  required
                  placeholder="State action taken (refund processed, provider warning issued, dispute closed)..."
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setComplaintModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Submit Resolution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
