import Gig from '../models/Gig.js';
import View from '../models/View.js';
import Bid from '../models/Bid.js';

// @desc    Get all gigs with filters and pagination
// @route   GET /api/gigs
// @access  Public
export const getGigs = async (req, res) => {
  try {
    const { search, minBudget, maxBudget, sort = 'newest', status = 'open', page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    let query = {};

    // Status filter
    if (status === 'open') {
      query.status = 'open';
    } else if (status === 'all') {
      // Show all statuses
    } else if (status === 'assigned') {
      query.status = 'assigned';
    } else {
      query.status = 'open'; // Default to open
    }

    // Search functionality
    if (search && search.trim()) {
      query.$text = { $search: search.trim() };
    }

    // Budget range filter
    if (minBudget || maxBudget) {
      query.budget = {};
      if (minBudget) {
        query.budget.$gte = Number(minBudget);
      }
      if (maxBudget) {
        query.budget.$lte = Number(maxBudget);
      }
    }

    // Sort options
    let sortOption = { createdAt: -1 }; // Default: newest
    if (sort === 'budget_desc') {
      sortOption = { budget: -1 };
    } else if (sort === 'budget_asc') {
      sortOption = { budget: 1 };
    } else if (sort === 'newest') {
      sortOption = { createdAt: -1 };
    }

    // Get total count
    const total = await Gig.countDocuments(query);

    // Get paginated gigs
    const gigs = await Gig.find(query)
      .populate('ownerId', 'username email')
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    const totalPages = Math.ceil(total / limitNum);

    res.status(200).json({
      success: true,
      items: gigs,
      page: pageNum,
      limit: limitNum,
      total,
      totalPages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Get single gig
// @route   GET /api/gigs/:id
// @access  Public
export const getGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id)
      .populate('ownerId', 'username email');

    if (!gig) {
      return res.status(404).json({
        success: false,
        message: 'Gig not found'
      });
    }

    res.status(200).json({
      success: true,
      data: gig
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Create gig
// @route   POST /api/gigs
// @access  Private (Any authenticated user can post)
export const createGig = async (req, res) => {
  try {
    const { title, description, budget } = req.body;

    const gig = await Gig.create({
      title,
      description,
      budget: Number(budget),
      ownerId: req.user._id,
      status: 'open'
    });

    const populatedGig = await Gig.findById(gig._id)
      .populate('ownerId', 'username email');

    res.status(201).json({
      success: true,
      data: populatedGig
    });
  } catch (error) {
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message
      }));
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Get my gigs (gigs created by me)
// @route   GET /api/gigs/mine
// @access  Private
export const getMyGigs = async (req, res) => {
  try {
    const gigs = await Gig.find({ ownerId: req.user._id })
      .populate('ownerId', 'username email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: gigs.length,
      data: gigs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Delete a gig
// @route   DELETE /api/gigs/:id
// @access  Private (only gig owner)
export const deleteGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);

    if (!gig) {
      return res.status(404).json({
        success: false,
        message: 'Gig not found'
      });
    }

    // Check if user is the gig owner
    if (gig.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this gig'
      });
    }

    // Delete the gig (bids will remain but gig will be deleted)
    await Gig.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Gig deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Track gig view
// @route   POST /api/gigs/:gigId/view
// @access  Public (optional auth)
export const trackView = async (req, res) => {
  try {
    const { gigId } = req.params;
    const viewerId = req.user?._id || null; // Optional: can be null for anonymous views

    // Check if gig exists
    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({
        success: false,
        message: 'Gig not found'
      });
    }

    // Check if user already viewed this gig in the last 24 hours
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const existingView = await View.findOne({
      gigId,
      viewerId: viewerId || null,
      createdAt: { $gte: oneDayAgo }
    });

    if (!existingView) {
      // Create view record
      await View.create({
        gigId,
        viewerId
      });

      // Atomic increment viewCount
      await Gig.findByIdAndUpdate(gigId, {
        $inc: { viewCount: 1 }
      });
    }

    // Return updated gig with viewCount
    const updatedGig = await Gig.findById(gigId)
      .populate('ownerId', 'username email');

    res.status(200).json({
      success: true,
      data: updatedGig
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};
