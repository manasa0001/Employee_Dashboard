
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://saranyap:TaskManage@employee1.9uzz9db.mongodb.net/?retryWrites=true&w=majority&appName=EMPLOYEE1/EmployeeDatabase');
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('MongoDB Connection Error:', err.message);
    process.exit(1);
  }
};

export default connectDB;
