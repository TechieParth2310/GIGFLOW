import mongoose from 'mongoose';

const gigSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  budget: {
    type: Number,
    required: [true, 'Please provide a budget'],
    min: [1, 'Budget must be at least 1']
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['open', 'assigned'],
    default: 'open'
  },
  viewCount: {
    type: Number,
    default: 0
  },
  bidCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

gigSchema.index({ title: 'text', description: 'text' });
gigSchema.index({ status: 1 });

const Gig = mongoose.model('Gig', gigSchema);

export default Gig;
