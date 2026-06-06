'use client';

import Link from 'next/link';
import {
  FiHome,
  FiUsers,
  FiBookOpen,
  FiFileText,
  FiBarChart2,
  FiDownloadCloud,
} from 'react-icons/fi';

export default function Sidebar({ isOpen, onClose }) {
  const menuItems = [
    { href: '/dashboard', label: 'Dashboard', Icon: FiHome },
    { href: '/students', label: 'Students', Icon: FiUsers },
    { href: '/streams', label: 'Streams', Icon: FiBookOpen },
    { href: '/subjects', label: 'Subjects', Icon: FiFileText },
    { href: '/scores', label: 'Scores', Icon: FiBarChart2 },
    { href: '/reports', label: 'Reports', Icon: FiDownloadCloud },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 lg:hidden z-30"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed lg:relative w-64 h-screen bg-gray-900 text-white p-6 z-40 transform transition-transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="mb-8">
          <h2 className="text-xl font-bold">Menu</h2>
        </div>
        <nav className="space-y-2">
          {menuItems.map(({ href, label, Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-4 py-3 rounded hover:bg-gray-700 transition"
              onClick={onClose}
            >
              <Icon size={20} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
