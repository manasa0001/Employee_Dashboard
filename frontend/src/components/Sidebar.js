
// Sidebar.jsx (as you provided, no changes)
import React from "react";
import {
  FaHome,
  FaCalendarAlt,
  FaClock,
  FaHouseUser,
  FaTasks,
  FaTools,
  FaUser,
  FaSignOutAlt,
  FaBars,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const Sidebar = ({ isOpen, toggleSidebar, closeSidebar }) => {
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem("userRole")?.toLowerCase() === "admin";
  const dashboardLink = isAdmin ? "/admin/dashboard" : "/employee/dashboard";

  const handleSignout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <>
      {/* Hamburger icon visible only on small screens */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 bg-blue-800 text-white p-2 rounded md:hidden"
      >
        <FaBars size={20} />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen bg-blue-950 text-white z-40 transition-all duration-300 ease-in-out ${
          isOpen ? "w-64" : "w-0"
        } overflow-hidden`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-blue-800">
          <h2 className="text-xl font-bold truncate">{isAdmin ? "Admin" : "Employee"}</h2>
        </div>

        {/* Links */}
        <div className="flex flex-col justify-between h-[calc(100%-4rem)] p-4">
          <ul className="space-y-4 text-lg">
            <SidebarLink to={dashboardLink} icon={<FaHome />} label="Dashboard" closeSidebar={closeSidebar} />
            <SidebarLink to="/profile" icon={<FaUser />} label="Profile" closeSidebar={closeSidebar} />
            <SidebarLink to="/calendar" icon={<FaCalendarAlt />} label="Calendar" closeSidebar={closeSidebar} />
            <SidebarLink to="/attendance" icon={<FaClock />} label="Attendance" closeSidebar={closeSidebar} />
            <SidebarLink to="/leave" icon={<FaHouseUser />} label="Leave" closeSidebar={closeSidebar} />
            <SidebarLink to="/tasks" icon={<FaTasks />} label="Tasks" closeSidebar={closeSidebar} />
            <SidebarLink to="/settings" icon={<FaTools />} label="Settings" closeSidebar={closeSidebar} />
          </ul>

          {/* Sign Out */}
          <div className="mt-6">
            <button
              onClick={handleSignout}
              className="flex items-center gap-3 bg-red-600 hover:bg-red-700 px-4 py-2 rounded w-full text-white font-medium mb-6"
            >
              <FaSignOutAlt /> Sign Out
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const SidebarLink = ({ to, icon, label, closeSidebar }) => (
  <li>
    <Link
      to={to}
      onClick={closeSidebar}
      className="flex items-center gap-3 hover:bg-blue-800 p-2 rounded text-white text-lg font-medium no-underline transition-colors duration-200"
    >
      {icon}
      <span>{label}</span>
    </Link>
  </li>
);

export default Sidebar;
