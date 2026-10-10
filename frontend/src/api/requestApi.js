import api from './axios';

export const requestApi = {
  create: (data) => api.post('/requests', data),
  getMyRequests: () => api.get('/requests/my'),
  getIncomingForProvider: () => api.get('/requests/incoming'),
  getById: (id) => api.get(`/requests/${id}`),
  cancel: (id) => api.put(`/requests/${id}/cancel`),
};
