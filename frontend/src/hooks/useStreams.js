// useStreams Hook
import { useState, useEffect } from 'react';
import streamService from '../services/streamService';

export default function useStreams() {
  const [streams, setStreams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStreams();
  }, []);

  const fetchStreams = async () => {
    try {
      setLoading(true);
      const response = await streamService.getAllStreams();
      setStreams(response.data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { streams, loading, error, fetchStreams };
}
