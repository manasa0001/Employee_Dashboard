import React, { useState, useEffect } from 'react';
import TopHeader from "./aTopHeader";
import Sidebar from "./aSidebar";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function EmployeeDashboard(){
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    employmentType: '',
    role: '',
    status: 'Active'
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [profilePic, setProfilePic] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const username = localStorage.getItem("username");
    const token = localStorage.getItem("token");
    const pic = localStorage.getItem("userPic");

    if (!username || !token) {
      return;
    }

    setUsername(username);
    setProfilePic(pic);

    // Fetch employees from backend
    axios.get("http://localhost:5000/api/emmployees")
      .then(res => {
        setEmployees(res.data);
        setFilteredEmployees(res.data);
      })
      .catch(err => {
        console.error("Failed to fetch employees", err);
      });
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  useEffect(() => {
    let result = employees;

    if (filters.role) {
      result = result.filter(emp => emp.role === filters.role);
    }

    if (filters.employmentType) {
      result = result.filter(emp => emp.employmentType === filters.employmentType);
    }

    if (filters.status) {
      result = result.filter(emp => emp.status === filters.status);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(emp =>
        emp.name.toLowerCase().includes(term) ||
        emp.role.toLowerCase().includes(term)
      );
    }

    setFilteredEmployees(result);
  }, [filters, searchTerm, employees]);

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusToggle = (status) => {
    handleFilterChange('status', status);
  };

  const handleRemove = async (employeeId) => {
    if (window.confirm("Are you sure you want to remove this employee?")) {
      try {
        await axios.delete(`http://localhost:5000/api/emmployees/${employeeId}`);
        const updatedList = employees.filter(emp => emp._id !== employeeId);
        setEmployees(updatedList);
      } catch (err) {
        console.error("Failed to delete employee", err);
      }
    }
  };

  return (
    <div className="relative min-h-screen w-screen bg-gray-50 flex">
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        closeSidebar={closeSidebar}
      />

      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-0"}`}>
        <TopHeader
          pageTitle="Employee Management"
          userName={username}
          profilePic={profilePic}
          toggleSidebar={toggleSidebar}
        />

        <div className="w-full max-w-5xl p-8">
          <div className="space-y-6"></div>
          <div className="flex justify-end mt-6">
            <button
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
              onClick={() => navigate('/employee/add')}
            >
              + Add Employee
            </button>
          </div>
          <div className="mt-8">
            <div className="flex gap-4 mb-6">
              <button
                className={`px-6 py-2 rounded-lg ${filters.status === 'Active' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                onClick={() => handleStatusToggle('Active')}
              >
                Active
              </button>
              <button
                className={`px-6 py-2 rounded-lg ${filters.status === 'InActive' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                onClick={() => handleStatusToggle('InActive')}
              >
                InActive
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map(employee => (
                  <div key={employee._id} className="bg-white rounded-lg shadow-md p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-semibold text-gray-800">{employee.name}</h3>
                      <p className="text-gray-600">{employee.role} • {employee.employmentType}</p>
                      <p className="text-gray-500 mt-1">{employee.salaryRange}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick={() => navigate(`/employee/view/${employee._id}`)}
                      >
                        View
                      </button>
                      <button
                        className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                        onClick={() => navigate(`/employee/edit/${employee._id}`)}
                      >
                        Edit
                      </button>
                      <button
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                        onClick={() => handleRemove(employee._id)}
                      >
                        Remove
                      </button>
                      <button
                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                        onClick={() => navigate(`/employee/assign/${employee._id}`)}
                      >
                        Assign Task
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-600 col-span-full text-center py-8">No employees found matching your criteria</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeDashboard;
