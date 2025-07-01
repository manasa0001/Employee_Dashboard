
import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import TopHeader from '../components/Employee_Components/TopHeader';
import Sidebar from '../components/Employee_Components/Sidebar';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const sampleEvents = [
  { date: '2025-04-10', type: 'Holiday' },
  { date: '2025-04-15', type: 'Meeting' },
];

const latestMeetings = [
  { title: 'Team Sync-up', date: '2025-05-04', time: '10:00 AM' },
  { title: 'Client Presentation', date: '2025-05-05', time: '2:00 PM' },
  { title: 'Product Review', date: '2025-05-06', time: '11:30 AM' },
];

const CalendarView = ({ events }) => {
  const [date, setDate] = useState(new Date());

  const renderTileContent = ({ date }) => {
    const dayEvent = events.find(
      (event) => new Date(event.date).toDateString() === date.toDateString()
    );
    return dayEvent ? (
      <p className="text-xs text-[#233876] font-semibold">{dayEvent.type}</p>
    ) : null;
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 w-full">
      <div className="text-lg font-semibold mb-2 text-center">Calendar</div>
      <Calendar
        value={date}
        onChange={setDate}
        tileContent={renderTileContent}
        className="w-full ml-40"
      />
    </div>
  );
};

const MeetingSchedulerHeader = () => (
  <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
    <button className="px-4 py-2 w-1/2 bg-[#233876] text-white rounded-md hover:bg-blue-900">
      Schedule Meeting
    </button>
    <div className="flex w-full sm:w-[70%] gap-2">
      <input
        type="text"
        placeholder="Search..."
        className="flex-grow px-4 py-2 w-full border border-gray-300 rounded-md shadow-sm"
      />
    </div>
  </div>
);

const SidePanel = () => (
  <div className="w-full bg-white rounded-xl shadow p-4">
    <div className="text-xl font-bold text-gray-800 mb-2">Calendar & Schedule</div>
    <button className="w-full text-left px-4 py-2 rounded-lg bg-purple-100 text-purple-800 hover:brightness-110 font-medium shadow-sm transition mb-2">
      📅 Meetings
    </button>
    <div className="space-y-2 mt-3">
      {latestMeetings.map((meeting, index) => (
        <div key={index} className="bg-gray-100 p-3 rounded-lg shadow-sm">
          <div className="text-sm font-semibold text-gray-800">{meeting.title}</div>
          <div className="text-xs text-gray-600">{meeting.date} • {meeting.time}</div>
        </div>
      ))}
    </div>
  </div>
);

const TaskList = ({ tasks }) => {
  const today = new Date().toISOString().split('T')[0];

  const filteredTasks = tasks.filter(task => {
    const taskDate = new Date(task.deadline);
    const todayDate = new Date(today);
    return taskDate >= todayDate;
  });

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mt-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Today's & Upcoming Tasks</h2>
      {filteredTasks.length === 0 ? (
        <p className="text-gray-500">No upcoming tasks.</p>
      ) : (
        <ul className="space-y-3">
          {filteredTasks.map((task, index) => (
            <li key={index} className="bg-gray-50 border p-4 rounded-lg shadow-sm">
              <p className="text-lg font-medium text-gray-800">{task.title || task.task}</p>
              <p className="text-sm text-gray-600">Due: {new Date(task.deadline).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const CalendarPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [userId, setUserId] = useState(localStorage.getItem("userId") || null);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const username = localStorage.getItem("username");
    const token = localStorage.getItem("token");
    const pic = localStorage.getItem("userPic");

    if (!username || !token || !userId) {
      navigate("/", { replace: true });
      return;
    }

    setUsername(username);
    setProfilePic(pic);
    fetchTasks(userId);
  }, []);

  const fetchTasks = async (userId) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/tasks?userId=${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks(response.data || []);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError("Failed to fetch tasks. Please try again.");
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="min-h-screen w-screen bg-gray-100 flex">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} closeSidebar={closeSidebar} />
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <TopHeader pageTitle="Calendar" userName={username} profilePic={profilePic} toggleSidebar={toggleSidebar} />
        <div className="max-w-7xl mx-auto p-4 sm:p-6">
          <MeetingSchedulerHeader />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-4">
              <CalendarView events={sampleEvents} />
            </div>
            <div>
              <SidePanel />
            </div>
          </div>
          {isLoading ? (
            <p className="text-gray-500 mt-4">Loading tasks...</p>
          ) : (
            <TaskList tasks={tasks} />
          )}
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
