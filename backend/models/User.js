import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  address: String,
  profilePic: { type: String, default: '' },  
});

export default mongoose.model('User', userSchema);
