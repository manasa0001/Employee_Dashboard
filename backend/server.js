import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

import userRoutes from './routes/employee_routes/userRoutes.js';
import employeeAuthRoutes from './routes/employee_routes/employeeAuth.js';
import taskRoutes from './routes/employee_routes/taskRoutes.js';
import leaveRoutes from './routes/employee_routes/leaveRoutes.js';
import authRoutes from './routes/employee_routes/authRoutes.js';
import attendanceRoutes from './routes/employee_routes/attendanceRoutes.js';
import connectDB from './config/db.js';
import UsersData from './models/UsersData.js'; // ✅ Needed for PUT route
import projectRoutes from './routes/admin_routes/clientRoutes.js';
import emmployeeRoutes from "./routes/admin_routes/emmployeeRoutes.js";
import clientRoutes from "./routes/admin_routes/clientRoutes.js";
import taaskRoutes from "./routes/admin_routes/taaskRoutes.js";
import usersRoutes from './routes/admin_routes/uSersRoutes.js';


dotenv.config();
const app = express();

// Setup __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

// Static folder for image uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', authRoutes);
app.use('/api/users',userRoutes); // only once, no duplicate
app.use('/api/tasks', taskRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/employees', employeeAuthRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/projects', projectRoutes);
app.use("/api/emmployees", emmployeeRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/taasks", taaskRoutes);
app.use('/api/user', usersRoutes);

// ✅ Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// ✅ Upload Route
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  res.json({ url: `/uploads/${req.file.filename}` });
});

// ✅ Update user
app.put('/api/users/:userId', async (req, res) => {
  const { userId } = req.params;
  const updateData = req.body;

  try {
    const updatedUser = await UsersData.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(updatedUser);
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ message: 'Server error while updating user' });
  }
});

// ❌ Don't put 404 handler **before** routes
// ✅ 404 handler should be last!
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

// Connect DB and Start Server
connectDB();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
