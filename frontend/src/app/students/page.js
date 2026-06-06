'use client';

import { useEffect, useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import Table from '@/components/Table';
import Modal from '@/components/Modal';
import { Alert, Button, LoadingSpinner } from '@/components/ui';
import { Input, Select } from '@/components/FormInputs';
import studentService from '@/services/studentService';
import streamService from '@/services/streamService';

export default function StudentPage() {
  const [students, setStudents] = useState([]);
  const [streams, setStreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    registrationNumber: '',
    firstName: '',
    lastName: '',
    email: '',
    dateOfBirth: '',
    streamId: '',
  });

  useEffect(() => {
    fetchStudents();
    fetchStreams();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await studentService.getAllStudents();
      setStudents(res.data?.data || []);
    } catch (err) {
      setError('Failed to load students');
    } finally {
      setLoading(false);
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

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await studentService.updateStudent(editingId, formData);
        setSuccess('Student updated successfully');
      } else {
        await studentService.createStudent(formData);
        setSuccess('Student created successfully');
      }
      
      // Close modal and reset form after a short delay
      setTimeout(() => {
        setIsModalOpen(false);
        setEditingId(null);
        setFormData({
          registrationNumber: '',
          firstName: '',
          lastName: '',
          email: '',
          dateOfBirth: '',
          streamId: '',
        });
        fetchStudents();
      }, 1000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Operation failed';
      setError(errorMsg);
    }
  };

  const handleEdit = (student) => {
    setFormData({
      registrationNumber: student.registrationNumber,
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      dateOfBirth: student.dateOfBirth?.split('T')[0],
      streamId: student.stream?.id,
    });
    setEditingId(student.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this student?')) {
      try {
        await studentService.deleteStudent(id);
        setSuccess('Student deleted successfully');
        fetchStudents();
      } catch (err) {
        setError('Failed to delete student');
      }
    }
  };

  const columns = [
    { key: 'registrationNumber', label: 'Registration No.' },
    {
      key: 'firstName',
      label: 'Name',
      render: (_, row) => `${row.firstName} ${row.lastName}`,
    },
    { key: 'email', label: 'Email' },
    {
      key: 'stream',
      label: 'Stream',
      render: (stream) => stream?.name || 'N/A',
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Students</h1>
        <Button
          onClick={() => {
            setError(null);
            setSuccess(null);
            setEditingId(null);
            setFormData({
              registrationNumber: '',
              firstName: '',
              lastName: '',
              email: '',
              dateOfBirth: '',
              streamId: '',
            });
            setIsModalOpen(true);
          }}
        >
          <FiPlus size={20} /> Add Student
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
            data={students}
            onEdit={handleEdit}
            onDelete={handleDelete}
            loading={false}
          />
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        title={editingId ? 'Edit Student' : 'Add New Student'}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      >
        <Input
          label="Registration Number"
          name="registrationNumber"
          value={formData.registrationNumber}
          onChange={(e) =>
            setFormData({ ...formData, registrationNumber: e.target.value })
          }
          required
        />
        <Input
          label="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={(e) =>
            setFormData({ ...formData, firstName: e.target.value })
          }
          required
        />
        <Input
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={(e) =>
            setFormData({ ...formData, lastName: e.target.value })
          }
          required
        />
        <Input
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
          required
        />
        <Input
          label="Date of Birth"
          name="dateOfBirth"
          type="date"
          value={formData.dateOfBirth}
          onChange={(e) =>
            setFormData({ ...formData, dateOfBirth: e.target.value })
          }
          required
        />
        <Select
          label="Stream"
          name="streamId"
          value={formData.streamId}
          onChange={(e) =>
            setFormData({ ...formData, streamId: e.target.value })
          }
          options={streams.map((s) => ({ value: s.id, label: s.name }))}
          required
        />
      </Modal>
    </div>
  );
}
