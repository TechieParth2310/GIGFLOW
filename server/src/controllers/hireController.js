import mongoose from 'mongoose';
import Bid from '../models/Bid.js';
import Gig from '../models/Gig.js';
import Notification from '../models/Notification.js';

// @desc    Hire a freelancer (atomic transaction with guarded updates)
// @route   PATCH /api/bids/:bidId/hire
// @access  Private (only gig owner)
// 
// RACE CONDITION PROTECTION EXPLANATION:
// This implementation uses MongoDB's findOneAndUpdate with a query condition
// that includes status: "open". This is a GUARDED UPDATE pattern:
//
// 1. The update query includes { status: "open" } in the filter
// 2. MongoDB will only update if the document matches ALL conditions
// 3. If two requests arrive simultaneously:
//    - First request: Finds gig with status="open", updates to "assigned" ✓
//    - Second request: Finds gig with status="assigned" (no longer "open"), update fails ✗
// 4. Combined with transactions, this ensures atomicity:
//    - All operations (gig update, bid updates) succeed or fail together
//    - The guarded update prevents double-hiring even under race conditions
//    - MongoDB's document-level locking ensures only one update succeeds
export const hireFreelancer = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { bidId } = req.params;

    // Find the bid
    const bid = await Bid.findById(bidId).session(session);

    if (!bid) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: 'Bid not found'
      });
    }

    // Find the gig
    const gig = await Gig.findById(bid.gigId).session(session);

    if (!gig) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: 'Gig not found'
      });
    }

    // Check if user is the gig owner
    if (gig.ownerId.toString() !== req.user._id.toString()) {
      await session.abortTransaction();
      return res.status(403).json({
        success: false,
        message: 'Not authorized to hire for this gig'
      });
    }

    // Check if bid is still pending
    if (bid.status !== 'pending') {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: 'Bid is not pending'
      });
    }

    // GUARDED UPDATE: Only delete if gig status is still "open"
    // This is the race condition killer - MongoDB will only delete
    // if the document matches ALL conditions, including status: "open"
    const deletedGig = await Gig.findOneAndDelete(
      {
        _id: gig._id,
        status: 'open',  // GUARD: Only delete if still open
        ownerId: req.user._id  // Additional guard: verify ownership
      },
      { session }
    );

    // If delete returned null, gig was already deleted/assigned (race condition detected)
    if (!deletedGig) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: 'Gig is already deleted/assigned or you are not the owner'
      });
    }

    // Atomic operations within transaction
    // 1. Update chosen bid to hired (with guard)
    const updatedBid = await Bid.findOneAndUpdate(
      {
        _id: bidId,
        status: 'pending',  // GUARD: Only update if still pending
        gigId: gig._id
      },
      { status: 'hired' },
      { 
        session, 
        new: true,
        runValidators: true
      }
    );

    if (!updatedBid) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: 'Bid is no longer pending or does not belong to this gig'
      });
    }

    // 2. Reject all other bids for this gig (with guard)
    await Bid.updateMany(
      { 
        gigId: gig._id, 
        _id: { $ne: bidId },
        status: 'pending'  // GUARD: Only update pending bids
      },
      { status: 'rejected' },
      { session }
    );

    // Commit transaction - all operations succeed or fail together
    await session.commitTransaction();

    // Get updated bid with populated fields (outside transaction)
    // Note: gigId may be null if gig was deleted, so we use the deleted gig data
    const populatedBid = await Bid.findById(bidId)
      .populate('freelancerId', 'username email');

    // Create persistent notification (outside transaction)
    if (populatedBid.freelancerId) {
      await Notification.create({
        userId: populatedBid.freelancerId._id,
        message: `You have been hired for "${deletedGig.title}"!`,
        type: 'hired',
        gigId: deletedGig._id,
        bidId: populatedBid._id,
        read: false
      });
    }

    // Emit socket event (outside transaction)
    const io = req.app.get('io');
    if (io && populatedBid.freelancerId) {
      io.to(populatedBid.freelancerId._id.toString()).emit('hired', {
        message: `You have been hired for "${deletedGig.title}"!`,
        bidId: populatedBid._id,
        gigId: deletedGig._id,
        gigTitle: deletedGig.title
      });
    }

    res.status(200).json({
      success: true,
      data: populatedBid
    });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  } finally {
    session.endSession();
  }
};
