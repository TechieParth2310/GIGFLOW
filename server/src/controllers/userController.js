import User from '../models/User.js';
import Bid from '../models/Bid.js';
import Gig from '../models/Gig.js';

// @desc    Verify a user's password (development/testing utility)
// @route   POST /api/users/verify-password
// @access  Protected by secret key
export const verifyPassword = async (req, res) => {
  try {
    const secretKey = req.query.key || req.body.key;
    const { email, password } = req.body;

    // Check secret key (same as seed endpoint)
    if (secretKey !== 'seed-me-production-2026') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: Invalid secret key'
      });
    }

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User with email "${email}" not found`
      });
    }

    const isMatch = await user.matchPassword(password);

    res.status(200).json({
      success: true,
      data: {
        email: user.email,
        username: user.username,
        userId: user._id,
        passwordMatch: isMatch,
        message: isMatch ? 'Password is CORRECT ✅' : 'Password is INCORRECT ❌'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Get user profile by ID
// @route   GET /api/users/:userId
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user's stats
    let stats = {
      totalBids: 0,
      totalGigs: 0,
      hiredCount: 0,
      totalEarnings: 0
    };

    if (user.role === 'freelancer') {
      const bids = await Bid.find({ freelancerId: userId });
      stats.totalBids = bids.length;
      stats.hiredCount = bids.filter(b => b.status === 'hired').length;
      stats.totalEarnings = bids
        .filter(b => b.status === 'hired')
        .reduce((sum, b) => sum + (b.price || 0), 0);
    } else if (user.role === 'client') {
      const gigs = await Gig.find({ ownerId: userId });
      stats.totalGigs = gigs.length;
    }

    res.status(200).json({
      success: true,
      data: {
        ...user.toObject(),
        stats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Get current user's profile
// @route   GET /api/users/me
// @access  Private
export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user's stats
    let stats = {
      totalBids: 0,
      totalGigs: 0,
      hiredCount: 0,
      totalEarnings: 0
    };

    if (user.role === 'freelancer') {
      const bids = await Bid.find({ freelancerId: req.user._id });
      stats.totalBids = bids.length;
      stats.hiredCount = bids.filter(b => b.status === 'hired').length;
      stats.totalEarnings = bids
        .filter(b => b.status === 'hired')
        .reduce((sum, b) => sum + (b.price || 0), 0);
    } else if (user.role === 'client') {
      const gigs = await Gig.find({ ownerId: req.user._id });
      stats.totalGigs = gigs.length;
    }

    res.status(200).json({
      success: true,
      data: {
        ...user.toObject(),
        stats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};
