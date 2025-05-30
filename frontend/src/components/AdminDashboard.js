
// frontend/src/pages/AdminDashboard.js

import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold text-blue-700 mb-4">Admin Dashboard</h1>
      <p className="text-lg text-gray-700 mb-8">
        Welcome, Admin! You have full access to manage employees, tasks, and more.
      </p>

      <div className="space-y-4">
        <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
          Manage Employees
        </button>
        <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
          View Reports
        </button>
        <button
          onClick={handleLogout}
          className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
