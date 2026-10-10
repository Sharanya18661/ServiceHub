import api from './axios';

export const complaintApi = {
  create: (data) => api.post('/complaints', data),
  getMyComplaints: () => api.get('/complaints/my'),
  getAll: () => api.get('/complaints'),
  resolve: (id, status, adminNote) => api.put(`/complaints/${id}/resolve?status=${status}&adminNote=${encodeURIComponent(adminNote || '')}`),
};
