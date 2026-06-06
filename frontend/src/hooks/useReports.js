// useReports Hook
import { useState } from 'react';
import reportService from '../services/reportService';

export default function useReports() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateStudentReport = async (studentId) => {
    try {
      setLoading(true);
      const response = await reportService.generateStudentReport(studentId);
      setReport(response.data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateClassReport = async (streamId) => {
    try {
      setLoading(true);
      const response = await reportService.generateClassReport(streamId);
      setReport(response.data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { report, loading, error, generateStudentReport, generateClassReport };
}
