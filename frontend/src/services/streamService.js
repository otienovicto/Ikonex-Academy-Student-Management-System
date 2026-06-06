// Stream Service
import api from './api';

const streamService = {
  getAllStreams: () => api.get('/streams'),
  getStreamById: (id) => api.get(`/streams/${id}`),
  createStream: (data) => api.post('/streams', data),
  updateStream: (id, data) => api.put(`/streams/${id}`, data),
  deleteStream: (id) => api.delete(`/streams/${id}`),
};

export default streamService;
