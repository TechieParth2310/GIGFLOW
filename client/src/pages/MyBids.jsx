import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchMyBids } from '../store/slices/bidSlice';
import { BidCardSkeleton } from '../components/Skeleton';
import { EmptyBids } from '../components/EmptyState';
import { formatDate } from '../utils/dateUtils';
import toast from 'react-hot-toast';

const MyBids = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { myBids, loading } = useSelector((state) => state.bids);

  useEffect(() => {
    dispatch(fetchMyBids());
  }, [dispatch]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'hired':
        return 'badge-success';
      case 'rejected':
        return 'badge-error';
      default:
        return 'badge-pending';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-page relative overflow-hidden page-enter" style={{ color: 'var(--color-text-primary)' }}>
      {/* Subtle background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-blob-orange rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-blob-ivory rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-2000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <h1 className="text-5xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
          My Bids
        </h1>
        <p className="text-lg mb-8 font-medium" style={{ color: 'var(--color-text-secondary)' }}>
          Track all your submitted bids and their status
        </p>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <BidCardSkeleton key={i} />
            ))}
          </div>
        ) : myBids.length === 0 ? (
          <EmptyBids onAction={() => window.location.href = '/gigs'} />
        ) : (
          <>
            {(() => {
              const hiredBids = myBids.filter(bid => bid.status === 'hired');
              const otherBids = myBids.filter(bid => bid.status !== 'hired');
              
              return (
                <>
                  {/* Hired Bids Section - Show prominently at top */}
                  {hiredBids.length > 0 && (
                    <div className="mb-12">
                      <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
                        🎉 Hired Projects ({hiredBids.length})
                      </h2>
                      <p className="text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>
                        Congratulations! You've been hired for these projects
                      </p>
                      <div className="space-y-4">
                        {hiredBids.map((bid) => (
                          <div
                            key={bid._id}
                            className="premium-card p-6 card-hover badge-success border-2"
                          >
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex-1">
                                <Link
                                  to={`/gigs/${bid.gigId?._id || bid.gigId}`}
                                  className="text-2xl font-bold mb-2 block transition-colors"
                                  style={{ color: 'var(--color-text-primary)' }}
                                  onMouseEnter={(e) => e.target.style.color = 'var(--color-brand)'}
                                  onMouseLeave={(e) => e.target.style.color = 'var(--color-text-primary)'}
                                >
                                  {bid.gigId?.title || 'Gig'}
                                </Link>
                                {bid.createdAt && (
                                  <p className="text-sm mb-2" style={{ color: 'var(--color-text-muted)' }}>
                                    Bid submitted {formatDate(bid.createdAt)}
                                  </p>
                                )}
                                <div className="flex items-center gap-3 mb-2">
                                  <span className="px-3 py-1 rounded-full text-xs font-semibold border badge-success">
                                    Hired
                                  </span>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-xs mb-1 font-medium" style={{ color: 'var(--color-text-muted)' }}>Your Price</p>
                                <span className="text-3xl font-bold" style={{ color: 'var(--color-brand)' }}>
                                  ${bid.price.toLocaleString()}
                                </span>
                              </div>
                            </div>
                            <p className="mb-4 leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{bid.message}</p>
                            <div className="mt-4 p-4 badge-success rounded-lg border-2">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-bold text-lg mb-1" style={{ color: 'var(--color-brand-deep)' }}>
                                    🎉 Congratulations! You've been hired!
                                  </p>
                                  <p className="text-sm" style={{ color: 'var(--color-text-primary)' }}>
                                    The client has accepted your bid for this project.
                                  </p>
                                </div>
                                <Link
                                  to={`/gigs/${bid.gigId?._id || bid.gigId}`}
                                  className="premium-button text-sm px-4 py-2"
                                >
                                  View Gig
                                </Link>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Other Bids Section */}
                  {otherBids.length > 0 && (
                    <div>
                      <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
                        All Bids ({otherBids.length})
                      </h2>
                      <p className="text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>
                        Your other submitted bids
                      </p>
                      <div className="space-y-4">
                        {otherBids.map((bid) => (
              <div
                key={bid._id}
                className={`premium-card p-6 card-hover ${
                  bid.status === 'hired'
                    ? 'badge-success border-2'
                    : bid.status === 'rejected'
                    ? 'badge-error border-2'
                    : ''
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <Link
                      to={`/gigs/${bid.gigId?._id || bid.gigId}`}
                      className="text-2xl font-bold mb-2 block transition-colors"
                      style={{ color: 'var(--color-text-primary)' }}
                      onMouseEnter={(e) => e.target.style.color = 'var(--color-brand)'}
                      onMouseLeave={(e) => e.target.style.color = 'var(--color-text-primary)'}
                    >
                      {bid.gigId?.title || 'Gig'}
                    </Link>
                    {bid.createdAt && (
                      <p className="text-sm mb-2" style={{ color: 'var(--color-text-muted)' }}>
                        Bid submitted {formatDate(bid.createdAt)}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(bid.status)}`}>
                        {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                      </span>
                      {bid.totalBids !== undefined && bid.status === 'pending' && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ 
                          backgroundColor: 'var(--color-brand-tint)', 
                          color: 'var(--color-brand)',
                          border: '1px solid var(--color-brand)'
                        }}>
                          {bid.totalBids} {bid.totalBids === 1 ? 'bid' : 'bids'} total
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs mb-1 font-medium" style={{ color: 'var(--color-text-muted)' }}>Your Price</p>
                    <span className="text-3xl font-bold" style={{ color: 'var(--color-brand)' }}>
                      ${bid.price.toLocaleString()}
                    </span>
                  </div>
                </div>
                <p className="mb-4 leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{bid.message}</p>
                    {bid.status === 'hired' && (
                      <div className="mt-4 p-4 badge-success rounded-lg border-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-bold text-lg mb-1" style={{ color: 'var(--color-brand-deep)' }}>
                              🎉 Congratulations! You've been hired!
                            </p>
                            <p className="text-sm" style={{ color: 'var(--color-text-primary)' }}>
                              The client has accepted your bid for this project.
                            </p>
                          </div>
                          <Link
                            to={`/gigs/${bid.gigId?._id || bid.gigId}`}
                            className="premium-button text-sm px-4 py-2"
                          >
                            View Gig
                          </Link>
                        </div>
                      </div>
                    )}
                    {bid.status === 'rejected' && (
                      <div className="mt-4 p-3 badge-error rounded-lg">
                        <p className="font-semibold text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                          This bid was not selected for this project.
                        </p>
                      </div>
                    )}
              </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              );
            })()}
          </>
        )}
      </div>
    </div>
  );
};

export default MyBids;
