import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import TopHeader from "./aTopHeader";
import Sidebar from "./aSidebar";

const Profile = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const navigate = useNavigate();

  // Initialize user data (same as Dashboard.js)
  React.useEffect(() => {
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

  // Sidebar controls (same as Dashboard.js)
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleNavigate = (path) => {
    try {
      console.log(`Attempting to navigate to: ${path}`);
      navigate(path);
    } catch (error) {
      console.error("Navigation error:", error);
      alert(`Failed to navigate to ${path}`);
    }
  };

  return (
    <div className="relative min-h-screen w-screen bg-white flex">
      {/* Sidebar (identical to Dashboard.js) */}
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        closeSidebar={closeSidebar}
      />

      {/* Main Content Area */}
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-0"}`}>
        {/* Top Header (same as Dashboard.js) */}
        <TopHeader
          pageTitle="Profile"
          userName={username}
          profilePic={profilePic}
          toggleSidebar={toggleSidebar}
        />

        {/* Your Existing Profile Content (now with sidebar-aware spacing) */}
        <div className="flex justify-center mt-28"> {/* Adjusted margin-top */}
          <div className="flex gap-5">
            <button
              onClick={() => handleNavigate("/employees")}
              className="px-5 py-2.5 text-base bg-blue-600 text-white border-none rounded-md cursor-pointer transition-colors hover:bg-blue-700"
            >
              Employees
            </button>
            <button
              onClick={() => handleNavigate("/clients")}
              className="px-5 py-2.5 text-base bg-blue-600 text-white border-none rounded-md cursor-pointer transition-colors hover:bg-blue-700"
            >
              Clients
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;