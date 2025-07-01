import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function AssignTask() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState({
    title: '',
    description: '',
    deadline: ''
  });

  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit task to backend (mock)
    alert(`Task assigned to Employee #${id}`);
    navigate(-1);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Assign Task to Employee #{id}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          value={task.title}
          onChange={handleChange}
          placeholder="Task Title"
          className="block w-full border p-2 rounded"
        />
        <textarea
          name="description"
          value={task.description}
          onChange={handleChange}
          placeholder="Description"
          className="block w-full border p-2 rounded"
        />
        <input
          type="date"
          name="deadline"
          value={task.deadline}
          onChange={handleChange}
          className="block w-full border p-2 rounded"
        />
        <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">
          Assign
        </button>
      </form>
    </div>
  );
}

export default AssignTask;
