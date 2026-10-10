import api from './axios';

export const serviceApi = {
  search: (params) => api.get('/services', { params }),
  getByProvider: (providerId) => api.get(`/services/provider/${providerId}`),
  create: (data) => api.post('/services', data),
  update: (id, data) => api.put(`/services/${id}`, data),
  delete: (id) => api.delete(`/services/${id}`),
};
