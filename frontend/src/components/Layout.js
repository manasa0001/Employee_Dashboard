
// Layout.js
// Layout.js
import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import TopHeader from "./TopHeader";

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () =>{
    console.log("Toggle sidebar clicked");
   setIsSidebarOpen((prev) => !prev);
  }
  const closeSidebar = () => setIsSidebarOpen(false);

  // Optional: prevent body scroll when sidebar open
  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? "hidden" : "";
  }, [isSidebarOpen]);

  return (
    <div className="relative flex h-screen w-screen bg-gray-100 overflow-hidden">
  
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        closeSidebar={closeSidebar}
      />

      {/* Dim Background when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden"
          onClick={closeSidebar}
        ></div>
      )}

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        {/* Pass toggleSidebar to TopHeader so it can open/close sidebar */}
          <TopHeader pageTitle="Dashboard" toggleSidebar={toggleSidebar} />
<div>{isSidebarOpen ? 'Sidebar is open' : 'Sidebar is closed'}</div>


        <main className="flex-1 overflow-y-auto p-4">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
