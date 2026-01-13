import Bid from '../models/Bid.js';
import Gig from '../models/Gig.js';
import Notification from '../models/Notification.js';

// @desc    Get bids for a gig
// @route   GET /api/bids/:gigId
// @access  Private (only gig owner)
export const getBidsByGig = async (req, res) => {
  try {
    const { gigId } = req.params;

    // Check if gig exists
    const gig = await Gig.findById(gigId);

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
        message: 'Not authorized to view bids for this gig'
      });
    }

    const bids = await Bid.find({ gigId })
      .populate('freelancerId', 'username email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bids.length,
      data: bids
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Create bid
// @route   POST /api/bids
// @access  Private
export const createBid = async (req, res) => {
  try {
    const { gigId, message, price } = req.body;

    // Check if gig exists and is open
    const gig = await Gig.findById(gigId);

    if (!gig) {
      return res.status(404).json({
        success: false,
        message: 'Gig not found'
      });
    }

    if (gig.status !== 'open') {
      return res.status(400).json({
        success: false,
        message: 'Gig is not open for bidding'
      });
    }

    // Check if user is not the gig owner (anyone can bid except the owner)
    if (gig.ownerId.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot bid on your own gig'
      });
    }

    // Check if user already bid on this gig
    const existingBid = await Bid.findOne({
      gigId,
      freelancerId: req.user._id
    });

    if (existingBid) {
      return res.status(400).json({
        success: false,
        message: 'You have already bid on this gig'
      });
    }

    const bid = await Bid.create({
      gigId,
      freelancerId: req.user._id,
      message,
      price: Number(price),
      status: 'pending'
    });

    const populatedBid = await Bid.findById(bid._id)
      .populate('freelancerId', 'username email')
      .populate('gigId', 'title');

    // Notify other freelancers who have bid on this gig
    const otherBids = await Bid.find({
      gigId,
      freelancerId: { $ne: req.user._id },
      status: 'pending'
    }).select('freelancerId');

    // Create notifications for other freelancers
    const notifications = otherBids.map(otherBid => ({
      userId: otherBid.freelancerId,
      message: `A new bid was submitted on "${populatedBid.gigId.title}"`,
      type: 'bid',
      gigId: gig._id,
      bidId: bid._id,
      read: false
    }));

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }

    // Emit socket events to other freelancers
    const io = req.app.get('io');
    if (io) {
      otherBids.forEach(otherBid => {
        io.to(otherBid.freelancerId.toString()).emit('newBid', {
          message: `A new bid was submitted on "${populatedBid.gigId.title}"`,
          gigId: gig._id,
          gigTitle: populatedBid.gigId.title,
          bidId: bid._id
        });
      });

      // Notify the gig owner that a new bid was received
      io.to(gig.ownerId.toString()).emit('bidReceived', {
        message: `New bid received on "${populatedBid.gigId.title}" from ${populatedBid.freelancerId.username}`,
        gigId: gig._id,
        gigTitle: populatedBid.gigId.title,
        bidId: bid._id,
        freelancerName: populatedBid.freelancerId.username
      });

      // Create notification for gig owner
      await Notification.create({
        userId: gig.ownerId,
        message: `New bid received on "${populatedBid.gigId.title}" from ${populatedBid.freelancerId.username}`,
        type: 'bid',
        gigId: gig._id,
        bidId: bid._id,
        read: false
      });
    }

    res.status(201).json({
      success: true,
      data: populatedBid
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

// @desc    Get user's bids
// @route   GET /api/bids/my-bids
// @access  Private
export const getMyBids = async (req, res) => {
  try {
    const bids = await Bid.find({ freelancerId: req.user._id })
      .populate('gigId', 'title description budget status ownerId')
      .sort({ createdAt: -1 });

    // Get bid counts for each gig
    const bidsWithCounts = await Promise.all(
      bids.map(async (bid) => {
        if (!bid.gigId || !bid.gigId._id) {
          return bid.toObject ? bid.toObject() : bid;
        }
        const bidCount = await Bid.countDocuments({
          gigId: bid.gigId._id,
          status: 'pending'
        });
        const bidObj = bid.toObject ? bid.toObject() : bid;
        return {
          ...bidObj,
          totalBids: bidCount
        };
      })
    );

    res.status(200).json({
      success: true,
      count: bids.length,
      data: bidsWithCounts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Get bid count for a gig (for freelancers)
// @route   GET /api/bids/count/:gigId
// @access  Private
export const getBidCount = async (req, res) => {
  try {
    const { gigId } = req.params;

    const bidCount = await Bid.countDocuments({
      gigId,
      status: 'pending'
    });

    res.status(200).json({
      success: true,
      count: bidCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};
