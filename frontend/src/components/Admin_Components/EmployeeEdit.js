import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function EmployeeEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState({
    name: 'John Doe',
    role: 'Full Stack',
    status: 'Active'
  });

  const handleChange = (e) => {
    setEmployee({ ...employee, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Send update to backend (mock for now)
    alert('Employee updated successfully!');
    navigate(-1);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Edit Employee - {id}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          value={employee.name}
          onChange={handleChange}
          className="block w-full border p-2 rounded"
          placeholder="Name"
        />
        <input
          name="role"
          value={employee.role}
          onChange={handleChange}
          className="block w-full border p-2 rounded"
          placeholder="Role"
        />
        <select
          name="status"
          value={employee.status}
          onChange={handleChange}
          className="block w-full border p-2 rounded"
        >
          <option value="Active">Active</option>
          <option value="InActive">Inactive</option>
        </select>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
          Save
        </button>
      </form>
    </div>
  );
}

export default EmployeeEdit;
