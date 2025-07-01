import UsersData from '../../models/UsersData.js';
import path from 'path';

export const getUser = async (req, res) => {
  try {
    const user = await UsersData.findById(req.params.id);  
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const updatedUser = await UsersData.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* export const uploadProfilePic = async (req, res) => {
  try {
    const { id } = req.body; 
    const filePath = `/uploads/${req.file.filename}`;  
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { profilePic: filePath },  
      { new: true }
    );
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; */
