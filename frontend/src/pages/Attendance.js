
import React, { useState } from 'react';
import { Clock } from 'lucide-react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Link, useLocation } from 'react-router-dom';

const Attendance = () => {
  const location = useLocation();

  // Replace with dynamic user data from context or props
  const employeeName = 'John Doe';
  const userId = 'EMP123';

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const getCurrentDate = () => new Date().toISOString().split('T')[0];
  const getCurrentTime = () => new Date().toLocaleTimeString();

  const handleCheckIn = async () => {
    setIsLoading(true);
    setMessage('');
    setError('');
    try {
      await axios.post('http://localhost:5000/api/attendance/checkin', {
        userId,
        date: getCurrentDate(),
        time: getCurrentTime(),
      });
      setMessage('✅ Checked in successfully!');
    } catch (err) {
      console.error(err);
      setError('❌ Check-in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setIsLoading(true);
    setMessage('');
    setError('');
    try {
      await axios.post('http://localhost:5000/api/attendance/checkout', {
        userId,
        date: getCurrentDate(),
        time: getCurrentTime(),
      });
      setMessage('✅ Checked out successfully!');
    } catch (err) {
      console.error(err);
      setError('❌ Check-out failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const chartData = [
    { name: 'Mon', hours: 20 },
    { name: 'Tue', hours: 30 },
    { name: 'Wed', hours: 40 },
    { name: 'Thu', hours: 32 },
    { name: 'Fri', hours: 28 },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="mb-6 flex flex-col lg:flex-row items-start lg:items-center justify-between">
        <h1 className="text-4xl font-bold text-gray-800">Attendance System</h1>
        <div className="mt-4 lg:mt-0 flex gap-4">
          {location.pathname !== '/' && (
            <Link to="/" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">Dashboard</Link>
          )}
          {location.pathname !== '/calendar' && (
            <Link to="/calendar" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">Calendar & Schedule</Link>
          )}
        </div>
      </div>

      {/* Attendance Actions */}
      <div className="bg-white shadow-md p-8 rounded-xl w-full text-center mb-8">
        <div className="mb-6 text-left">
          <p className="text-xl font-semibold text-gray-700">Welcome back!</p>
          <p className="text-2xl font-bold text-blue-600">{employeeName}</p>
        </div>

        <p className="text-2xl font-semibold mb-6">Mark your attendance today</p>

        {message && <p className="text-green-600 font-medium mb-4">{message}</p>}
        {error && <p className="text-red-600 font-medium mb-4">{error}</p>}

        <div className="space-y-6">
          <button
            className="flex items-center justify-center space-x-3 bg-green-500 hover:bg-green-600 text-white px-8 py-4 text-lg rounded-2xl w-full disabled:opacity-60"
            onClick={handleCheckIn}
            disabled={isLoading}
          >
            <Clock className="w-6 h-6" />
            <span>{isLoading ? 'Checking In...' : 'Clock-in'}</span>
          </button>

          <button
            className="flex items-center justify-center space-x-3 bg-red-500 hover:bg-red-600 text-white px-8 py-4 text-lg rounded-2xl w-full disabled:opacity-60"
            onClick={handleCheckOut}
            disabled={isLoading}
          >
            <Clock className="w-6 h-6" />
            <span>{isLoading ? 'Checking Out...' : 'Clock-out'}</span>
          </button>
        </div>
      </div>

      {/* Calendar & Chart Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar */}
        <div className="bg-white shadow-md p-4 rounded-xl w-full text-sm">
          <div className="text-lg font-semibold mb-2">April 2025</div>
          <div className="grid grid-cols-7 text-center font-medium mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day}>{day}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2 text-center">
            {[...Array(30)].map((_, i) => (
              <div key={i} className="h-10 flex items-center justify-center border rounded">
                {i + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Summary Chart */}
        <div className="bg-white shadow-md p-4 rounded-xl w-full h-full">
          <h2 className="text-lg font-medium mb-4">Working Hours Summary</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" />
              <Tooltip />
              <Bar dataKey="hours" fill="#60A5FA" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Attendance;