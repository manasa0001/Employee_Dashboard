// Dashboard.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TopHeader from "./aTopHeader";
import Sidebar from "./aSidebar";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const [date, setDate] = useState(new Date());
  const [username, setUsername] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const username = localStorage.getItem("username");
    const token = localStorage.getItem("token");
    const pic = localStorage.getItem("userPic");

    if (!username || !token) {
      navigate("/", { replace: true });
      return;
    }
    setUsername(username);
    setProfilePic(pic);
  }, [navigate]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const onDateChange = (newDate) => {
    setDate(newDate);
  };

  const attendanceData = [
    { month: "Jan", attendance: 20 },
    { month: "Feb", attendance: 18 },
    { month: "Mar", attendance: 22 },
    { month: "Apr", attendance: 19 },
    { month: "May", attendance: 21 },
    { month: "Jun", attendance: 23 },
    { month: "Jul", attendance: 20 },
    { month: "Aug", attendance: 24 },
    { month: "Sep", attendance: 18 },
    { month: "Oct", attendance: 21 },
    { month: "Nov", attendance: 19 },
    { month: "Dec", attendance: 22 },
  ];

  return (
    <div className="relative min-h-screen w-screen bg-white flex">
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        closeSidebar={closeSidebar}
      />

      <div
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        <TopHeader
          pageTitle="Dashboard"
          userName={username}
          profilePic={profilePic}
          toggleSidebar={toggleSidebar}
        />

        <p className="text-2xl font-bold text-gray-700 mt-4 pl-8 ml-40">
          {username ? `Welcome! ${username}` : "Welcome!"}
        </p>

        <div className="mt-8 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 w-full">
            <div className="w-3/4 ml-44 bg-blue-100 p-8 rounded-lg shadow-lg shadow-blue-900 border-blue-900">
              <h3 className="text-2xl font-semibold mb-6">Task Summary</h3>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-md border border-blue-300">
                  <h4 className="text-lg font-semibold">Task 1</h4>
                  <p>Status: In Progress</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md border border-blue-200">
                  <h4 className="text-lg font-semibold">Task 2</h4>
                  <p>Status: Completed</p>
                </div>
              </div>
            </div>

            <div className="w-3/4 mr-44 bg-yellow-100 p-8 rounded-lg shadow-lg shadow-blue-300">
              <h3 className="text-2xl font-semibold mb-6">Notifications</h3>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-md border border-blue-200">
                  <p>You have a meeting scheduled at 3 PM today.</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md border border-blue-200">
                  <p>Your task 'Task 1' has been updated.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 w-full">
            <div className="w-3/4 ml-44 bg-green-100 p-8 rounded-lg shadow-lg shadow-blue-300">
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

            <div className="w-3/4 mr-44 bg-blue-100 p-8 rounded-lg shadow-lg shadow-blue-300">
              <h3 className="text-2xl font-semibold mb-6">Live Calendar</h3>
              <Calendar
                onChange={onDateChange}
                value={date}
                className="w-full p-4 rounded-lg shadow-md border"
              />
              <p className="mt-4 text-black">
                Selected Date: {date.toDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
