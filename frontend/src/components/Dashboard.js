
import React, { useState, useEffect } from "react";
import Sidebar from './Sidebar';
import TopHeader from './TopHeader';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Keep the calendar styles
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [date, setDate] = useState(new Date());
  const [Username, setUsername] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUsername(user.username);
    }
  }, []);

  const onDateChange = (newDate) => {
    setDate(newDate);
  };

  // Sample data for the bar graph (Attendance Summary) based on months
  const attendanceData = [
    { month: 'Jan', attendance: 20 },
    { month: 'Feb', attendance: 18 },
    { month: 'Mar', attendance: 22 },
    { month: 'Apr', attendance: 19 },
    { month: 'May', attendance: 21 },
    { month: 'Jun', attendance: 23 },
    { month: 'Jul', attendance: 20 },
    { month: 'Aug', attendance: 24 },
    { month: 'Sep', attendance: 18 },
    { month: 'Oct', attendance: 21 },
    { month: 'Nov', attendance: 19 },
    { month: 'Dec', attendance: 22 },
  ];

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-8 bg-gray-50">
        <TopHeader pageTitle="Dashboard" />
        <div className="mt-8 space-y-8">
          {/* First Row: Task Summary and Notifications side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Task Summary */}
            <div className="bg-blue-100 p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold mb-6">Task Summary</h3>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <h4 className="text-lg font-semibold">Task 1</h4>
                  <p>Status: In Progress</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <h4 className="text-lg font-semibold">Task 2</h4>
                  <p>Status: Completed</p>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-yellow-100 p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold mb-6">Notifications</h3>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <p>You have a meeting scheduled at 3 PM today.</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <p>Your task 'Task 1' has been updated.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Second Row: Attendance Summary (Bar Chart) and Calendar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Attendance Summary - Bar Graph */}
            <div className="bg-green-100 p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold mb-6">Attendance Summary</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="attendance" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Calendar Section */}
            <div className="bg-purple-100 p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold mb-6">Live Calendar</h3>
              <Calendar
                onChange={onDateChange}
                value={date}
                className="w-full p-4 rounded-lg shadow-md border"
              />
              <p className="mt-4 text-gray-700">Selected Date: {date.toDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
