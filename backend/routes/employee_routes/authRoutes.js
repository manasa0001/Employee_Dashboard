
import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import UsersData from '../../models/UsersData.js';
import { register, login, uploadProfilePic} from '../../controllers/employee_controller/authController.js';
import upload  from '../../middleware/multerConfig.js';
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
// Upload profile picture
router.post("/upload-profile-pic", upload.single("profilePic"), uploadProfilePic);
router.get('/me', async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
      }
  
      const token = authHeader.split(' ')[1];
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded JWT payload:', decoded);
      } catch (verErr) {
        return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
      }
  
      // decoded should have { id: <MongoID> }
      const lookupId = decoded.userId;
      if (!lookupId || !mongoose.Types.ObjectId.isValid(lookupId)) {
        return res.status(400).json({ error: 'Bad token payload' });
      }
  
      const user = await UsersData.findById(lookupId).select('name email role address phone profilePic');
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      return res.json({
        userId: user._id,
        name:  user.name,
        email: user.email,
        address: user.address,
        phone: user.phone,
        profilePic: user.profilePic,

      });
    } catch (err) {
      console.error('Error in /me route:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

export default router;
