
import mongoose from "mongoose";

const employeetaskSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    status: String,
    assignee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" }, 
    team: String,
    startDate: { type: Date },
    endDate: { type: Date },
    reporter: String,
    attachments: [String],
    comments: [
      {
        user: String,
        text: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { id: false }
);

const EmployeeTask = mongoose.model("EmployeeTask", employeetaskSchema);
export default EmployeeTask;