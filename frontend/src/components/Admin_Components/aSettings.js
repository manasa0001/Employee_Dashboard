import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from "./aSidebar";
import TopHeader from "./aTopHeader";

function Settings() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [profilePic, setProfilePic] = useState("");

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // Initialize user data
  React.useEffect(() => {
    const username = localStorage.getItem("username");
    const token = localStorage.getItem("token");
    const pic = localStorage.getItem("userPic");

    if (username && token) {
      setUsername(username);
      setProfilePic(pic || "");
    }
  }, []);

  return (
    <div className="relative min-h-screen w-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        closeSidebar={closeSidebar}
      />

      {/* Main Content Area */}
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-0"}`}>
        {/* Top Header */}
        <TopHeader
          pageTitle="Settings"
          userName={username}
          profilePic={profilePic}
          toggleSidebar={toggleSidebar}
        />

        {/* Settings Content */}
        <div className="flex-1 p-8 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Settings</h1>
            
            <div className="space-y-6">
              <div 
                className="flex items-center justify-between p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate('/settings/profile')}
              >
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-1">Profile Settings</h3>
                  <p className="text-gray-600">Manage profile information</p>
                </div>
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                  Edit
                </button>
              </div>
              
              <div 
                className="flex items-center justify-between p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate('/settings/account')}
              >
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-1">Account Settings</h3>
                  <p className="text-gray-600">Configure account preferences</p>
                </div>
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                  Edit
                </button>
              </div>
              
              <div 
                className="flex items-center justify-between p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate('/settings/security')}
              >
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-1">Security Settings</h3>
                  <p className="text-gray-600">Update security options</p>
                </div>
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                  Manage
                </button>
              </div>
              
              <div 
                className="flex items-center justify-between p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate('/settings/notifications')}
              >
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-1">Notification Settings</h3>
                  <p className="text-gray-600">Set up notification preferences</p>
                </div>
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
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

export default Settings;