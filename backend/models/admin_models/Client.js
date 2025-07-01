import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  team: {
    type: String,
    default: "Sales Team",
  },
}, { timestamps: true });

const Client = mongoose.model("Client", clientSchema);
export default Client;