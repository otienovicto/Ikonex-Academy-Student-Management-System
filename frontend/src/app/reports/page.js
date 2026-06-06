'use client';

import { useEffect, useState } from 'react';
import { FiDownloadCloud } from 'react-icons/fi';
import { Alert, Button, LoadingSpinner } from '@/components/ui';
import { Select } from '@/components/FormInputs';
import reportService from '@/services/reportService';
import studentService from '@/services/studentService';
import streamService from '@/services/streamService';

export default function ReportsPage() {
  const [reportType, setReportType] = useState('student');
  const [students, setStudents] = useState([]);
  const [streams, setStreams] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedStream, setSelectedStream] = useState('');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchStudents();
    fetchStreams();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await studentService.getAllStudents();
      setStudents(res.data?.data || []);
    } catch (err) {
      console.error('Failed to load students');
    }
  };

  const fetchStreams = async () => {
    try {
      const res = await streamService.getAllStreams();
      setStreams(res.data?.data || []);
    } catch (err) {
      console.error('Failed to load streams');
    }
  };

  const handleGenerateReport = async () => {
    try {
      setLoading(true);
      setError(null);
      setReportData(null);

      if (reportType === 'student' && !selectedStudent) {
        setError('Please select a student');
        setLoading(false);
        return;
      }

      if (reportType === 'class' && !selectedStream) {
        setError('Please select a stream');
        setLoading(false);
        return;
      }

      if (reportType === 'student') {
        const res = await reportService.getStudentReport(selectedStudent);
        setReportData(res.data?.data);
      } else if (reportType === 'class') {
        const res = await reportService.getClassReport(selectedStream);
        setReportData(res.data?.data);
      }

      setSuccess('Report generated successfully');
    } catch (err) {
      setError('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      setDownloading(true);
      setError(null);

      if (reportType === 'student' && selectedStudent) {
        const response = await reportService.downloadStudentPDF(selectedStudent);
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `student-report-${selectedStudent}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.parentElement.removeChild(link);
        setSuccess('PDF downloaded successfully');
      } else if (reportType === 'class' && selectedStream) {
        const response = await reportService.downloadClassPDF(selectedStream);
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `class-report-${selectedStream}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.parentElement.removeChild(link);
        setSuccess('PDF downloaded successfully');
      }
    } catch (err) {
      setError('Failed to download PDF');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Reports</h1>

      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => setError(null)}
        />
      )}
      {success && (
        <Alert
          type="success"
          message={success}
          onClose={() => setSuccess(null)}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Report Options</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Report Type
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="student"
                    checked={reportType === 'student'}
                    onChange={(e) => {
                      setReportType(e.target.value);
                      setReportData(null);
                    }}
                    className="h-4 w-4"
                  />
                  <span className="ml-2 text-gray-700">Student Report Card</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="class"
                    checked={reportType === 'class'}
                    onChange={(e) => {
                      setReportType(e.target.value);
                      setReportData(null);
                    }}
                    className="h-4 w-4"
                  />
                  <span className="ml-2 text-gray-700">Class Report</span>
                </label>
              </div>
            </div>

            {reportType === 'student' && (
              <Select
                label="Select Student"
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                options={students.map((s) => ({
                  value: s.id,
                  label: `${s.firstName} ${s.lastName}`,
                }))}
              />
            )}

            {reportType === 'class' && (
              <Select
                label="Select Stream"
                value={selectedStream}
                onChange={(e) => setSelectedStream(e.target.value)}
                options={streams.map((s) => ({
                  value: s.id,
                  label: s.name,
                }))}
              />
            )}

            <div className="flex gap-2">
              <Button onClick={handleGenerateReport} loading={loading}>
                View Report
              </Button>
              <Button
                variant="secondary"
                onClick={handleDownloadPDF}
                loading={downloading}
                disabled={!reportData}
              >
                <FiDownloadCloud size={20} /> PDF
              </Button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          {reportData && (
            <div className="bg-white p-6 rounded-lg shadow max-h-96 overflow-y-auto">
              <pre className="text-sm text-gray-700 font-mono">
                {JSON.stringify(reportData, null, 2)}
              </pre>
            </div>
          )}

          {!reportData && !loading && (
            <div className="bg-gray-50 p-6 rounded-lg text-center text-gray-500">
              Select options and click "View Report" to generate a report
            </div>
          )}

          {loading && (
            <div className="bg-white p-6 rounded-lg shadow">
              <LoadingSpinner />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
