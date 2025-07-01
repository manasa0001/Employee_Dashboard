import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from "./aSidebar";
import TopHeader from "./aTopHeader";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [profilePic, setProfilePic] = useState("");

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  useEffect(() => {
    const uname = localStorage.getItem("username");
    const token = localStorage.getItem("token");
    const pic = localStorage.getItem("userPic");
    if (uname && token) {
      setUsername(uname);
      setProfilePic(pic || "");
    }
  }, []);

  return (
    <div className="relative min-h-screen w-screen bg-gray-50 flex">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} closeSidebar={closeSidebar} />
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-0"}`}>
        <TopHeader pageTitle="Taask Management" userName={username} profilePic={profilePic} toggleSidebar={toggleSidebar} />
        <div className="flex-1 p-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800">Taask Management</h1>
            </header>
            <TaaskDetailView />
            <TaaskSummaryTable />
          </div>
        </div>
      </div>
    </div>
  );
}

function TaaskDetailView() {
  const [comment, setComment] = useState('');
  const [activeTab, setActiveTab] = useState('activity');

  const handlePostComment = () => {
    if (comment.trim()) {
      alert("Comment posted: " + comment);
      setComment('');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Taask Details</h2>
        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">To Do</span>
      </div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2 text-gray-800">Description</h3>
        <p className="text-gray-600">This is a sample taask description. Replace this with actual taask details.</p>
      </div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center">
            <span className="w-32 text-gray-600">Assignees:</span>
            <span className="text-gray-800">John Doe</span>
          </div>
          <div className="flex items-center">
            <span className="w-32 text-gray-600">Team:</span>
            <span className="text-gray-800">Frontend Team</span>
          </div>
          <div className="flex items-center">
            <span className="w-32 text-gray-600">Start Date:</span>
            <span className="text-gray-800">2024-03-20</span>
          </div>
          <div className="flex items-center">
            <span className="w-32 text-gray-600">Due Date:</span>
            <span className="text-gray-800">2024-03-25</span>
          </div>
          <div className="flex items-center">
            <span className="w-32 text-gray-600">Priority:</span>
            <span className="text-gray-800">High</span>
          </div>
          <div className="flex items-center">
            <span className="w-32 text-gray-600">Status:</span>
            <span className="text-gray-800">In Progress</span>
          </div>
        </div>
      </div>
      <div className="mb-6">
        <label className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors cursor-pointer">
          Add Attachments
          <input type="file" multiple className="hidden" onChange={(e) => console.log(e.target.files)} />
        </label>
      </div>
      <div className="border-b border-gray-200 mb-6">
        <div className="flex space-x-4">
          {['activity', 'comments', 'history'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 font-medium ${activeTab === tab ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {[...'TB7LINGFBCDH+V'].map((item) => (
          <button key={item} className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
            {item}
          </button>
        ))}
      </div>
      <div className="mt-4">
        <textarea className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Add a comment..." value={comment} onChange={(e) => setComment(e.target.value)} rows="4" />
        <div className="mt-4 flex justify-end">
          <button onClick={handlePostComment} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            Post Comment
          </button>
        </div>
      </div>
    </div>
  );
}

function TaaskSummaryTable() {
  const [taasks, setTaasks] = useState([]);
  const [filter, setFilter] = useState('');
  const [isAddingTaask, setIsAddingTaask] = useState(false);
  const [editTaaskId, setEditTaaskId] = useState(null);
  const [formData, setFormData] = useState({
    title: '', assignedTo: '', deadline: '', status: 'To Do', priority: 'Medium', files: []
  });

  const API_URL = 'http://localhost:5000/api/taasks';

  useEffect(() => {
    const fetchTaasks = async () => {
      try {
        const res = await axios.get(API_URL);
        setTaasks(res.data);
      } catch (err) {
        console.error("Error fetching taasks:", err);
      }
    };
    fetchTaasks();
  }, []);

  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? [...files] : value
    }));
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.assignedTo) return alert("Fill all required fields.");

    try {
      if (editTaaskId !== null) {
        const res = await axios.put(`${API_URL}/${editTaaskId}`, formData);
        setTaasks(prev => prev.map(t => t._id === editTaaskId ? res.data : t));
      } else {
        const res = await axios.post(API_URL, formData);
        setTaasks(prev => [...prev, res.data]);
      }
    } catch (err) {
      console.error("Error submitting taask:", err);
    }

    setFormData({ title: '', assignedTo: '', deadline: '', status: 'To Do', priority: 'Medium', files: [] });
    setEditTaaskId(null);
    setIsAddingTaask(false);
  };

  const handleEdit = (taask) => {
    setFormData(taask);
    setEditTaaskId(taask._id);
    setIsAddingTaask(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTaasks(prev => prev.filter(t => t._id !== id));
    } catch (err) {
      console.error("Error deleting taask:", err);
    }
  };

  const filteredTaasks = taasks.filter(t => t.title.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Taask Summary</h2>
        <div className="flex gap-4">
          <button onClick={() => setIsAddingTaask(true)} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            Add Taask
          </button>
          <input type="text" placeholder="Filter taasks..." value={filter} onChange={(e) => setFilter(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
        </div>
      </div>

      {isAddingTaask && (
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="title" value={formData.title} onChange={handleFormChange} className="border p-2 rounded" placeholder="Title" />
          <input name="assignedTo" value={formData.assignedTo} onChange={handleFormChange} className="border p-2 rounded" placeholder="Assigned To" />
          <input name="deadline" type="date" value={formData.deadline} onChange={handleFormChange} className="border p-2 rounded" />
          <select name="status" value={formData.status} onChange={handleFormChange} className="border p-2 rounded">
            <option>To Do</option><option>In Progress</option><option>Completed</option>
          </select>
          <select name="priority" value={formData.priority} onChange={handleFormChange} className="border p-2 rounded">
            <option>High</option><option>Medium</option><option>Low</option>
          </select>
          <input name="files" type="file" multiple onChange={handleFormChange} className="border p-2 rounded" />
          <button onClick={handleSubmit} className="col-span-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
            {editTaaskId ? 'Update Taask' : 'Save Taask'}
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Taask Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deadline</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTaasks.map((taask) => (
              <tr key={taask._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{taask.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{taask.assignedTo}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{taask.deadline}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${taask.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' : taask.status === 'Completed' ? 'bg-green-100 text-green-800' : taask.status === 'To Do' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                    {taask.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${taask.priority === 'High' ? 'bg-red-100 text-red-800' : taask.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                    {taask.priority}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <button onClick={() => handleEdit(taask)} className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors mr-2">Edit</button>
                  <button onClick={() => handleDelete(taask._id)} className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
