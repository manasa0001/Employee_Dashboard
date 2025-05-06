
import mongoose from "mongoose";

const taskUpdateSchema = new mongoose.Schema(
  {
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: "EmployeeTask", required: true },
    title: { type: String, required: true },
    deadline: { type: Date, required: true },
    priority: { type: String, enum: ["Low", "Medium", "High"], required: true },
    progress: { type: String, enum: ["ToDo", "InProgress", "Completed"], required: true },
    comments: [
      {
        user: { type: String, required: true },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    uploads: [String], // Array to store file paths for uploaded files
  },
  { timestamps: true }
);

const TaskUpdate = mongoose.model("TaskUpdate", taskUpdateSchema);
export default TaskUpdate;
