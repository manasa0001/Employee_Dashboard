
import mongoose from "mongoose";

// Comment sub-schema
const commentSchema = new mongoose.Schema({
  user: { type: String, required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// TaskUpdate schema (stores updates for an EmployeeTask)
const taskUpdateSchema = new mongoose.Schema(
  {
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EmployeeTask",
      required: true
    },

    // These fields are OPTIONAL and are updated selectively.
    title: {
      type: String
    },

    deadline: {
      type: Date
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"]
    },

    progress: {
      type: String,
      enum: ["To Do", "In Progress", "Completed"]
    },

    comments: [commentSchema],

    uploads: [String]
  },
  { timestamps: true }
);

const TaskUpdate = mongoose.model(
  "TaskUpdate",
  taskUpdateSchema,
  "employeetasksupdates"
);

export default TaskUpdate;
