'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiUsers, FiBookOpen, FiFileText, FiBarChart2 } from 'react-icons/fi';
import { Alert, LoadingSpinner } from '@/components/ui';
import studentService from '@/services/studentService';
import streamService from '@/services/streamService';
import subjectService from '@/services/subjectService';
import scoreService from '@/services/scoreService';

export default function Dashboard() {
  const [stats, setStats] = useState({
    students: 0,
    streams: 0,
    subjects: 0,
    scores: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [studentsRes, streamsRes, subjectsRes, scoresRes] = await Promise.all([
          studentService.getAllStudents().catch(() => ({ data: { data: [] } })),
          streamService.getAllStreams().catch(() => ({ data: { data: [] } })),
          subjectService.getAllSubjects().catch(() => ({ data: { data: [] } })),
          scoreService.getAllScores().catch(() => ({ data: { data: [] } })),
        ]);

        setStats({
          students: studentsRes.data?.data?.length || 0,
          streams: streamsRes.data?.data?.length || 0,
          subjects: subjectsRes.data?.data?.length || 0,
          scores: scoresRes.data?.data?.length || 0,
        });
      } catch (err) {
        setError('Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner />;

  const cards = [
    {
      title: 'Students',
      count: stats.students,
      icon: FiUsers,
      href: '/students',
      color: 'bg-blue-500',
    },
    {
      title: 'Streams',
      count: stats.streams,
      icon: FiBookOpen,
      href: '/streams',
      color: 'bg-green-500',
    },
    {
      title: 'Subjects',
      count: stats.subjects,
      icon: FiFileText,
      href: '/subjects',
      color: 'bg-yellow-500',
    },
    {
      title: 'Scores',
      count: stats.scores,
      icon: FiBarChart2,
      href: '/scores',
      color: 'bg-red-500',
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {error && <Alert type="error" message={error} />}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.href} href={card.href}>
              <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition cursor-pointer">
                <div className={`${card.color} text-white p-3 rounded-lg inline-block mb-4`}>
                  <Icon size={24} />
                </div>
                <h3 className="text-gray-700 font-semibold mb-2">{card.title}</h3>
                <p className="text-3xl font-bold text-gray-900">{card.count}</p>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-12 bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/students?action=new"
            className="p-4 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 transition"
          >
            <div className="font-semibold text-blue-900">Add New Student</div>
            <div className="text-sm text-blue-700">Register a new student</div>
          </Link>
          <Link
            href="/scores?action=new"
            className="p-4 bg-green-50 border border-green-200 rounded hover:bg-green-100 transition"
          >
            <div className="font-semibold text-green-900">Enter Scores</div>
            <div className="text-sm text-green-700">Record assessment marks</div>
          </Link>
          <Link
            href="/reports"
            className="p-4 bg-purple-50 border border-purple-200 rounded hover:bg-purple-100 transition"
          >
            <div className="font-semibold text-purple-900">View Reports</div>
            <div className="text-sm text-purple-700">Generate performance reports</div>
          </Link>
          <Link
            href="/streams"
            className="p-4 bg-orange-50 border border-orange-200 rounded hover:bg-orange-100 transition"
          >
            <div className="font-semibold text-orange-900">Manage Streams</div>
            <div className="text-sm text-orange-700">Organize classes</div>
          </Link>
        </div>
      </div>
    </div>
  );
}
