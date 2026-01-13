import express from 'express';
import { seedDatabase } from '../controllers/seedController.js';

const router = express.Router();

// Seed database endpoint (protected by secret key)
// Support both GET and POST for easy browser access
router.get('/', seedDatabase);
router.post('/', seedDatabase);

export default router;
