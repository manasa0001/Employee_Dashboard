
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaBell, FaArrowDown } from "react-icons/fa"; // For the notification icon and arrow
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts"; // For the round progress chart

const Task = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedTask, setExpandedTask] = useState(null); // For expanded task

  useEffect(() => {
    fetchTasks();
  }, []);

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
      fetchTasks(); // Refresh after update
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const handleToggleExpand = (taskId) => {
    setExpandedTask(expandedTask === taskId ? null : taskId); // Toggle task expansion
  };

  const filteredTasks = (tasks || []).filter((task) =>
    filter === "All"
      ? task.title.toLowerCase().includes(searchQuery.toLowerCase())
      : task.status === filter &&
        task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate task completion percentages
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === "Completed").length;
  const todoTasks = tasks.filter((task) => task.status === "To Do").length;
  const inProgressTasks = tasks.filter((task) => task.status === "In Progress").length;

  const completionPercentage = totalTasks ? (completedTasks / totalTasks) * 100 : 0;
  const todoPercentage = totalTasks ? (todoTasks / totalTasks) * 100 : 0;
  const inProgressPercentage = totalTasks ? (inProgressTasks / totalTasks) * 100 : 0;

  // Pie chart data (for progress representation)
  const pieData = [
    { name: "Completed", value: completedTasks, fill: "#4CAF50" },
    { name: "To Do", value: todoTasks, fill: "#F6A42D" },
    { name: "In Progress", value: inProgressTasks, fill: "#FF9800" },
  ];

  return (
    <div className="min-h-screen bg-white p-6 flex flex-col">
      {/* Top Section (Task Dashboard Text, Search Bar, and Notification Icon) */}
      <div className="flex justify-between items-center mb-6">
        {/* Task Dashboard Text */}
        <h1 className="text-3xl font-bold text-[#233876]">Welcome Back! Manasa</h1>

        {/* Search Bar and Notification Icon */}
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-6 py-3 border border-[#233876] rounded-full w-80"
          />
          <FaBell className="text-3xl text-[#233876] ml-2" />
        </div>
      </div>

      {/* Main Content Section */}
      <div className="flex">
        {/* Left Section (Tasks and Filter) */}
        <div className="w-1/2 pr-6">
          <div className="mb-6">
            <p className="text-lg text-gray-600">Today you have {filteredTasks.length} tasks.</p>
          </div>

          {/* Filter Buttons */}
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

          {/* Task Table with Shadow Box */}
          <div className="overflow-x-auto shadow-lg rounded-lg">
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
                        <FaArrowDown
                          className={expandedTask === task._id ? "rotate-180" : ""}
                        />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Expanded Task Details */}
            {expandedTask && (
              <div className="mt-4">
                {tasks
                  .filter((task) => task._id === expandedTask)
                  .map((task) => (
                    <div key={task._id} className="border p-4 rounded-lg shadow-lg">
                      {/* Status Dropdown (after expanding) */}
                      <div className="mb-4">
                        <label className="block text-sm font-semibold text-[#233876]">Status</label>
                        <select
                          className="border px-2 py-1 rounded w-full"
                          value={task.status}
                          onChange={(e) =>
                            handleStatusChange(task._id, e.target.value)
                          }
                        >
                          <option value="To Do">To Do</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </div>

                      {/* Task Description */}
                      <h3 className="text-xl font-semibold mb-2">Task Description</h3>
                      <p>{task.description}</p>

                      {/* Progress Update */}
                      <h3 className="text-xl font-semibold mt-4">Progress Update</h3>
                      <p>{task.progress}</p>

                      {/* File Upload */}
                      <h3 className="text-xl font-semibold mt-4">File Upload</h3>
                      <input type="file" />
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Section (Task Progress and Recent Activity) */}
        <div className="w-1/2 pl-6 space-y-6">
          {/* Task Progress Section */}
          <div className="shadow-xl rounded-lg p-4">
            <h2 className="text-xl text-[#233876] font-semibold mb-2">Task Progress</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={60} // Doughnut chart effect
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

          {/* Recent Activity Section */}
          <div className="shadow-xl rounded-lg p-4">
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
  );
};

export default Task;
