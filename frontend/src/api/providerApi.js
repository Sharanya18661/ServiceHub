import api from './axios';

export const providerApi = {
  getAllApproved: () => api.get('/providers'),
  getPending: () => api.get('/providers/pending'),
  getMyProfile: () => api.get('/providers/me'),
  getById: (id) => api.get(`/providers/${id}`),
  updateMyProfile: (data) => api.put('/providers/me', data),
  updateStatus: (id, status) => api.put(`/providers/${id}/status?status=${status}`),
};
