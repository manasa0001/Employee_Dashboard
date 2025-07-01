import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from "./aSidebar";
import TopHeader from "./aTopHeader";

function App() {
  const [projects, setProjects] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProject, setCurrentProject] = useState({
    id: null,
    name: '',
    client: '',
    team: 'Frontend Team',
    startDate: '',
    endDate: '',
    status: 'In Progress',
    progress: '0%',
    description: ''
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [profilePic, setProfilePic] = useState("");

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  useEffect(() => {
    const username = localStorage.getItem("username");
    const token = localStorage.getItem("token");
    const pic = localStorage.getItem("userPic");

    if (username && token) {
      setUsername(username);
      setProfilePic(pic || "");
    }

    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/projects");
      setProjects(res.data);
    } catch (error) {
      console.error("Failed to fetch projects", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentProject({ ...currentProject, [name]: value });
  };

  const resetForm = () => {
    setCurrentProject({
      id: null,
      name: '',
      client: '',
      team: 'Frontend Team',
      startDate: '',
      endDate: '',
      status: 'In Progress',
      progress: '0%',
      description: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (currentProject.id) {
        const res = await axios.put(`http://localhost:5000/api/projects/${currentProject.id}`, currentProject);
        setProjects(projects.map(p => p._id === res.data._id ? res.data : p));
      } else {
        const res = await axios.post("http://localhost:5000/api/projects", currentProject);
        setProjects([...projects, res.data]);
      }

      setIsEditing(false);
      resetForm();
    } catch (error) {
      console.error("Error saving project", error);
    }
  };

  const handleEdit = (project) => {
    setIsEditing(true);
    setCurrentProject({
      ...project,
      id: project._id
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    resetForm();
  };

  return (
    <div className="relative min-h-screen w-screen bg-gray-50 flex">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} closeSidebar={closeSidebar} />
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-0"}`}>
        <TopHeader pageTitle="Project Management" userName={username} profilePic={profilePic} toggleSidebar={toggleSidebar} />
        <div className="flex-1 p-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            {isEditing ? (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">{currentProject.id ? 'Edit Project' : 'Add Project'}</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
                      <input type="text" name="name" value={currentProject.name} onChange={handleInputChange} placeholder="Enter project name" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Client</label>
                      <input type="text" name="client" value={currentProject.client} onChange={handleInputChange} placeholder="Enter client name" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Assigned Team</label>
                      <select name="team" value={currentProject.team} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="Frontend Team">Frontend Team</option>
                        <option value="Backend Team">Backend Team</option>
                        <option value="Design Team">Design Team</option>
                        <option value="Marketing Team">Marketing Team</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                      <select name="status" value={currentProject.status} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="Not Started">Not Started</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="On Hold">On Hold</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                      <input type="date" name="startDate" value={currentProject.startDate} onChange={handleInputChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                      <input type="date" name="endDate" value={currentProject.endDate} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Progress</label>
                    <input type="text" name="progress" value={currentProject.progress} onChange={handleInputChange} placeholder="e.g. 65%" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Project Description</label>
                    <textarea name="description" value={currentProject.description} onChange={handleInputChange} placeholder="Write a brief description..." rows="4" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                  <div className="flex gap-4">
                    <button type="submit" className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">Save Project</button>
                    <button type="button" onClick={handleCancel} className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors">Cancel</button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800">Projects</h2>
                  <button onClick={() => setIsEditing(true)} className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Add Project</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned Team</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {projects.map((project) => (
                        <tr key={project._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{project.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{project.client}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{project.team}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{project.startDate}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{project.endDate}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              project.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                              project.status === 'Completed' ? 'bg-green-100 text-green-800' :
                              project.status === 'On Hold' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {project.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{project.progress}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <button onClick={() => handleEdit(project)} className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">Edit</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
