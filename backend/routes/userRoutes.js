import express from 'express';
import mongoose from 'mongoose';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.get('/me', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ username: user.username, profilePic: user.profilePic });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to authenticate token' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid User ID' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error('GET /users/:id error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid User ID' });
    }

    const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found for update' });
    }

    res.json(updatedUser);
  } catch (err) {
    console.error('PUT /users/:id error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
