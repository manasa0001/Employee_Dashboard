import mongoose from 'mongoose';

const uSersSchema = new mongoose.Schema({
  fullName: { type: String },
  email: { type: String, required: true, unique: true },
  contactNumber: { type: String },
  address: { type: String },
  password: { type: String, required: true },  // hashed password
  profilePic: { type: String }
});

const uSers = mongoose.model("uSers", uSersSchema);
export default uSers;
