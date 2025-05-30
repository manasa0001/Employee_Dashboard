import React, { useEffect,useState } from 'react';
import { Clock, Search } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import TopHeader from "../components/TopHeader";
import Sidebar from "../components/Sidebar";

const Attendance = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [userId, setUserId] = useState(localStorage.getItem("userId") || null);
  const navigate = useNavigate();


  useEffect(() => {
  const username = localStorage.getItem("username");
    const token = localStorage.getItem("token");
    const pic = localStorage.getItem("userPic");

    if (!username || !token) {
      navigate("/", { replace: true });
      return;
    }
    setUserId(userId);
    setUsername(username);
    setProfilePic(pic);
  }, []);

  const getCurrentDate = () => new Date().toISOString().split('T')[0];
  const getCurrentTime = () => new Date().toLocaleTimeString();

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  const handleCheckIn = async () => {
    setIsLoading(true); setMessage(''); setError('');
    try {
      await axios.post('http://localhost:5000/api/attendance/checkin', {
        userId, date: getCurrentDate(), time: getCurrentTime()
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
    setIsLoading(true); setMessage(''); setError('');
    try {
      await axios.post('http://localhost:5000/api/attendance/checkout', {
        userId, date: getCurrentDate(), time: getCurrentTime()
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
    <div className="relative min-h-screen w-screen bg-gray-100 flex">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} closeSidebar={closeSidebar} />

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-0"}`}>
        {/* Top Header */}
         <TopHeader
          pageTitle="Attendance"
          userName={username}
        profilePic={profilePic}
          toggleSidebar={toggleSidebar}
        />
          <div className="mx-auto mt-6 w-[96%] bg-white shadow-md p-4 rounded-xl border border-gray-300 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-900">Welcome! Back {username} Mark our Attendance </h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="border border-gray-300 rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            </div>
            <div className="flex items-center gap-2">
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-8">
          {/* Navigation Links */}


          {/* Check In/Out */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow text-center">
              <p className="text-xl font-semibold mb-4">Mark Your Attendance</p>
              {message && <p className="text-green-600 font-medium mb-4">{message}</p>}
              {error && <p className="text-red-600 font-medium mb-4">{error}</p>}

              <div className="space-y-4">
                <button
                  className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 text-lg rounded-xl w-full disabled:opacity-60"
                  onClick={handleCheckIn}
                  disabled={isLoading}
                >
                  <Clock className="w-5 h-5" />
                  <span>{isLoading ? 'Checking In...' : 'Clock-in'}</span>
                </button>
                <button
                  className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 text-lg rounded-xl w-full disabled:opacity-60"
                  onClick={handleCheckOut}
                  disabled={isLoading}
                >
                  <Clock className="w-5 h-5" />
                  <span>{isLoading ? 'Checking Out...' : 'Clock-out'}</span>
                </button>
              </div>
            </div>

            {/* Calendar */}
            <div className="bg-white p-6 rounded-xl shadow col-span-1">
              <p className="text-lg font-medium mb-4">April 2025</p>
              <div className="grid grid-cols-7 text-center font-semibold mb-2 text-gray-600">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day}>{day}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-gray-700">
                {[...Array(30)].map((_, i) => (
                  <div key={i} className="h-10 flex items-center justify-center border rounded hover:bg-blue-100 cursor-pointer">
                    {i + 1}
                  </div>
                ))}
              </div>
            </div>

            {/* Bar Chart */}
            <div className="bg-white p-6 rounded-xl shadow col-span-1">
              <h2 className="text-lg font-medium mb-4">Weekly Hours Summary</h2>
              <ResponsiveContainer width="100%" height={250}>
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
      </div>
    </div>
  );
};

export default Attendance;
