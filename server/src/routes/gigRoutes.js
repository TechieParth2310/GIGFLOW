import express from 'express';
import { getGigs, getGig, createGig, getMyGigs, deleteGig } from '../controllers/gigController.js';
import { protect } from '../middleware/auth.js';
import { validateCreateGig } from '../middleware/validators.js';
import { handleValidationErrors } from '../middleware/validation.js';

const router = express.Router();

router.get('/', getGigs);
router.get('/mine', protect, getMyGigs);
router.get('/:id', getGig);
router.post('/', protect, validateCreateGig, handleValidationErrors, createGig);
router.delete('/:id', protect, deleteGig);

export default router;
