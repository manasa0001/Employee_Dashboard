import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  client: {
    type: String,
  },
  team: {
    type: String,
  },
  startDate: {
    type: String,
  },
  endDate: {
    type: String,
  },
  status: {
    type: String,
    default: "Not Started",
  },
  progress: {
    type: String,
    default: "0%",
  },
  description: {
    type: String,
  },
}, { timestamps: true });

const Project = mongoose.model("Project", projectSchema);
export default Project;
