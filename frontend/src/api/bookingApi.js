import api from './axios';

export const bookingApi = {
  getMyBookings: () => api.get('/bookings/my'),
  getProviderBookings: () => api.get('/bookings/provider'),
  getAllBookings: () => api.get('/bookings'),
  getById: (id) => api.get(`/bookings/${id}`),
  updateStatus: (id, status) => api.put(`/bookings/${id}/status?status=${status}`),
};
