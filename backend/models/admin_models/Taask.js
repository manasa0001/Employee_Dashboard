import mongoose from "mongoose";

const taaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  assignedTo: { type: String, required: true },
  deadline: { type: Date },
  status: { type: String, enum: ["To Do", "In Progress", "Completed"], default: "To Do" },
  priority: { type: String, enum: ["High", "Medium", "Low"], default: "Medium" },
  files: [{ type: String }]
}, { timestamps: true });

const Taask = mongoose.model("Taask", taaskSchema);
export default Taask;

