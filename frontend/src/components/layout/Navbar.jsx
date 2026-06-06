'use client';

import Link from 'next/link';
import { FiMenu, FiUser } from 'react-icons/fi';
import { useState } from 'react';

export default function Navbar({ toggleSidebar }) {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-full mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 hover:bg-blue-700 rounded"
          >
            <FiMenu size={24} />
          </button>
          <Link href="/" className="text-2xl font-bold">
            IKONEX Student Management System
          </Link>
        </div>
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="p-2 hover:bg-blue-700 rounded transition"
            title="User Profile"
          >
            <FiUser size={24} />
          </button>
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded shadow-lg z-50">
              <div className="p-4 border-b">
                <p className="font-semibold">User Profile</p>
                <p className="text-sm text-gray-600">Admin User</p>
              </div>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100 transition">
                Settings
              </button>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100 transition border-t">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
