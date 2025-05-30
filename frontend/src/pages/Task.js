
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaArrowDown } from "react-icons/fa";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";
import TopHeader from "../components/TopHeader";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";

const Task = () => {

  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("All");
  const [searchQuery] = useState("");
  const [expandedTask, setExpandedTask] = useState(null);
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
    fetchTasks();
  }, []);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/tasks");
      console.log("Fetched tasks response:", response.data);
      setTasks(response.data.tasks || []);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setTasks([]);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/tasks/${taskId}`, {
        status: newStatus,
      });
      fetchTasks();
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const handleToggleExpand = (taskId) => {
    setExpandedTask(expandedTask === taskId ? null : taskId);
  };

  const filteredTasks = (tasks || []).filter((task) =>
    filter === "All"
      ? task.title.toLowerCase().includes(searchQuery.toLowerCase())
      : task.status === filter &&
        task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === "Completed").length;
  const todoTasks = tasks.filter((task) => task.status === "To Do").length;
  const inProgressTasks = tasks.filter((task) => task.status === "In Progress").length;

  const pieData = [
    { name: "Completed", value: completedTasks, fill: "#4CAF50" },
    { name: "To Do", value: todoTasks, fill: "#F6A42D" },
    { name: "In Progress", value: inProgressTasks, fill: "#FF9800" },
  ];

  return (
    <div className="min-h-screen w-screen bg-gray-100 p-6 flex">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} closeSidebar={closeSidebar} />

      {/* Main Content with dynamic margin */}
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-0"}`}>
        {/* Top Header */}
        <TopHeader pageTitle="Dashboard" userName={username} profilePic={profilePic} toggleSidebar={toggleSidebar} />

        {/* Welcome Back Text */}
        <div className="flex justify-between items-center mb-6 mt-4 ml-2">
          <h1 className="text-3xl font-bold text-[#233876]">Welcome Back! Manasa</h1>
        </div>

        {/* Main Content Section */}
        <div className="flex">
          {/* Left Section */}
          <div className="w-1/2 pr-6">
            <div className="mb-6">
              <p className="text-lg  font-blue-900 text-gray-600 ml-2 ">Today you have {filteredTasks.length} tasks.</p>
            </div>

            <div className="flex space-x-3 mb-6">
              {["All", "To Do", "In Progress", "Completed"].map((status) => (
                <button
                  key={status}
                  className={`px-4 py-2 rounded-full transition ${
                    filter === status
                      ? "bg-[#233876] text-white"
                      : "border border-[#233876] text-[#233876]"
                  }`}
                  onClick={() => setFilter(status)}
                >
                  {status}
                </button>
              ))}
            </div>

            {/* Task Table */}
            <div className="overflow-x-auto shadow-lg  bg-white border-blue-900 rounded-lg">
              <table className="min-w-full border border-gray-300">
                <thead className="bg-[#233876] text-white">
                  <tr>
                    <th className="py-3 px-4 text-left">Title</th>
                    <th className="py-3 px-4 text-left">Priority</th>
                    <th className="py-3 px-4 text-left">Deadline</th>
                    <th className="py-3 px-4 text-left">Comments</th>
                    <th className="py-3 px-4 text-left">Update</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.map((task) => (
                    <tr key={task._id} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-4">{task.title}</td>
                      <td className="py-2 px-4">{task.priority}</td>
                      <td className="py-2 px-4">{task.deadline}</td>
                      <td className="py-2 px-4">{task.comments || "—"}</td>
                      <td className="py-2 px-4">
                        <button
                          onClick={() => handleToggleExpand(task._id)}
                          className="text-blue-500"
                        >
                          <FaArrowDown className={expandedTask === task._id ? "rotate-180" : ""} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {expandedTask && (
                <div className="mt-4">
                  {tasks
                    .filter((task) => task._id === expandedTask)
                    .map((task) => (
                      <div key={task._id} className="border p-4 rounded-lg shadow-lg">
                        <div className="mb-4">
                          <label className="block text-sm font-semibold text-[#233876]">Status</label>
                          <select
                            className="border px-2 py-1 rounded w-full"
                            value={task.status}
                            onChange={(e) => handleStatusChange(task._id, e.target.value)}
                          >
                            <option value="To Do">To Do</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </div>

                        <h3 className="text-xl font-semibold mb-2">Task Description</h3>
                        <p>{task.description}</p>

                        <h3 className="text-xl font-semibold mt-4">Progress Update</h3>
                        <p>{task.progress}</p>

                        <h3 className="text-xl font-semibold mt-4">File Upload</h3>
                        <input type="file" />
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Section */}
          <div className="w-1/2 pl-6 space-y-6">
            <div className="shadow-xl rounded-lg bg-white shadow border-blue-900 p-4">
              <h2 className="text-xl text-[#233876] font-semibold mb-2">Task Progress</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={60}
                    paddingAngle={5}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Legend
                    verticalAlign="bottom"
                    align="center"
                    iconSize={10}
                    wrapperStyle={{
                      fontSize: "12px",
                      color: "#233876",
                      marginTop: "10px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="shadow-xl bg-white shadow border-blue-900 rounded-lg p-4">
              <h2 className="text-xl text-[#233876] font-semibold mb-2">Recent Activity</h2>
              <ul className="list-disc pl-5">
                <li className="text-gray-600">Task 'Design UI' updated to 'In Progress'</li>
                <li className="text-gray-600">Task 'Research' marked as 'Completed'</li>
                <li className="text-gray-600">Task 'Write Documentation' created</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Task;
