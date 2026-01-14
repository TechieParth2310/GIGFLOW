import express from 'express';
import { getUserProfile, getMyProfile, verifyPassword } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/me', protect, getMyProfile);
router.get('/:userId', protect, getUserProfile);
router.post('/verify-password', verifyPassword); // Protected by secret key in controller

export default router;
