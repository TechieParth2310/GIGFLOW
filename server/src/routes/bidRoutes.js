import express from 'express';
import { getBidsByGig, createBid, getMyBids, getBidCount } from '../controllers/bidController.js';
import { hireFreelancer } from '../controllers/hireController.js';
import { protect } from '../middleware/auth.js';
import { validateCreateBid } from '../middleware/validators.js';
import { handleValidationErrors } from '../middleware/validation.js';

const router = express.Router();

router.get('/my-bids', protect, getMyBids);
router.get('/count/:gigId', protect, getBidCount);
router.get('/:gigId', protect, getBidsByGig);
router.post('/', protect, validateCreateBid, handleValidationErrors, createBid);
router.patch('/:bidId/hire', protect, hireFreelancer);

export default router;
