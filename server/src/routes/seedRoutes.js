import express from 'express';
import { seedDatabase } from '../controllers/seedController.js';

const router = express.Router();

// Seed database endpoint (protected by secret key)
router.post('/', seedDatabase);

export default router;
