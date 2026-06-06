// Score Service
import api from './api';

const scoreService = {
  getAllScores: () => api.get('/scores'),
  getScoreById: (id) => api.get(`/scores/${id}`),
  createScore: (data) => api.post('/scores', data),
  updateScore: (id, data) => api.put(`/scores/${id}`, data),
  deleteScore: (id) => api.delete(`/scores/${id}`),
};

export default scoreService;
