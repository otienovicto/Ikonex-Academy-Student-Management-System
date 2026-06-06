'use client';

import { useEffect, useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import Table from '@/components/Table';
import Modal from '@/components/Modal';
import { Alert, Button, LoadingSpinner } from '@/components/ui';
import { Input, Select } from '@/components/FormInputs';
import subjectService from '@/services/subjectService';
import streamService from '@/services/streamService';

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState([]);
  const [streams, setStreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    streamIds: [],
  });

  useEffect(() => {
    fetchSubjects();
    fetchStreams();
  }, []);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const res = await subjectService.getAllSubjects();
      setSubjects(res.data?.data || []);
    } catch (err) {
      setError('Failed to load subjects');
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
        await subjectService.updateSubject(editingId, formData);
        setSuccess('Subject updated successfully');
      } else {
        await subjectService.createSubject(formData);
        setSuccess('Subject created successfully');
      }
      
      // Close modal and reset form after a short delay
      setTimeout(() => {
        setIsModalOpen(false);
        setEditingId(null);
        setFormData({ name: '', code: '', streamIds: [] });
        fetchSubjects();
      }, 1000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Operation failed';
      setError(errorMsg);
    }
  };

  const handleEdit = (subject) => {
    setFormData({
      name: subject.name,
      code: subject.code,
      streamIds: subject.streams?.map((s) => s.id) || [],
    });
    setEditingId(subject.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this subject?')) {
      try {
        await subjectService.deleteSubject(id);
        setSuccess('Subject deleted successfully');
        fetchSubjects();
      } catch (err) {
        setError('Failed to delete subject');
      }
    }
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'code', label: 'Code' },
    {
      key: 'streams',
      label: 'Streams',
      render: (streams) =>
        streams?.map((s) => s.name).join(', ') || 'No streams',
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Subjects</h1>
        <Button
          onClick={() => {
            setError(null);
            setSuccess(null);
            setEditingId(null);
            setFormData({ name: '', code: '', streamIds: [] });
            setIsModalOpen(true);
          }}
        >
          <FiPlus size={20} /> Add Subject
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
            data={subjects}
            onEdit={handleEdit}
            onDelete={handleDelete}
            loading={false}
          />
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        title={editingId ? 'Edit Subject' : 'Add New Subject'}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      >
        <Input
          label="Name"
          name="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <Input
          label="Code"
          name="code"
          value={formData.code}
          onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          required
        />
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Assign to Streams
          </label>
          <div className="space-y-2">
            {streams.map((stream) => (
              <label key={stream.id} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.streamIds.includes(stream.id)}
                  onChange={(e) => {
                    const ids = formData.streamIds;
                    if (e.target.checked) {
                      ids.push(stream.id);
                    } else {
                      ids.splice(ids.indexOf(stream.id), 1);
                    }
                    setFormData({ ...formData, streamIds: [...ids] });
                  }}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300"
                />
                <span className="ml-2 text-gray-700">{stream.name}</span>
              </label>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
}
