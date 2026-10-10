import api from './axios';

export const reviewApi = {
  create: (data) => api.post('/reviews', data),
  getByProvider: (providerId) => api.get(`/reviews/provider/${providerId}`),
};
