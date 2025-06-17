// models/Activity.js
import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
  taskTitle: String,
  action: String,
  filename: String,
  newStatus: String,
  timestamp: Date
});

export default mongoose.model("Activity", activitySchema);
