
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UsersData from '../../models/UsersData.js'; // Adjust path if needed
import dotenv from 'dotenv';
dotenv.config();

 const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existingUser = await UsersData.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UsersData({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const user = await UsersData.findOne({ email, role });

    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.json({
      token,
      role: user.role,
      name: user.name,
      userId: user._id,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};
// Upload Profile Picture Handler
 const uploadProfilePic = async (req, res) => {
  try {
    const userId = req.body.userId;
    console.log("Received userId:", userId); // 👀 log this

    if (!userId || userId === "null") {
      return res.status(400).json({ message: "Invalid or missing user ID" });
    }
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const filePath = `/uploads/${req.file.filename}`; // Relative URL

    const updatedUser = await UsersData.findByIdAndUpdate(
      userId,
      { profilePic: filePath },
      { new: true }
    );
    console.log("Received userId:", req.body.userId);
console.log("Received file:", req.file);


    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile picture uploaded successfully",
      filename: req.file.filename,
      profilePic: filePath,
      user: updatedUser
    });
  } catch (error) {
    console.error("Image Upload Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export { register, login, uploadProfilePic };
