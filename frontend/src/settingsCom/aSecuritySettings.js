import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from "../components/Admin_Components/aSidebar";
import TopHeader from "../components/Admin_Components/aTopHeader";

function SecuritySettings() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // Initialize user data
  useEffect(() => {
    const username = localStorage.getItem("username");
    const token = localStorage.getItem("token");
    const pic = localStorage.getItem("userPic");

    if (username && token) {
      setUsername(username);
      setProfilePic(pic || "");
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleEnable2FA = () => {
    setTwoFactorEnabled(true);
    alert("Two-Factor Authentication has been enabled.");
  };

  const handleLogoutDevice = (deviceName) => {
    alert(`${deviceName} has been logged out.`);
  };

  const handleUpdateSecurityQuestions = () => {
    navigate("/update-security-questions");
  };
  const handleManageDevices = () => {
    navigate("/manage-devices");
};

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
          pageTitle="Security Settings"
          userName={username}
          profilePic={profilePic}
          toggleSidebar={toggleSidebar}
        />

        {/* Security Settings Content */}
        <div className="flex-1 p-8 bg-gray-50">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Security Settings</h2>
            <p className="text-gray-600 mb-6">Update your security options here</p>

            <div className="space-y-6">
              {/* Two-Factor Authentication Section */}
              <div className="p-6 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Two-Factor Authentication</h3>
                  <button
                    onClick={handleEnable2FA}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    {twoFactorEnabled ? "Enabled" : "Enable"}
                  </button>
                </div>
                <p className="text-gray-600">
                  Add an extra layer of security to your account by enabling two-factor authentication.
                </p>
              </div>

              {/* Login Activity Section */}
              <div className="p-6 border border-gray-200 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Login Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium">Chrome on Windows</p>
                      <p className="text-sm text-gray-500">Addagutta, HYD • Today at 10:30 AM</p>
                    </div>
                    <button
                      onClick={() => handleLogoutDevice("Chrome on Windows")}
                      className="text-red-500 hover:text-red-700"
                    >
                      Log out
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium">Safari on iPhone</p>
                      <p className="text-sm text-gray-500">GandiMysamma, HYD • Yesterday at 5:45 PM</p>
                    </div>
                    <button
                      onClick={() => handleLogoutDevice("Safari on iPhone")}
                      className="text-red-500 hover:text-red-700"
                    >
                      Log out
                    </button>
                  </div>
                </div>
              </div>

              {/* Security Questions Section */}
              <div className="p-6 border border-gray-200 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Security Questions</h3>
                <button
                  onClick={handleUpdateSecurityQuestions}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Update Security Questions
                </button>
              </div>

              {/* Connected Devices Section */}
              <div className="p-6 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Connected Devices</h3>
                  <button
                    onClick={handleManageDevices}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Manage Devices
                  </button>
                </div>
                <p className="text-gray-600">
                  View and manage all devices currently connected to your account.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SecuritySettings;
