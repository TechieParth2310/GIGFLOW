import express from 'express';
import { getUserProfile, getMyProfile } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/me', protect, getMyProfile);
router.get('/:userId', protect, getUserProfile);

export default router;
