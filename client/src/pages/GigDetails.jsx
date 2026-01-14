import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGig } from '../store/slices/gigSlice';
import { createBid, fetchBidCount } from '../store/slices/bidSlice';
import { gigsAPI } from '../services/api';
import { GigDetailsSkeleton } from '../components/Skeleton';
import { formatDate } from '../utils/dateUtils';
import toast from 'react-hot-toast';

const GigDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentGig, loading: gigLoading } = useSelector((state) => state.gigs);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [bidForm, setBidForm] = useState({
    message: '',
    price: ''
  });
  const [showBidForm, setShowBidForm] = useState(false);
  const [bidCount, setBidCount] = useState(null);

  useEffect(() => {
    dispatch(fetchGig(id));
    // Track view
    gigsAPI.trackView(id).catch(err => {
      // Silently fail - view tracking is not critical
      console.error('Failed to track view:', err);
    });
  }, [id, dispatch]);

  useEffect(() => {
    if (currentGig && isAuthenticated && user) {
      try {
        const ownerId = currentGig.ownerId?._id || currentGig.ownerId;
        const userId = user?.id || user?._id;
        
        // Only fetch bid count for non-owners
        if (!(ownerId && userId && ownerId.toString() === userId.toString())) {
          dispatch(fetchBidCount(id)).then((result) => {
            if (fetchBidCount.fulfilled.match(result)) {
              setBidCount(result.payload?.count || 0);
            }
          }).catch((error) => {
            console.error('Error fetching bid count:', error);
          });
        }
      } catch (error) {
        console.error('Error in useEffect:', error);
      }
    }
  }, [currentGig, isAuthenticated, user, id, dispatch]);

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(createBid({
      gigId: id,
      ...bidForm
    }));
    
    if (createBid.fulfilled.match(result)) {
      toast.success('Bid submitted successfully!');
      setBidForm({ message: '', price: '' });
      setShowBidForm(false);
      // Refresh bid count after submitting
      dispatch(fetchBidCount(id)).then((result) => {
        if (fetchBidCount.fulfilled.match(result)) {
          setBidCount(result.payload?.count || 0);
        }
      });
    } else {
      toast.error(result.payload?.message || 'Failed to submit bid');
    }
  };

  // Safely get owner ID
  const ownerId = currentGig?.ownerId?._id || currentGig?.ownerId;
  const userId = user?.id || user?._id;
  
  // Compare owner ID with user ID safely
  const isOwner = currentGig && isAuthenticated && ownerId && userId && 
                  ownerId.toString() === userId.toString();

  if (gigLoading) {
    return (
      <div className="min-h-screen bg-gradient-page flex items-center justify-center page-enter">
        <GigDetailsSkeleton />
      </div>
    );
  }

  if (!currentGig) {
    return (
      <div className="min-h-screen bg-gradient-page flex items-center justify-center page-enter">
        <div className="text-center glass rounded-3xl shadow-2xl p-8 border" style={{ borderColor: 'var(--color-border)' }}>
          <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>Gig not found</h2>
          <p className="mb-6" style={{ color: 'var(--color-text-secondary)' }}>The gig you're looking for doesn't exist.</p>
          <Link
            to="/gigs"
            className="premium-button inline-block"
          >
            Browse All Gigs
          </Link>
        </div>
      </div>
    );
  }

  // Safety check for currentGig structure
  if (!currentGig._id && !currentGig.id) {
    console.error('Invalid gig data:', currentGig);
    return (
      <div className="min-h-screen bg-gradient-page flex items-center justify-center page-enter">
        <div className="text-center glass rounded-3xl shadow-2xl p-8 border" style={{ borderColor: 'var(--color-border)' }}>
          <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>Invalid Gig Data</h2>
          <p className="mb-6" style={{ color: 'var(--color-text-secondary)' }}>The gig data is invalid. Please try again.</p>
          <Link
            to="/gigs"
            className="premium-button inline-block"
          >
            Browse All Gigs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-page relative overflow-hidden page-enter" style={{ color: 'var(--color-text-primary)' }}>
      {/* Subtle background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blob-orange rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blob-ivory rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-2000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Gig Details Card */}
        <div className="premium-card p-8 mb-8 glass border card-hover" style={{ borderColor: 'var(--color-border)' }}>
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                {currentGig?.title || 'Untitled Gig'}
              </h1>
              <div className="flex items-center gap-4 mb-2">
                {currentGig.createdAt && (
                  <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                    Posted {formatDate(currentGig.createdAt)}
                  </p>
                )}
                <span className="flex items-center gap-1 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {currentGig?.viewCount || 0} views
                </span>
                <span className="flex items-center gap-1 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {currentGig?.bidCount || 0} proposals
                </span>
              </div>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
              (currentGig?.status || 'open') === 'open' 
                ? 'badge-pending' 
                : ''
            }`} style={(currentGig?.status || 'open') !== 'open' ? {
              backgroundColor: 'var(--color-surface)',
              color: 'var(--color-text-secondary)',
              border: '1px solid var(--color-border)'
            } : {}}>
              {(currentGig?.status || 'open') === 'open' ? 'Open' : 'Assigned'}
            </span>
          </div>
          <p className="mb-6 text-lg leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
            {currentGig?.description || 'No description provided'}
          </p>
          <div className="flex justify-between items-center pt-6 border-t" style={{ borderColor: 'var(--color-border)' }}>
            <div>
              <p className="text-sm font-medium mb-1" style={{ color: 'var(--color-text-muted)' }}>Posted by</p>
              <Link
                to={`/profile/${currentGig.ownerId?._id || currentGig.ownerId}`}
                className="font-semibold text-lg block transition-colors"
                style={{ color: 'var(--color-text-primary)' }}
                onMouseEnter={(e) => e.target.style.color = 'var(--color-brand)'}
                onMouseLeave={(e) => e.target.style.color = 'var(--color-text-primary)'}
              >
                {currentGig.ownerId?.username || 'Client'}
              </Link>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium mb-1" style={{ color: 'var(--color-text-muted)' }}>Budget</p>
              <p className="text-5xl font-bold" style={{ color: 'var(--color-brand)' }}>
                ${(currentGig?.budget || 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Owner Notice */}
        {isOwner && (
          <div className="premium-card p-6 mb-8" style={{ backgroundColor: 'var(--color-brand-tint)' }}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--color-brand-deep)' }}>
                  👔 You posted this gig
                </h3>
                <p style={{ color: 'var(--color-text-primary)' }}>
                  Review applications and hire the best freelancer for your project.
                </p>
              </div>
              <Link
                to={`/gigs/${currentGig?._id || currentGig?.id}/review`}
                className="premium-button"
              >
                View Bids
              </Link>
            </div>
          </div>
        )}

        {/* Bid Count Info - For non-owners */}
        {isAuthenticated && !isOwner && bidCount !== null && (currentGig?.status || 'open') === 'open' && (
          <div className="premium-card p-4 mb-4" style={{ backgroundColor: 'var(--color-brand-tint)' }}>
            <p className="text-sm font-semibold" style={{ color: 'var(--color-brand)' }}>
              📊 {bidCount} {bidCount === 1 ? 'person has' : 'people have'} submitted {bidCount === 1 ? 'a bid' : 'bids'} on this gig
            </p>
          </div>
        )}

        {/* Send Proposal Section - For non-owners */}
        {isAuthenticated && !isOwner && (currentGig?.status || 'open') === 'open' && (
          <div className="premium-card p-6 mb-8" style={{ backgroundColor: 'var(--color-brand-tint)' }}>
            <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
              Send Proposal
            </h2>
            {!showBidForm ? (
              <button
                onClick={() => setShowBidForm(true)}
                className="premium-button w-full"
              >
                Submit a Proposal
              </button>
            ) : (
              <form onSubmit={handleBidSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
                    Your Message
                  </label>
                  <textarea
                    value={bidForm.message}
                    onChange={(e) => setBidForm({ ...bidForm, message: e.target.value })}
                    required
                    rows="4"
                    className="premium-input resize-none"
                    placeholder="Why should you be hired for this gig? Describe your experience and approach..."
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                    Your Price ($)
                  </label>
                  <input
                    type="number"
                    value={bidForm.price}
                    onChange={(e) => setBidForm({ ...bidForm, price: e.target.value })}
                    required
                    min="1"
                    className="premium-input"
                    placeholder="Enter your proposed price"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="premium-button flex-1"
                  >
                    Send Proposal
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowBidForm(false);
                      setBidForm({ message: '', price: '' });
                    }}
                    className="premium-button-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GigDetails;


