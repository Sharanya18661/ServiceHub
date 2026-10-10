import api from './axios';

export const quoteApi = {
  create: (data) => api.post('/quotations', data),
  getByRequest: (requestId) => api.get(`/quotations/request/${requestId}`),
  getMyQuotations: () => api.get('/quotations/my'),
  accept: (id) => api.post(`/quotations/${id}/accept`),
  reject: (id) => api.post(`/quotations/${id}/reject`),
};
