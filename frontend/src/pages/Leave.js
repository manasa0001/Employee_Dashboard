


import React, { useEffect, useState } from "react";
import TopHeader from "../components/TopHeader";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Leave = () => {

  const [currentTab, setCurrentTab] = useState("request");
  const [leaveType, setLeaveType] = useState("Sick Leave");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [about, setAbout] = useState("");
  const [usedLeaves] = useState(7);
  const totalLeaves = 20;
const [employeeName, setEmployeeName] = useState("Manasa");
  const [notifications, setNotifications] = useState([]);
  const [unseenCount, setUnseenCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [username, setUsername] = useState("");
    const [profilePic, setProfilePic] = useState("");
    const [userId, setUserId] = useState(localStorage.getItem("userId") || null);
const navigate = useNavigate();


  useEffect(() => {
    const username = localStorage.getItem("username");
    const token = localStorage.getItem("token");
    const pic = localStorage.getItem("userPic");

    if (!username || !token) {
      navigate("/", { replace: true });
      return;
    }
    setUserId(userId);
    setUsername(username);
    setProfilePic(pic);
    fetchNotifications();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const fetchNotifications = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/leaves/notifications");
      const recent = res.data.filter((note) => {
        const time = new Date(note.createdAt || note.date).getTime();
        return Date.now() - time <= 24 * 60 * 60 * 1000;
      });
      setNotifications(recent);
      setUnseenCount(recent.filter((n) => !n.seen).length);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const markAsSeen = async () => {
    try {
      if (unseenCount > 0) {
        await axios.put("http://localhost:5000/api/leaves/notifications/mark-seen");
        fetchNotifications();
      }
    } catch (error) {
      console.error("Error marking notifications as seen:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (new Date(fromDate) > new Date(toDate)) {
      toast.error("From Date cannot be after To Date.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/leaves/request", {
        employeeName,
        leaveType,
        fromDate,
        toDate,
        about,
      });
      const leaveId = res.data.leaveId;

      await axios.post("http://localhost:5000/api/leaves/send-email", {
        to: "muthaipallymanasa001@gmail.com",
        subject: `Leave Request from ${employeeName}`,
        text: `Leave request submitted by ${employeeName}.\nType: ${leaveType}\nDates: ${fromDate} to ${toDate}\nReason: ${about}\nRequest ID: ${leaveId}`,
        employeeName,
        leaveType,
        fromDate,
        toDate,
        about,
        leaveId,
      });

      alert("Leave request submitted and email sent!");
      setLeaveType("Sick Leave");
      setFromDate("");
      setToDate("");
      setAbout("");
      fetchNotifications();
    } catch (error) {
      console.error("Error submitting request:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const boxClasses = "p-6 w-max-screen h-min-screen bg-white rounded shadow-md shadow-blue-200 transition";

  const renderContent = () => {
    switch (currentTab) {
      case "holidays":
        return (
          <div className={boxClasses}>
            <h2 className="text-xl font-bold text-[#233876] mb-4">Holiday List — April & May</h2>
            <ul className="list-disc pl-5 text-gray-700 space-y-2 text-sm">
              <li>14 April — Ambedkar Jayanti</li>
              <li>21 April — Mahavir Jayanti</li>
              <li>1 May — Labour Day</li>
              <li>23 May — Buddha Purnima</li>
            </ul>
          </div>
        );
      case "policy":
        return (
          <div className={boxClasses}>
            <h2 className="text-xl font-bold text-[#233876] mb-4">Leave Policy & Terms</h2>
            <ul className="list-disc pl-5 text-gray-700 space-y-2 text-sm">
              <li>20 annual leaves allowed per year.</li>
              <li>Apply at least 2 days in advance.</li>
              <li>Medical certificate required for &gt;2 sick leaves.</li>
              <li>No carry‑over of unused leaves.</li>
              <li>Manager approval mandatory.</li>
            </ul>
          </div>
        );
      default:
        return (
          <div className={boxClasses}>
            <h2 className="text-xl font-bold text-[#233876] mb-4">Leave Request</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-medium mb-1">Employee Name</label>
                <input
                  type="text"
                  value={employeeName}
                  onChange={(e) => setEmployeeName(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Leave Type</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                >
                  <option>Sick Leave</option>
                  <option>Casual Leave</option>
                  <option>Paid Leave</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-1">From</label>
                  <input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">To</label>
                  <input
                    type="date"
                    min={fromDate || new Date().toISOString().split("T")[0]}
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block font-medium mb-1">About</label>
                <textarea
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  rows={3}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Reason for leave"
                  required
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setLeaveType("Sick Leave");
                    setFromDate("");
                    setToDate("");
                    setAbout("");
                  }}
                  className="bg-gray-200 px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button type="submit" className="bg-[#233876] text-white px-4 py-2 rounded">
                  Request
                </button>
              </div>
            </form>
          </div>
        );
    }
  };

  return (
    <div className="fixed bg-[#F5F7FA] min-h-screen w-screen p-4 font-sans text-[#1E3A8A] relative">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} closeSidebar={closeSidebar} />

      {/* Top Header */}
      <div className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
        <div className={`transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-0"}`}>
          <TopHeader
            pageTitle="Leave Management"
            userName={username}
            profilePic={profilePic}
            toggleSidebar={toggleSidebar}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-24 transition-all duration-300">
        <div className={`transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-0"} px-6`}>
          {/* Used Leaves Heading */}
          <div className="mb-6 text-center text-lg font-semibold text-[#1E3A8A]">
            Used Leaves: {usedLeaves} / {totalLeaves}
          </div>

          {/* Tab Buttons */}
          <div className="mb-4 flex gap-4">
            <button
              className={`px-4 py-2 rounded ${currentTab === "request" ? "bg-[#233876] text-white" : "bg-gray-200"}`}
              onClick={() => setCurrentTab("request")}
            >
              Leave Request
            </button>
            <button
              className={`px-4 py-2 rounded ${currentTab === "holidays" ? "bg-[#233876] text-white" : "bg-gray-200"}`}
              onClick={() => setCurrentTab("holidays")}
            >
              Holidays
            </button>
            <button
              className={`px-4 py-2 rounded ${currentTab === "policy" ? "bg-[#233876] text-white" : "bg-gray-200"}`}
              onClick={() => setCurrentTab("policy")}
            >
              Leave Policy
            </button>
          </div>

          {/* Render Section */}
          {renderContent()}
        </div>
      </div>

      {/* Notification Bell */}
      <div className="fixed top-4 right-8 z-50">
        <button
          onClick={() => {
            setShowDropdown(!showDropdown);
            markAsSeen();
          }}
          className="relative p-2 rounded-full bg-[#233876] text-white hover:bg-[#1e2c72]"
        >
          🔔
          {unseenCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {unseenCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default Leave;
