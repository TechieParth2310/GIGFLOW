import mongoose from 'mongoose';

const viewSchema = new mongoose.Schema({
  gigId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gig',
    required: true
  },
  viewerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Allow null for anonymous views
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index to prevent duplicate views from same user within 24h
viewSchema.index({ gigId: 1, viewerId: 1, createdAt: -1 });

// TTL index for automatic cleanup (24 hours = 86400 seconds)
viewSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

const View = mongoose.model('View', viewSchema);

export default View;