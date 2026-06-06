// Report Service
import api from './api';

const reportService = {
  getStudentReport: (studentId) => api.get(`/reports/student/${studentId}`),
  getClassReport: (streamId) => api.get(`/reports/class/${streamId}`),
  getRankingReport: (streamId) => api.get(`/reports/ranking/${streamId}`),
  downloadStudentPDF: (studentId) =>
    api.get(`/reports/student/${studentId}/pdf`, { responseType: 'blob' }),
  downloadClassPDF: (streamId) =>
    api.get(`/reports/class/${streamId}/pdf`, { responseType: 'blob' }),
};

export default reportService;

