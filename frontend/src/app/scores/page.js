'use client';

import { useEffect, useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import Table from '@/components/Table';
import Modal from '@/components/Modal';
import { Alert, Button, LoadingSpinner } from '@/components/ui';
import { Input, Select } from '@/components/FormInputs';
import scoreService from '@/services/scoreService';
import studentService from '@/services/studentService';
import subjectService from '@/services/subjectService';

export default function ScoresPage() {
  const [scores, setScores] = useState([]);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    studentId: '',
    subjectId: '',
    assessmentName: '',
    marks: '',
  });

  useEffect(() => {
    fetchScores();
    fetchStudents();
    fetchSubjects();
  }, []);

  const fetchScores = async () => {
    try {
      setLoading(true);
      const res = await scoreService.getAllScores();
      setScores(res.data?.data || []);
    } catch (err) {
      setError('Failed to load scores');
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await studentService.getAllStudents();
      setStudents(res.data?.data || []);
    } catch (err) {
      console.error('Failed to load students');
    }
  };

  const fetchSubjects = async () => {
    try {
      const res = await subjectService.getAllSubjects();
      setSubjects(res.data?.data || []);
    } catch (err) {
      console.error('Failed to load subjects');
    }
  };

  const handleSubmit = async () => {
    try {
      const marks = parseFloat(formData.marks);
      if (isNaN(marks) || marks < 0 || marks > 100) {
        setError('Marks must be a number between 0 and 100');
        return;
      }

      if (editingId) {
        await scoreService.updateScore(editingId, formData);
        setSuccess('Score updated successfully');
      } else {
        await scoreService.createScore(formData);
        setSuccess('Score recorded successfully');
      }
      
      // Close modal and reset form after a short delay
      setTimeout(() => {
        setIsModalOpen(false);
        setEditingId(null);
        setFormData({
          studentId: '',
          subjectId: '',
          assessmentName: '',
          marks: '',
        });
        fetchScores();
      }, 1000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Operation failed';
      setError(errorMsg);
    }
  };

  const handleEdit = (score) => {
    setFormData({
      studentId: score.student?.id,
      subjectId: score.subject?.id,
      assessmentName: score.assessmentName,
      marks: score.marks.toString(),
    });
    setEditingId(score.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this score?')) {
      try {
        await scoreService.deleteScore(id);
        setSuccess('Score deleted successfully');
        fetchScores();
      } catch (err) {
        setError('Failed to delete score');
      }
    }
  };

  const columns = [
    {
      key: 'student',
      label: 'Student',
      render: (student) => `${student?.firstName} ${student?.lastName}`,
    },
    {
      key: 'subject',
      label: 'Subject',
      render: (subject) => subject?.name,
    },
    { key: 'assessmentName', label: 'Assessment' },
    { key: 'marks', label: 'Marks' },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Assessment Scores</h1>
        <Button
          onClick={() => {
            setError(null);
            setSuccess(null);
            setEditingId(null);
            setFormData({
              studentId: '',
              subjectId: '',
              assessmentName: '',
              marks: '',
            });
            setIsModalOpen(true);
          }}
        >
          <FiPlus size={20} /> Record Score
        </Button>
      </div>

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

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table
            columns={columns}
            data={scores}
            onEdit={handleEdit}
            onDelete={handleDelete}
            loading={false}
          />
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        title={editingId ? 'Edit Score' : 'Record New Score'}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      >
        <Select
          label="Student"
          name="studentId"
          value={formData.studentId}
          onChange={(e) =>
            setFormData({ ...formData, studentId: e.target.value })
          }
          options={students.map((s) => ({
            value: s.id,
            label: `${s.firstName} ${s.lastName}`,
          }))}
          required
        />
        <Select
          label="Subject"
          name="subjectId"
          value={formData.subjectId}
          onChange={(e) =>
            setFormData({ ...formData, subjectId: e.target.value })
          }
          options={subjects.map((s) => ({ value: s.id, label: s.name }))}
          required
        />
        <Input
          label="Assessment Name"
          name="assessmentName"
          value={formData.assessmentName}
          onChange={(e) =>
            setFormData({ ...formData, assessmentName: e.target.value })
          }
          required
        />
        <Input
          label="Marks (0-100)"
          name="marks"
          type="number"
          min="0"
          max="100"
          value={formData.marks}
          onChange={(e) =>
            setFormData({ ...formData, marks: e.target.value })
          }
          required
        />
      </Modal>
    </div>
  );
}
