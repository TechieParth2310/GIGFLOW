import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGig } from '../store/slices/gigSlice';
import { fetchBidsByGig, hireFreelancer } from '../store/slices/bidSlice';
import { GigDetailsSkeleton, BidCardSkeleton } from '../components/Skeleton';
import { EmptyBids } from '../components/EmptyState';
import ConfirmationModal from '../components/ConfirmationModal';
import { formatDate } from '../utils/dateUtils';
import toast from 'react-hot-toast';

const ClientReview = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentGig, loading: gigLoading } = useSelector((state) => state.gigs);
  const { bids, loading: bidsLoading } = useSelector((state) => state.bids);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [showHireModal, setShowHireModal] = useState(false);
  const [selectedBidId, setSelectedBidId] = useState(null);
  const [hiring, setHiring] = useState(false);
  const [sortBy, setSortBy] = useState('pending');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    dispatch(fetchGig(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (currentGig && isAuthenticated && user) {
      const ownerId = currentGig.ownerId?._id || currentGig.ownerId;
      const userId = user?.id || user?._id;
      
      // Check if user is the gig owner
      if (ownerId && userId && ownerId.toString() === userId.toString()) {
        dispatch(fetchBidsByGig(id));
      } else {
        // Not the owner - redirect with error
        toast.error('You can only review bids for your own gigs.');
        navigate('/my-gigs', { replace: true });
      }
    }
  }, [currentGig, isAuthenticated, user, id, dispatch, navigate]);

  const handleHireClick = (bidId) => {
    setSelectedBidId(bidId);
    setShowHireModal(true);
  };

  const handleHireConfirm = async () => {
    if (!selectedBidId) return;
    
    setHiring(true);
    const result = await dispatch(hireFreelancer(selectedBidId));
    
    if (hireFreelancer.fulfilled.match(result)) {
      toast.success('Freelancer hired successfully! The gig has been removed from the marketplace.');
      setShowHireModal(false);
      setSelectedBidId(null);
      
      // After hiring, the gig is automatically deleted
      // Try to fetch gig - it will fail, which is expected
      const gigResult = await dispatch(fetchGig(id));
      if (fetchGig.rejected.match(gigResult)) {
        // Gig was deleted (expected behavior) - redirect to my-gigs
        setTimeout(() => {
          navigate('/my-gigs');
        }, 2000);
      }
    } else {
      toast.error(result.payload || 'Failed to hire freelancer');
    }
    setHiring(false);
  };

  const sortedAndFilteredBids = [...bids]
    .filter(bid => filterStatus === 'all' || bid.status === filterStatus)
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (a.status === 'pending' && b.status !== 'pending') return -1;
      if (a.status !== 'pending' && b.status === 'pending') return 1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  const ownerId = currentGig?.ownerId?._id || currentGig?.ownerId;
  const userId = user?.id || user?._id;
  const isOwner = currentGig && isAuthenticated && ownerId && userId && ownerId.toString() === userId.toString();
  const hiredBid = bids.find(b => b.status === 'hired');

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
          <p className="mb-6" style={{ color: 'var(--color-text-secondary)' }}>
            This gig may have been deleted or doesn't exist. If you just hired someone, the gig was automatically removed from the marketplace.
          </p>
          <Link to="/my-gigs" className="premium-button inline-block">
            Back to My Gigs
          </Link>
        </div>
      </div>
    );
  }

  if (!isOwner) {
    return (
      <div className="min-h-screen bg-gradient-page flex items-center justify-center page-enter">
        <div className="text-center glass rounded-3xl shadow-2xl p-8 border" style={{ borderColor: 'var(--color-border)' }}>
          <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>Access Forbidden</h2>
          <p className="mb-6" style={{ color: 'var(--color-text-secondary)' }}>
            Only the client who posted this gig can review bids.
          </p>
          <Link to="/my-gigs" className="premium-button inline-block">
            Back to My Gigs
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
              {currentGig.createdAt && (
                <p className="text-sm mb-2" style={{ color: 'var(--color-text-muted)' }}>
                  Posted {formatDate(currentGig.createdAt)}
                </p>
              )}
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
              <p className="text-sm font-medium mb-1" style={{ color: 'var(--color-text-muted)' }}>Budget</p>
              <p className="text-5xl font-bold" style={{ color: 'var(--color-brand)' }}>
                ${(currentGig?.budget || 0).toLocaleString()}
              </p>
            </div>
            <Link to="/my-gigs" className="premium-button-secondary">
              ← Back to My Gigs
            </Link>
          </div>
        </div>

        {/* Hired Freelancer Display */}
        {hiredBid && (
          <div className="premium-card p-6 mb-8 badge-success border-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--color-brand-deep)' }}>
                  ✓ Freelancer Hired
                </h3>
                <p style={{ color: 'var(--color-text-primary)' }}>
                  <Link 
                    to={`/profile/${hiredBid.freelancerId?._id || hiredBid.freelancerId}`}
                    className="font-semibold hover:text-brand transition-colors"
                  >
                    {hiredBid.freelancerId?.username || 'Freelancer'}
                  </Link> has been hired for this project
                </p>
                <p className="text-lg font-bold mt-2" style={{ color: 'var(--color-brand)' }}>
                  Agreed Price: ${hiredBid.price.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Bids Section */}
        <div className="premium-card p-6 glass border" style={{ borderColor: 'var(--color-border)' }}>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>Bids Received</h2>
              {bids.length > 0 && (
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  {bids.filter(b => b.status === 'pending').length} pending bid{bids.filter(b => b.status === 'pending').length !== 1 ? 's' : ''} waiting for your response
                </p>
              )}
            </div>
            {bids.length > 0 && (
              <div className="flex gap-3">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="premium-input text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="hired">Hired</option>
                  <option value="rejected">Rejected</option>
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="premium-input text-sm"
                >
                  <option value="pending">Pending First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            )}
          </div>

          {bidsLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <BidCardSkeleton key={i} />
              ))}
            </div>
          ) : sortedAndFilteredBids.length === 0 ? (
            <div className="text-center py-12">
              <div className="mb-4">
                <svg className="w-16 h-16 mx-auto" style={{ color: 'var(--color-text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>No Bids Yet</h3>
              <p className="mb-4" style={{ color: 'var(--color-text-secondary)' }}>
                When users submit bids on your gig, they will appear here.
              </p>
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                You can then review each bid and accept the one that best fits your needs.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedAndFilteredBids.map((bid) => (
                <div
                  key={bid._id}
                  className={`premium-card p-5 card-hover ${
                    bid.status === 'hired' 
                      ? 'badge-success border-2' 
                      : bid.status === 'rejected'
                      ? 'badge-error border-2'
                      : ''
                  }`}
                  style={bid.status === 'pending' ? { border: '1px solid var(--color-border)' } : {}}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <Link
                        to={`/profile/${bid.freelancerId?._id || bid.freelancerId}`}
                        className="font-bold text-lg block transition-colors mb-1"
                        style={{ color: 'var(--color-text-primary)' }}
                        onMouseEnter={(e) => e.target.style.color = 'var(--color-brand)'}
                        onMouseLeave={(e) => e.target.style.color = 'var(--color-text-primary)'}
                      >
                        {bid.freelancerId?.username || 'Freelancer'}
                      </Link>
                      <a 
                        href={`mailto:${bid.freelancerId?.email || ''}`}
                        className="text-sm block transition-colors mb-1"
                        style={{ color: 'var(--color-text-secondary)' }}
                        onMouseEnter={(e) => e.target.style.color = 'var(--color-brand)'}
                        onMouseLeave={(e) => e.target.style.color = 'var(--color-text-secondary)'}
                      >
                        {bid.freelancerId?.email || ''}
                      </a>
                      {bid.createdAt && (
                        <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
                          Bid submitted {formatDate(bid.createdAt)}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold" style={{ color: 'var(--color-brand)' }}>
                        ${bid.price.toLocaleString()}
                      </p>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        bid.status === 'hired'
                          ? 'badge-success'
                          : bid.status === 'rejected'
                          ? 'badge-error'
                          : 'badge-pending'
                      }`}>
                        {bid.status}
                      </span>
                    </div>
                  </div>
                  <p className="mb-4 leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{bid.message}</p>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-4">
                    {bid.status === 'pending' && (currentGig?.status || 'open') === 'open' && !hiring && (
                      <>
                        <button
                          onClick={() => handleHireClick(bid._id)}
                          className="premium-button flex-1"
                        >
                          ✅ Accept & Hire This Freelancer
                        </button>
                        <Link
                          to={`/profile/${bid.freelancerId?._id || bid.freelancerId}`}
                          className="premium-button-secondary px-6"
                          title="View Freelancer Profile"
                        >
                          👤 Profile
                        </Link>
                      </>
                    )}
                    {bid.status === 'hired' && (
                      <div className="w-full p-3 badge-success rounded-lg text-center">
                        <p className="font-semibold" style={{ color: 'var(--color-brand-deep)' }}>
                          ✓ You have hired this freelancer
                        </p>
                      </div>
                    )}
                    {bid.status === 'rejected' && (
                      <div className="w-full p-3 badge-error rounded-lg text-center">
                        <p className="font-semibold" style={{ color: 'var(--color-text-secondary)' }}>
                          This bid was rejected
                        </p>
                      </div>
                    )}
                    {hiring && selectedBidId === bid._id && (
                      <button
                        disabled
                        className="premium-button flex-1 opacity-50 cursor-not-allowed"
                      >
                        Processing...
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Confirmation Modal */}
        <ConfirmationModal
          isOpen={showHireModal}
          onClose={() => {
            setShowHireModal(false);
            setSelectedBidId(null);
          }}
          onConfirm={handleHireConfirm}
          title="Confirm Hiring"
          message={`Are you sure you want to hire this freelancer? This action cannot be undone and will reject all other bids.`}
          confirmText="Yes, Hire"
          cancelText="Cancel"
          isLoading={hiring}
        />
      </div>
    </div>
  );
};

export default ClientReview;
