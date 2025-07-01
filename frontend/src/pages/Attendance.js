
// Attendance.js

import React, { useEffect, useState } from 'react';
import { Clock, Search } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import TopHeader from '../components/Employee_Components/TopHeader'; 
import Sidebar from '../components/Employee_Components/Sidebar'; 

const Attendance = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [userId, setUserId] = useState(localStorage.getItem("userId") || null);
  const [attendanceData, setAttendanceData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const token = localStorage.getItem("token");
    const pic = localStorage.getItem("userPic");

    if (!storedUsername || !token) {
      navigate("/", { replace: true });
      return;
    }
    setUserId(userId);
    setUsername(storedUsername);
    setProfilePic(pic);
    fetchAttendanceData();
  }, [navigate, userId]);

  const getCurrentDate = () => new Date().toISOString().split('T')[0];
  const getCurrentTime = () => new Date().toLocaleTimeString();

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  const handleCheckIn = async () => {
    setIsLoading(true);
    setMessage('');
    setError('');
    try {
      const response = await axios.post('http://localhost:5000/api/attendance/checkin', {
        userId,
        date: getCurrentDate(),
        time: getCurrentTime()
      });
      if (response.data.alreadyCheckedIn) {
        setError("⚠️ You've already checked in today!");
      } else {
        setMessage(response.data.message || '✅ Checked in successfully!');
      }
      await fetchAttendanceData();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || '❌ Check-in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setIsLoading(true);
    setMessage('');
    setError('');
    try {
      const response = await axios.post('http://localhost:5000/api/attendance/checkout', {
        userId,
        date: getCurrentDate(),
        time: getCurrentTime()
      });
      if (response.data.alreadyCheckedOut) {
        setError("⚠️ You've already checked out today!");
      } else {
        setMessage(response.data.message || '✅ Checked out successfully!');
      }
      await fetchAttendanceData();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || '❌ Check-out failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAttendanceData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/attendance/${userId}`);
      const data = response.data;

      // Calculate worked hours per record
      const processedData = data.map(record => {
        let workedHours = 0;
        if (record.checkIn && record.checkOut) {
          const checkInTime = new Date(`1970-01-01T${record.checkIn}`);
          const checkOutTime = new Date(`1970-01-01T${record.checkOut}`);
          workedHours = (checkOutTime - checkInTime) / 1000 / 3600; // convert ms to hours
        }
        return {
          ...record,
          workedHours
        };
      });

      setAttendanceData(processedData);
    } catch (err) {
      console.error("Failed to fetch attendance:", err);
    }
  };

  // Calendar Helpers
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = getDaysInMonth(year, month);

  // Find the weekday of 1st day of month (0=Sun, 1=Mon,...)
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  // Function to get attendance status for a given date string "YYYY-MM-DD"
  const getStatusForDate = (dateStr) => {
    const record = attendanceData.find(item => item.date === dateStr);

    if (record) {
      if (record.checkIn && record.checkOut) {
        return "present";
      } else if (record.checkIn && !record.checkOut) {
        return "partial";
      }
    }
    return "absent";
  };

  // Render calendar grid with weekdays, empty cells before 1st and after last day
  const renderCalendar = () => {
    const totalCells = firstDayOfWeek + daysInMonth;
    const rows = [];

    let day = 1;

    // max 6 weeks
    for (let week = 0; week < 6; week++) {
      const cells = [];
      for (let i = 0; i < 7; i++) {
        if (week === 0 && i < firstDayOfWeek) {
          // Empty cell before month start
          cells.push(<td key={`empty-start-${i}`} className="border p-2"></td>);
        } else if (day > daysInMonth) {
          // Empty cell after month end
          cells.push(<td key={`empty-end-${i}`} className="border p-2"></td>);
        } else {
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const status = getStatusForDate(dateStr);

          // Highlight today's date with border
          const isToday = day === today.getDate();

          // Color every cell based on attendance status
          let bgColorClass = "";
          if (status === "present") bgColorClass = "bg-green-300";
          else if (status === "partial") bgColorClass = "bg-yellow-300";
          else if (status === "absent") bgColorClass = "bg-red-300";

          // Add a border ring for today's date
          const todayBorderClass = isToday ? "ring-2 ring-blue-600" : "";

          cells.push(
            <td
              key={day}
              className={`border p-3 text-center font-medium cursor-default ${bgColorClass} ${todayBorderClass}`}
              title={`Date: ${dateStr} - Status: ${status.charAt(0).toUpperCase() + status.slice(1)}`}
            >
              {day}
            </td>
          );
          day++;
        }
      }
      rows.push(<tr key={week}>{cells}</tr>);
      if (day > daysInMonth) break; // stop creating weeks after month days end
    }

    return (
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100 text-gray-700">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((dayName) => (
              <th key={dayName} className="border p-2">{dayName}</th>
            ))}
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    );
  };

  // Generate chart data from attendanceData
  const chartData = attendanceData
    .filter(record => record.checkIn && record.checkOut)
    .map(record => ({
      name: record.date,
      hours: record.workedHours
    }));

  return (
    <div className="relative min-h-screen w-screen bg-gray-100 flex">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} closeSidebar={closeSidebar} />

      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-0"}`}>
        <TopHeader
          pageTitle="Attendance"
          userName={username}
          profilePic={profilePic}
          toggleSidebar={toggleSidebar}
        />

        <div className="mx-auto mt-6 w-[96%] bg-white shadow-md p-4 rounded-xl border border-gray-300 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-900">
            Welcome Back, {username}! Mark your attendance
          </h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="border border-gray-300 rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow text-center">
              <p className="text-xl font-semibold mb-4">Mark Your Attendance</p>
              {message && <p className="text-green-600 font-medium mb-4">{message}</p>}
                            {error && <p className="text-red-600 font-medium mb-4">{error}</p>}
              <div className="flex flex-col gap-4">
                <button
                  onClick={handleCheckIn}
                  className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={isLoading}
                >
                  Check-In
                </button>
                <button
                  onClick={handleCheckOut}
                  className={`bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={isLoading}
                >
                  Check-Out
                </button>
              </div>
            </div>

            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow">
              <p className="text-xl font-semibold mb-4">Your Attendance Calendar</p>
              {renderCalendar()}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-xl font-semibold mb-4">Attendance Hours Chart</p>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="hours" fill="#60A5FA" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center">No attendance data available for chart.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;

