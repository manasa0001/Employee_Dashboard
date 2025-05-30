
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import Task from './pages/Task';
import Leave from './pages/Leave';
import Attendance from './pages/Attendance';
import CalendarPage from './pages/CalendarPage';
import Signin from './pages/Signin';
import AdminDashboard from './components/AdminDashboard';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [role, setRole] = useState(localStorage.getItem('userRole')?.toLowerCase());

  // 🔑 Handle login and update state
  const handleLogin = (newToken, newRole) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('userRole', newRole);
    setToken(newToken);
    setRole(newRole.toLowerCase());
  };

  const showSidebar = !!token;

  return (
    <Router>
      <div className="d-flex">
        {showSidebar && <Sidebar />}

        <div className="container mt-4" style={{ flex: 1 }}>
          <Routes>
            <Route
              path="/"
              element={
                !token ? (
                  <Signin onLogin={handleLogin} />
                ) : role === 'admin' ? (
                  <Navigate to="/admin/dashboard" replace />
                ) : (
                  <Navigate to="/employee/dashboard" replace />
                )
              }
            />
            <Route
              path="/employee/dashboard"
              element={
                token && role === 'employee' ? (
                  <Dashboard />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                token && role === 'admin' ? (
                  <AdminDashboard />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route path="/profile" element={token ? <Profile /> : <Navigate to="/" replace />} />
            <Route path="/tasks" element={token ? <Task /> : <Navigate to="/" replace />} />
            <Route path="/leave" element={token ? <Leave /> : <Navigate to="/" replace />} />
            <Route path="/attendance" element={token ? <Attendance /> : <Navigate to="/" replace />} />
            <Route path="/calendar" element={token ? <CalendarPage /> : <Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
