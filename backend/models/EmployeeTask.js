
import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  user: { type: String, required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const employeeTaskSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    }, // Reference to employee

    title: { 
      type: String, 
      required: true 
    },

    description: { 
      type: String, 
      default: "" 
    },

    status: { 
      type: String, 
      enum: ["To Do", "In Progress", "Completed"], 
      default: "To Do" 
    },

    assignee: { 
      type: String, 
      required: true 
    }, // Employee name (can later refactor to use userId reference)

    team: { 
      type: String, 
      default: "" 
    },

    startDate: { 
      type: Date 
    },

    endDate: { 
      type: Date 
    },

    priority: { 
      type: String, 
      enum: ["Low", "Medium", "High"], 
      default: "Medium" 
    },

    deadline: { 
      type: Date 
    },

    reporter: { 
      type: String, 
      default: "" 
    },

    attachments: [String], // Array of file paths

    comments: [commentSchema]
  },
  { id: false }
);

const EmployeeTask = mongoose.model(
  "EmployeeTask", 
  employeeTaskSchema, 
  "employeetasks"
);

export default EmployeeTask;
