import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TopHeader from "./aTopHeader";
import Sidebar from "./aSidebar";

function ClientManagement() {
  const [clients, setClients] = useState([]);
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    phone: '',
    team: 'Sales Team'
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [profilePic, setProfilePic] = useState("");

  const API_URL = 'http://localhost:5000/api/clients';

  useEffect(() => {
    const uname = localStorage.getItem("username");
    const token = localStorage.getItem("token");
    const pic = localStorage.getItem("userPic");

    if (!uname || !token) return;

    setUsername(uname);
    setProfilePic(pic);
    fetchClients();
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  const fetchClients = async () => {
    try {
      const res = await axios.get(API_URL);
      setClients(res.data);
    } catch (err) {
      console.error('Error fetching clients:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewClient({ ...newClient, [name]: value });
  };

  const handleAddClient = async (e) => {
    e.preventDefault();
    if (!newClient.name || !newClient.email) return;

    try {
      const res = await axios.post(API_URL, newClient, {
        headers: { "Content-Type": "application/json" }
      });

      setClients(prev => [...prev, res.data]);
      setNewClient({ name: '', email: '', phone: '', team: 'Sales Team' });
    } catch (err) {
      console.error('Error adding client:', err);
      alert('Failed to add client.');
    }
  };

  const handleDeleteClient = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setClients(prev => prev.filter(client => client._id !== id));
    } catch (err) {
      console.error('Error deleting client:', err);
    }
  };

  return (
    <div className="relative min-h-screen w-screen bg-gray-50 flex">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} closeSidebar={closeSidebar} />
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-0"}`}>
        <TopHeader pageTitle="Client Management" userName={username} profilePic={profilePic} toggleSidebar={toggleSidebar} />
        <div className="w-full max-w-5xl p-8">
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Add New Client</h2>
            <form onSubmit={handleAddClient} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input type="text" name="name" value={newClient.name} onChange={handleInputChange} required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input type="email" name="email" value={newClient.email} onChange={handleInputChange} required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input type="tel" name="phone" value={newClient.phone} onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assigned Team</label>
                  <select name="team" value={newClient.team} onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option value="Sales Team">Sales Team</option>
                    <option value="Support Team">Support Team</option>
                    <option value="Development Team">Development Team</option>
                  </select>
                </div>
              </div>
              <button type="submit"
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                + Add Client
              </button>
            </form>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Client List</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Team</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {clients.map(client => (
                    <tr key={client._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{client.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{client.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{client.team}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{client.phone}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2">Edit</button>
                        <button onClick={() => handleDeleteClient(client._id)}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">Delete</button>
                      </td>
                    </tr>
                  ))}
                  {clients.length === 0 && (
                    <tr>
                      <td colSpan="5" className="text-center text-gray-500 py-6">No clients available.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientManagement;
