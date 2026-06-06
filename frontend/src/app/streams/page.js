'use client';

import { useEffect, useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import Table from '@/components/Table';
import Modal from '@/components/Modal';
import { Alert, Button, LoadingSpinner } from '@/components/ui';
import { Input, Textarea } from '@/components/FormInputs';
import streamService from '@/services/streamService';

export default function StreamsPage() {
  const [streams, setStreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
  });

  useEffect(() => {
    fetchStreams();
  }, []);

  const fetchStreams = async () => {
    try {
      setLoading(true);
      const res = await streamService.getAllStreams();
      setStreams(res.data?.data || []);
    } catch (err) {
      setError('Failed to load streams');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await streamService.updateStream(editingId, formData);
        setSuccess('Stream updated successfully');
      } else {
        await streamService.createStream(formData);
        setSuccess('Stream created successfully');
      }
      
      // Close modal and reset form after a short delay
      setTimeout(() => {
        setIsModalOpen(false);
        setEditingId(null);
        setFormData({ name: '', code: '', description: '' });
        fetchStreams();
      }, 1000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Operation failed';
      setError(errorMsg);
    }
  };

  const handleEdit = (stream) => {
    setFormData({
      name: stream.name,
      code: stream.code,
      description: stream.description,
    });
    setEditingId(stream.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this stream?')) {
      try {
        await streamService.deleteStream(id);
        setSuccess('Stream deleted successfully');
        fetchStreams();
      } catch (err) {
        setError('Failed to delete stream');
      }
    }
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'code', label: 'Code' },
    { key: 'description', label: 'Description' },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Streams</h1>
        <Button
          onClick={() => {
            setError(null);
            setSuccess(null);
            setEditingId(null);
            setFormData({ name: '', code: '', description: '' });
            setIsModalOpen(true);
          }}
        >
          <FiPlus size={20} /> Add Stream
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
            data={streams}
            onEdit={handleEdit}
            onDelete={handleDelete}
            loading={false}
          />
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        title={editingId ? 'Edit Stream' : 'Add New Stream'}
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
        <Textarea
          label="Description"
          name="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
      </Modal>
    </div>
  );
}
