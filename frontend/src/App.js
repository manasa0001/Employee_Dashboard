import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Sidebar from './components/Employee_Components/Sidebar';
import Dashboard from './components/Employee_Components/Dashboard';
import Profile from './components/Employee_Components/Profile';
import EmployeeSecuritySettings from './components/Employee_Components/EmployeeSecuritySettings';
import EmployeeNotificationSettings from './components/Employee_Components/EmployeeNotificationSettings';
import Task from './pages/Task';
import Leave from './pages/Leave';
import Attendance from './pages/Attendance';
import CalendarPage from './pages/CalendarPage';
import EmployeeSettings from './pages/EmployeeSettings';

import Signin from './pages/Signin';
import AdminDashboard from './components/Admin_Components/AdminDashboard';
import aSidebar from './components/Admin_Components/aSidebar';
import aDashboard from './components/Admin_Components/aDashboard';
import Proofile from './components/Admin_Components/aProfile';
import aSignin from './components/Admin_Components/aSignin';
import Client from './components/Admin_Components/aClient';
import EmployeeDashboard from './components/Admin_Components/aEmployeeDashboard';
import AddEmployee from './components/Admin_Components/AddEmployee';
import EmployeeView from './components/Admin_Components/EmployeeView';
import EmployeeEdit from './components/Admin_Components/EmployeeEdit';
import AssignTask from './components/Admin_Components/AssignTask';
import AddProject from './components/Admin_Components/aAddProject';
import Taasks from './components/Admin_Components/aTasks';
import Settings from './components/Admin_Components/aSettings';
import ProfileSettings from './settingsCom/aProfileSettings';
import AccountSettings from './settingsCom/aAccountSettings';
import SecuritySettings from './settingsCom/aSecuritySettings';
import UpdateSecurityQuestions from './settingsCom/UpdateSecurityQuestions';
import ManageDevices from './settingsCom/ManageDevices';
import NotificationSettings from './settingsCom/aNotificationSettings';

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
        {showSidebar &&
  (role === 'admin' ? <aSidebar /> : <Sidebar />)
}

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
            <Route path="/" element={<Dashboard />} />
            <Route path="/proofile" element={<Proofile />} />
            <Route path="/signin" element={<Signin onLogin={handleLogin} />}  />
            <Route path="/clients" element={<Client />} />
            <Route path="/employees" element={<EmployeeDashboard />} />
            <Route path="/employee/add" element={<AddEmployee />} />
            <Route path="/employee/view/:id" element={<EmployeeView />} />
            <Route path="/employee/edit/:id" element={<EmployeeEdit />} />
            <Route path="/employee/assign/:id" element={<AssignTask />} />
            <Route path="/projects" element={<AddProject />} />
            <Route path="/taasks" element={<Taasks />} />
            <Route
  path="/employee/settings"
  element={token && role === 'employee' ? <EmployeeSettings /> : <Navigate to="/" replace />}
/>
            <Route
  path="/settings"
  element={token && role === 'admin' ? <Settings /> : <Navigate to="/" replace />}
/>
<Route
  path="/employee/settings/security"
  element={token && role === 'employee' ? <EmployeeSecuritySettings /> : <Navigate to="/" replace />}
/>
<Route
  path="/employee/settings/notifications"
  element={token && role === 'employee' ? <EmployeeNotificationSettings /> : <Navigate to="/" replace />}
/>
            <Route path="/settings/profile" element={<ProfileSettings />} />
            <Route path="/settings/account" element={<AccountSettings />} />
            <Route path="/settings/security" element={<SecuritySettings />} />
            <Route path="/update-security-questions" element={<UpdateSecurityQuestions />} />
            <Route path="/manage-devices" element={<ManageDevices />} />
            <Route path="/settings/notifications" element={<NotificationSettings />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;