
// backend/routes/userRoutes.js
import express from 'express';
import mongoose from 'mongoose';
import UsersData from '../models/UsersData.js';
const router = express.Router();

/**
 * GET /api/users/:id
 * Fetch a user by their MongoDB _id.
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // 1) Validate the format of the ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }

    // 2) Lookup the user (omit sensitive fields)
    const user = await UsersData.findById(id)
      .select('name email role profilePic') // include profilePic if you’ve added it
      .lean(); // returns a plain JS object

    // 3) Handle not found
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // 4) Return user
    return res.json(user);
  } catch (err) {
    console.error('Error in GET /api/users/:id:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // 1) Validate
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid User ID format' });
    }

    // 2) Destructure only allowed fields from body
    const { name, email, phone, address, profilePic } = req.body;
const updates = {
  name,
  email,
  phone,
  address,
  profilePic
};

    // 3) Update and return the new document
    const updated = await UsersData.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true, context: 'query' }
    ).select('name email phone address profilePic');

    if (!updated) {
      return res.status(404).json({ error: 'User not found for update' });
    }
    return res.json({
      message: 'User updated successfully',
      user: updated
    });
  } catch (err) {
    console.error('Error stack:', err.stack);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});
export default router;
