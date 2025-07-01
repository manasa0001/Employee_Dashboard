import React, { useState, useEffect } from 'react';
import Sidebar from "../components/Admin_Components/aSidebar";
import TopHeader from "../components/Admin_Components/aTopHeader";

function ManageDevices() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [devices, setDevices] = useState([
    { id: 1, name: 'Chrome on Windows', location: 'HYD', time: 'Today 10:30 AM' },
    { id: 2, name: 'Safari on iPhone', location: 'HYD', time: 'Yesterday 5:45 PM' }
  ]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  useEffect(() => {
    setUsername(localStorage.getItem("username") || "");
    setProfilePic(localStorage.getItem("userPic") || "");
  }, []);

  const handleLogoutDevice = (id) => {
    setDevices(devices.filter(device => device.id !== id));
    alert('Device logged out successfully!');
  };

  return (
    <div className="relative min-h-screen w-screen bg-gray-50 flex">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} closeSidebar={closeSidebar} />
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-0"}`}>
        <TopHeader pageTitle="Manage Devices" userName={username} profilePic={profilePic} toggleSidebar={toggleSidebar} />
        <div className="p-8 bg-gray-50">
          <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Manage Devices</h2>
            <p className="text-gray-600 mb-6">See and manage devices connected to your account.</p>
            <div className="space-y-4">
              {devices.map((device) => (
                <div key={device.id} className="flex justify-between items-center bg-gray-50 p-4 rounded">
                  <div>
                    <p className="font-medium">{device.name}</p>
                    <p className="text-sm text-gray-500">{device.location} • {device.time}</p>
                  </div>
                  <button onClick={() => handleLogoutDevice(device.id)} className="text-red-500 hover:text-red-700">Log out</button>
                </div>
              ))}
              {devices.length === 0 && <p className="text-gray-500">No active devices.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageDevices;
