
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['admin', 'employee'], default: 'employee' },
  phone: { type : String, default: ''},
  address: { type: String, default: ''},
  profilePic: {
    type: String,
    default: '', // or a default image URL
  }
});

export default mongoose.model ('UsersData', userSchema,"usersdata");
