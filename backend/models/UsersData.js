
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['admin', 'employee'], default: 'employee' },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  profilePic: {
    type: String,
    default: '', // default image URL if neseded
  },
  // ✅ Notification Preferences
  notificationPreferences: {
    emailNotifications: { type: Boolean, default: true },
    smsNotifications: { type: Boolean, default: false },
  }
});

export default mongoose.model('UsersData', userSchema, 'usersdata');

