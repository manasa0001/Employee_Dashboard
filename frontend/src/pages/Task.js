
  import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaArrowDown, FaTrash, FaPaperclip, FaCheckCircle, FaTimes, FaImage } from "react-icons/fa";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer, Tooltip } from "recharts";
import TopHeader from "../components/TopHeader";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Task = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedTask, setExpandedTask] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null); // For enlarged view
const [isModalOpen, setIsModalOpen] = useState(false); // For modal control
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [recentActivity, setRecentActivity] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const username = localStorage.getItem("username");
    const token = localStorage.getItem("token");
    const pic = localStorage.getItem("userPic");

    if (!username || !token || !storedUserId) {
      navigate("/", { replace: true });
      return;
    }
    
    setUserId(storedUserId);
    setUsername(username);
    setProfilePic(pic);
    fetchTasks(storedUserId);
    fetchRecentActivity(storedUserId);
  }, []);

  const fetchTasks = async (userId) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/tasks?userId=${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks(response.data || []);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError("Failed to fetch tasks. Please try again.");
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRecentActivity = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/tasks/activity?userId=${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRecentActivity(response.data || []);
    } catch (err) {
      console.error("Error fetching recent activity:", err);
      setRecentActivity([]);
    }
  };
  const handleAddComment = async (taskId) => {
    if (!newComment.trim()) return;
    
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/api/tasks/${taskId}/comments`,
        { 
          text: newComment,
          user: username,
          userId: userId // Include userId for activity tracking
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewComment("");
      await fetchTasks(userId);
      await fetchRecentActivity(userId);
      toast.success("Comment added successfully!", {
        position: "bottom-left",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (err) {
      console.error("Error adding comment:", err);
      setError("Failed to add comment");
      toast.error("Failed to add comment", {
        position: "bottom-left",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(
      `http://localhost:5000/api/tasks/${taskId}/status`,
      { 
        status: newStatus,
        userId: userId // Make sure to include userId
      },
      { 
        headers: { Authorization: `Bearer ${token}` } 
      }
    );
    
    // Update local state immediately for better UX
    setTasks(tasks.map(task => 
      task._id === taskId ? { ...task, status: newStatus } : task
    ));
    
    // Show success message
    toast.success(`Status updated to ${newStatus}!`);
    
    // Optionally refresh data from server
    await fetchTasks(userId);
    
  } catch (err) {
    console.error("Status update error:", err.response?.data || err.message);
    toast.error(
      err.response?.data?.message || "Failed to update status",
      { position: "bottom-left" }
    );
  }
};

  const handleFileUpload = async (taskId, file) => {
  if (!file) {
    toast.error("No file selected.");
    return;
  }

  const allowedTypes = [
    "image/jpeg", "image/png", "image/jpg",
    "application/pdf", "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ];
  const maxSize = 5 * 1024 * 1024;

  if (!allowedTypes.includes(file.type)) {
    toast.error("Invalid file type. Allowed: Images, PDF, Word.");
    return;
  }

  if (file.size > maxSize) {
    toast.error("File size exceeds 5MB limit.");
    return;
  }

  try {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userId);
    formData.append("filename", file.name); // for activity

    await axios.post(
      `http://localhost:5000/api/tasks/${taskId}/attachments`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      }
    );

    await fetchTasks(userId);
    await fetchRecentActivity(userId);
    toast.success("File uploaded successfully!", {
      position: "bottom-left"
    });
  } catch (err) {
    console.error("Error uploading file:", err);
    toast.error("Failed to upload file", {
      position: "bottom-left"
    });
  }
};


  const handleDeleteAttachment = async (taskId, fileUrl) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:5000/api/tasks/${taskId}/attachments`,
        { 
          headers: { Authorization: `Bearer ${token}` },
          data: { fileUrl,userId }
        }
      );
      await fetchTasks(userId);
      await fetchRecentActivity(userId);
      toast.success("Attachment deleted successfully!", {
        position: "bottom-left",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (err) {
      console.error("Error deleting attachment:", err);
      toast.error("Failed to delete attachment", {
        position: "bottom-left",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const confirmDeleteAttachment = (taskId, fileUrl) => {
    toast.info(
      <div>
        <p>Are you sure you want to delete this attachment?</p>
        <div className="flex justify-end gap-2 mt-2">
          <button 
            onClick={() => {
              toast.dismiss();
              handleDeleteAttachment(taskId, fileUrl);
            }}
            className="px-3 py-1 bg-red-500 text-white rounded"
          >
            Delete
          </button>
          <button 
            onClick={() => toast.dismiss()}
            className="px-3 py-1 bg-gray-300 rounded"
          >
            Cancel
          </button>
        </div>
      </div>,
      {
        position: "bottom-left",
        autoClose: false,
        closeButton: false,
        draggable: false,
      }
    );
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:5000/api/tasks/${taskId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchTasks(userId);
      await fetchRecentActivity(userId);
      toast.success("Task deleted successfully!", {
        position: "bottom-left",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (err) {
      console.error("Error deleting task:", err);
      setError("Failed to delete task");
      toast.error("Failed to delete task", {
        position: "bottom-left",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const confirmDeleteTask = (taskId) => {
    toast.info(
      <div>
        <p>Are you sure you want to delete this task?</p>
        <div className="flex justify-end gap-2 mt-2">
          <button 
            onClick={() => {
              toast.dismiss();
              handleDeleteTask(taskId);
            }}
            className="px-3 py-1 bg-red-500 text-white rounded"
          >
            Delete
          </button>
          <button 
            onClick={() => toast.dismiss()}
            className="px-3 py-1 bg-gray-300 rounded"
          >
            Cancel
          </button>
        </div>
      </div>,
      {
        position: "bottom-left",
        autoClose: false,
        closeButton: false,
        draggable: false,
      }
    );
  };

  const filteredTasks = tasks.filter((task) =>
    filter === "All"
      ? task.title.toLowerCase().includes(searchQuery.toLowerCase())
      : task.status === filter &&
        task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Statistics for pie chart
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "Completed").length;
  const todoTasks = tasks.filter((t) => t.status === "To Do").length;
  const inProgressTasks = tasks.filter((t) => t.status === "In Progress").length;

  const pieData = [
    { name: "Completed", value: completedTasks, color: "#1E88E5" },
    { name: "To Do", value: todoTasks, color: "#42A5F5" },
    { name: "In Progress", value: inProgressTasks, color: "#90CAF9" },
  ];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        style={{ fontSize: '12px', fontWeight: 'bold' }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const renderTaskStatistics = () => {
    const total = tasks.length;
    const completedPercent = total > 0 ? Math.round((completedTasks / total) * 100) : 0;
    const inProgressPercent = total > 0 ? Math.round((inProgressTasks / total) * 100) : 0;
    const todoPercent = total > 0 ? Math.round((todoTasks / total) * 100) : 0;

    return (
      <div className="bg-white p-6 rounded-lg shadow h-[450px]">
        <h2 className="text-xl font-semibold text-[#233876] mb-4">Task Statistics</h2>
        
        {/* Count row */}
        <div className="flex justify-between mb-6">
          <div className="text-center">
            <p className="text-4xl font-bold text-[#233876]">{total}</p>
            <p className="text-gray-600">Total Tasks</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-[#1E88E5]">{completedTasks}</p>
            <p className="text-gray-600">Completed</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-[#42A5F5]">{inProgressTasks}</p>
            <p className="text-gray-600">In Progress</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-[#90CAF9]">{todoTasks}</p>
            <p className="text-gray-600">To Do</p>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                innerRadius={60}
                label={renderCustomizedLabel}
                labelLine={false}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name, props) => [
                  `${value} (${(props.payload.percent * 100).toFixed(1)}%)`,
                  name
                ]}
              />
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{ paddingTop: '20px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

 const isImageFile = (filename) => {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
  return imageExtensions.some(ext => filename.toLowerCase().endsWith(ext));
};

  const renderAttachments = (task) => (
  <div>
    <h4 className="font-medium text-gray-700">Attachments</h4>
    <div className="mt-2 space-y-3">
      {task.attachments?.length > 0 ? (
        task.attachments.map((file, index) => {
  const filename = file.split("/").pop();
  const fullImageUrl = file.startsWith("http")
    ? file
    : `http://localhost:5000${file}`; // ✅ Prepend URL if not full

          return (
  <div key={index} className="relative flex flex-col bg-gray-50 p-3 rounded">
    <div className="flex items-center">
      {isImageFile(filename) ? (
        <FaImage className="mr-2 text-gray-500 text-lg" />
      ) : (
        <FaPaperclip className="mr-2 text-gray-500 text-lg" />
      )}
      {isImageFile(filename) ? (
        <span className="text-blue-500">{filename}</span>
      ) : (
        <a
          href={fullImageUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          {filename}
        </a>
      )}
    </div>
              {isImageFile(filename) && (
      <div className="mt-2 relative group">
        <img
          src={fullImageUrl}
          alt="Attachment"
          className="max-h-40 max-w-full rounded border border-gray-200 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => {
            setSelectedImage(fullImageUrl);
            setIsModalOpen(true);
          }}
        />

                  <button
          onClick={() => {
            if (window.confirm("Are you sure you want to delete this image?")) {
              handleDeleteAttachment(task._id, file);
            }
          }}
          className="absolute top-2 right-2 text-white bg-red-500 hover:bg-red-600 p-1 rounded-full z-10"
          title="Delete image"
        >
          <FaTimes />
        </button>
      </div>
    )}
  </div>
);
        })
      ) : (
        <p className="text-gray-500">No attachments</p>
      )}
    </div>

    {/* Image Modal */}
    {isModalOpen && (
      <div
        className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
        onClick={() => setIsModalOpen(false)}
      >
        <div
          className="relative max-w-full max-h-full"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="absolute top-2 right-2 text-white bg-red-500 rounded-full p-2 z-10"
            onClick={() => setIsModalOpen(false)}
          >
            <FaTimes />
          </button>
          <img
            src={selectedImage}
            alt="Enlarged preview"
            className="max-w-[90vw] max-h-[90vh] object-contain"
          />
          <div className="absolute bottom-4 left-0 right-0 flex justify-center">
            <a
              href={selectedImage}
              download
              className="bg-[#233876] text-white px-4 py-2 rounded hover:bg-[#1a2a5f] transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              Download
            </a>
          </div>
        </div>
      </div>
    )}

    {/* File Upload Section */}
    <div className="mt-3">
      <label className="block font-medium text-gray-700 mb-1">
        Upload New Attachment
      </label>
      <input
        type="file"
        onChange={(e) => handleFileUpload(task._id, e.target.files[0])}
        className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded file:border-0
          file:text-sm file:font-semibold
          file:bg-[#233876] file:text-white
          hover:file:bg-[#1a2a5f]"
      />
    </div>
  </div>
);

  const renderRecentActivity = () => (
  <div className="bg-white p-6 rounded-lg shadow">
    <h2 className="text-xl font-semibold text-[#233876] mb-4">Recent Activity</h2>
    <div className="space-y-4">
      {recentActivity.length > 0 ? (
        recentActivity.slice(0, 10).map((activity, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              <div className="h-2 w-2 rounded-full bg-blue-500"></div>
            </div>
            <div>
              <p className="text-gray-800">
                <span className="font-semibold">{activity.user}</span>{" "}
                {activity.action === "status_update"
  ? `changed status to ${activity.newStatus}`
  : activity.action === "comment_added"
  ? `added a comment`
  : activity.action === "file_upload"
  ? `uploaded a file: ${activity.filename || "unnamed"}`
  : activity.action === "file_delete"
  ? `deleted a file: ${activity.filename || "unnamed"}`
  : `made changes`}
{" "}
                {activity.taskTitle && `on "${activity.taskTitle}"`}
              </p>
              <p className="text-gray-500 text-sm">
                {new Date(activity.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No recent activity</p>
      )}
    </div>
  </div>
);
  return (
    <div className="min-h-screen w-screen bg-gray-100 p-6 flex">
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        closeSidebar={() => setIsSidebarOpen(false)}
      />

      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-0"}`}>
        <TopHeader
          pageTitle="Tasks"
          userName={username}
          profilePic={profilePic}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        <div className="flex justify-between items-center mb-6 mt-4 ml-2">
          <h1 className="text-3xl font-bold text-[#233876]">Welcome! Back {username} </h1>
          <input
            type="text"
            placeholder="Search tasks..."
            className="border rounded px-3 py-1 w-64"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="flex gap-6">
          {/* Left Section - 50% width */}
          <div className="w-1/2">
            <div className="flex justify-between items-center mb-6">
              <p className="text-lg text-gray-600">
                {filter === "All" 
                  ? `Showing all ${filteredTasks.length} tasks`
                  : `Showing ${filteredTasks.length} ${filter.toLowerCase()} tasks`}
              </p>
              
              <div className="flex space-x-3">
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
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#233876]"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTasks.length === 0 ? (
                  <div className="bg-white p-6 rounded-lg shadow text-center">
                    <p className="text-gray-500">No tasks found</p>
                  </div>
                ) : (
                  filteredTasks.map((task) => (
                    <div key={task._id} className="bg-white rounded-lg shadow overflow-hidden">
                      <div className="p-4 border-b flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold text-lg">{task.title}</h3>
                          <p className="text-gray-600 text-sm">
                            {task.priority && (
                              <span className={`px-2 py-1 rounded text-xs ${
                                task.priority === "High" ? "bg-red-100 text-red-800" :
                                task.priority === "Medium" ? "bg-yellow-100 text-yellow-800" :
                                "bg-green-100 text-green-800"
                              }`}>
                                {task.priority}
                              </span>
                            )}
                            {task.deadline && (
                              <span className="ml-2">
                                Due: {new Date(task.deadline).toLocaleDateString()}
                              </span>
                            )}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setExpandedTask(expandedTask === task._id ? null : task._id)}
                            className="text-[#233876] hover:bg-gray-100 p-2 rounded"
                          >
                            <FaArrowDown className={`transition-transform ${expandedTask === task._id ? "rotate-180" : ""}`} />
                          </button>
                        </div>
                      </div>

                      {expandedTask === task._id && (
                        <div className="p-4 space-y-4">
                          <div>
                            <h4 className="font-medium text-gray-700">Description</h4>
                            <p className="mt-1">{task.description || "No description"}</p>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-medium text-gray-700">Status</h4>
                              <select
                                value={task.status}
                                onChange={(e) => handleStatusChange(task._id, e.target.value)}
                                className="mt-1 border rounded px-3 py-2 w-full"
                              >
                                <option value="To Do">To Do</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                              </select>
                            </div>

                            <div>
                              <h4 className="font-medium text-gray-700">Assignee</h4>
                              <p className="mt-1">{task.assignee || "Unassigned"}</p>
                            </div>

                            <div>
                              <h4 className="font-medium text-gray-700">Team</h4>
                              <p className="mt-1">{task.team || "No team"}</p>
                            </div>

                            <div>
                              <h4 className="font-medium text-gray-700">Reporter</h4>
                              <p className="mt-1">{task.reporter || "No reporter"}</p>
                            </div>
                          </div>

                          {renderAttachments(task)}

                          <div>
                            <h4 className="font-medium text-gray-700">Comments</h4>
                            <div className="mt-2 space-y-3">
                              {task.comments?.length > 0 ? (
                                task.comments.map((comment, index) => (
                                  <div key={index} className="bg-gray-50 p-3 rounded">
                                    <div className="flex justify-between">
                                      <span className="font-medium">{comment.user}</span>
                                      <span className="text-gray-500 text-sm">
                                        {new Date(comment.createdAt).toLocaleString()}
                                      </span>
                                    </div>
                                    <p className="mt-1">{comment.text}</p>
                                  </div>
                                ))
                              ) : (
                                <p className="text-gray-500">No comments yet</p>
                              )}
                            </div>
                            <div className="mt-3 flex">
                              <input
                                type="text"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Add a comment..."
                                className="flex-1 border rounded-l px-3 py-2"
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" && newComment.trim()) {
                                    handleAddComment(task._id);
                                  }
                                }}
                              />
                              <button
                                onClick={() => handleAddComment(task._id)}
                                disabled={!newComment.trim()}
                                className="bg-[#233876] text-white px-4 py-2 rounded-r disabled:opacity-50 flex items-center gap-2"
                              >
                                <FaCheckCircle /> Post
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Right Section - 50% width */}
          <div className="w-1/2 space-y-6">
            {renderTaskStatistics()}
            {renderRecentActivity()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Task;