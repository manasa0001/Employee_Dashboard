import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopHeader from '../components/Employee_Components/TopHeader';
import Sidebar from '../components/Employee_Components/Sidebar';

function EmployeeSettings() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [profilePic, setProfilePic] = useState('');

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  useEffect(() => {
    const name = localStorage.getItem('username');
    const pic = localStorage.getItem('userPic');
    if (name) setUsername(name);
    if (pic) setProfilePic(pic);
  }, []);

  return (
    <div className="  relative min-h-screen w-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        closeSidebar={closeSidebar}
      />

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <TopHeader
          pageTitle="Settings"
          userName={username}
          profilePic={profilePic}
          toggleSidebar={toggleSidebar}
        />

        <div className="flex-1 p-8 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Employee Settings</h1>

            <div className="space-y-6">
              {/* Security Settings */}
              <div
                className="flex items-center justify-between p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate('/employee/settings/security')}
              >
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-1">Security Settings</h3>
                  <p className="text-gray-600">Change your password or secure account</p>
                </div>
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                  Manage
                </button>
              </div>

              {/* Notification Settings */}
              <div
                className="flex items-center justify-between p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate('/employee/settings/notifications')}
              >
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-1">Notification Settings</h3>
                  <p className="text-gray-600">Customize your notification preferences</p>
                </div>
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeSettings;
