// models/Emmployee.js
import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  employmentType: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "Active",
  },
  salaryRange: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Emmployee = mongoose.model("Emmployee", employeeSchema);
export default Emmployee;