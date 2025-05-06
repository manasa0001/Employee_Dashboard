
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Leave = () => {
  const [currentTab, setCurrentTab] = useState("request");
  const [employeeName, setEmployeeName] = useState("Manasa");
  const [leaveType, setLeaveType] = useState("Sick Leave");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [about, setAbout] = useState("");
  const [usedLeaves] = useState(7);
  const totalLeaves = 20;

  const [notifications, setNotifications] = useState([]);
  const [unseenCount, setUnseenCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const name = localStorage.getItem("employeeName") || "Manasa";
    setEmployeeName(name);
    fetchNotifications();
  }, []);

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
        text: `
Leave request submitted by ${employeeName}.
Type: ${leaveType}
Dates: ${fromDate} to ${toDate}
Reason: ${about}
Request ID: ${leaveId}
        `,
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

  const boxClasses = "p-6 bg-white rounded shadow-md shadow-blue-200 transition";

  const renderContent = () => {
    switch (currentTab) {
      case "holidays":
        return (
          <div className={boxClasses}>
            <h2 className="text-xl font-bold text-[#233876] mb-4">
              Holiday List — April & May
            </h2>
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
            <h2 className="text-xl font-bold text-[#233876] mb-4">
              Leave Policy & Terms
            </h2>
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
                <button
                  type="submit"
                  className="bg-[#233876] text-white px-4 py-2 rounded"
                >
                  Request
                </button>
              </div>
            </form>
          </div>
        );
    }
  };

  return (
    <div className="bg-[#F5F7FA] min-h-screen p-8 font-sans text-[#1E3A8A]">
      <div className="flex justify-between items-center mb-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold">Leave Management</h1>
        <div
          className="relative cursor-pointer"
          onMouseEnter={() => {
            setShowDropdown(true);
            markAsSeen();
          }}
          onMouseLeave={() => setShowDropdown(false)}
        >
          <span className="text-2xl relative">
            🔔
            {unseenCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5">
                {unseenCount}
              </span>
            )}
          </span>
          {showDropdown && notifications.length > 0 && (
            <div className="absolute right-0 mt-2 bg-white shadow-lg border rounded-md w-72 p-3 z-10">
              <p className="font-bold mb-2">Recent Updates</p>
              <ul className="text-sm space-y-2">
              {notifications.map((note, idx) => (
    <li key={idx}>
      {/* Notification Icon */}
      
      {/* Dynamic message content */}
      {note.message ? (
        note.message
      ) : (
        // Default message if no custom message exists in the database
        `${note.status.charAt(0).toUpperCase() + note.status.slice(1)} ${note.leaveType} on ${new Date(note.date).toLocaleDateString()}`
      )}
      </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded shadow-md shadow-blue-200 mb-6 max-w-7xl mx-auto">
        <p className="font-bold text-lg mb-2">Welcome back, {employeeName}</p>
        <p className="text-sm text-gray-600">
          You have used <strong>{usedLeaves}/{totalLeaves}</strong> leaves so far.
        </p>
      </div>

      <div className="max-w-7xl mx-auto mb-4">
        <div className="flex gap-4">
          {["request", "holidays", "policy"].map((tab) => (
            <button
              key={tab}
              onClick={() => setCurrentTab(tab)}
              className={`px-4 py-2 rounded shadow ${
                currentTab === tab
                  ? "bg-[#233876] text-white"
                  : "bg-white border text-[#233876]"
              }`}
            >
              {tab === "request"
                ? "Leave Request"
                : tab === "holidays"
                ? "List of Holidays"
                : "Leave Policy"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
        <div className="lg:w-2/3">{renderContent()}</div>

        <div className="lg:w-1/3 space-y-6">
          <div className="p-4 bg-white rounded shadow-md shadow-blue-200">
            <h3 className="font-semibold mb-2">Recent Notifications</h3>
            {notifications.length === 0 ? (
              <p className="text-sm text-gray-600">No updates yet.</p>
            ) : (
              notifications.slice(0, 3).map((note, idx) => (
                <div
  key={idx}
  className={`p-2 rounded mb-2 text-sm ${
    note.status === "approved"
      ? "bg-blue-50 text-green-700"
      : note.status === "rejected"
      ? "bg-red-50 text-red-700"
      : "bg-yellow-50 text-yellow-700"
  }`}
>
  
  {note.message}
</div>

              ))
            )}
          </div>

          <div className="p-4 bg-white rounded shadow-md shadow-blue-200">
            <h3 className="font-semibold mb-2">Leave Overview</h3>
            <div className="flex flex-col items-center mb-3">
              <div className="w-24 h-24 rounded-full border-8 border-teal-400 flex flex-col items-center justify-center text-lg font-bold">
                {usedLeaves}
                <span className="text-xs font-normal">leaves taken</span>
              </div>
              <p className="mt-3 text-sm text-center text-gray-600">
                Sick: 2 &nbsp; | &nbsp; Casual: 1 &nbsp; | &nbsp; Paid: 0
              </p>
            </div>
            <div className="text-sm flex justify-between">
              <span>Used — {usedLeaves}</span>
              <span>Remaining — {totalLeaves - usedLeaves}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leave;
