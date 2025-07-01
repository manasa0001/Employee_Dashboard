import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: String,
  profilePic: { type: String, default: '' }
}, { collection: 'employees' });

export default mongoose.model('Employee', employeeSchema,"employees");