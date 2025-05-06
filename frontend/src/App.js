
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import Signin from './components/Signin';
import Task from './pages/Task';
import Leave from './pages/Leave';
import Attendance from './pages/Attendance';
import CalendarPage from './pages/CalendarPage';

function App() {
  return (
    <Router>
      <div className="d-flex">
        <Sidebar />
        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/tasks" element={<Task />} />
            <Route path="/leave" element={<Leave />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/calendar" element={<CalendarPage />} />
          </Routes> {/* <-- This was missing */}
        </div>
      </div>
    </Router>
  );
}

export default App;
