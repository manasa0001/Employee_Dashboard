import express from 'express';
import { getProfile, updateProfile } from '../../controllers/admin_controller/uSersController.js';
import protect from '../../middleware/uSersAuthMiddleware.js';

const router = express.Router();

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

export default router;
