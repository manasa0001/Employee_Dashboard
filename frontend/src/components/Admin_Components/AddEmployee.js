import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddEmployee = () => {
  const [employee, setEmployee] = useState({
    name: '',
    role: '',
    employmentType: '',
    status: 'Active',
    salaryRange: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee({ ...employee, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/emmployees', employee);
      if (res.status === 201) {
        alert("Employee added successfully!");
        navigate('/employees');
      }
    } catch (err) {
      console.error("Error adding employee:", err);
      alert("Failed to add employee. Try again.");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Add New Employee</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" placeholder="Name" value={employee.name} onChange={handleChange} required className="w-full p-2 border rounded" />
        <input name="role" placeholder="Role" value={employee.role} onChange={handleChange} required className="w-full p-2 border rounded" />
        <input name="employmentType" placeholder="Employment Type" value={employee.employmentType} onChange={handleChange} required className="w-full p-2 border rounded" />
        <input name="salaryRange" placeholder="Salary Range" value={employee.salaryRange} onChange={handleChange} required className="w-full p-2 border rounded" />
        <select name="status" value={employee.status} onChange={handleChange} className="w-full p-2 border rounded">
          <option value="Active">Active</option>
          <option value="InActive">InActive</option>
        </select>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Add Employee</button>
      </form>
    </div>
  );
};

export default AddEmployee;
