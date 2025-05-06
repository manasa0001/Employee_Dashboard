
import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema(
  {
    employeeName: { type: String, required: true },
    leaveType:    { type: String, required: true },
    fromDate:     { type: Date,   required: true },
    toDate:       { type: Date,   required: true },
    about:        { type: String },
    status:       { type: String, default: "Pending" },
    seen:         { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Leave = mongoose.model("Leave", leaveSchema, "leave");

export default Leave;

