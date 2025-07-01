import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function EmployeeView() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">View Employee {id}</h2>
      {/* Replace below with actual data fetch logic */}
      <p><strong>Name:</strong> John Doe</p>
      <p><strong>Role:</strong> Full Stack Developer</p>
      <p><strong>Status:</strong> Active</p>

      <button
        onClick={() => navigate(-1)}
        className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
      >
        Back
      </button>
    </div>
  );
}

export default EmployeeView;
