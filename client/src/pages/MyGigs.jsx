import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchMyGigs, deleteGig } from '../store/slices/gigSlice';
import { GigCardSkeleton } from '../components/Skeleton';
import ConfirmationModal from '../components/ConfirmationModal';
import { formatDate } from '../utils/dateUtils';
import toast from 'react-hot-toast';

const MyGigs = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { myGigs, loading, error } = useSelector((state) => state.gigs);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [gigToDelete, setGigToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchMyGigs());
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleDeleteClick = (gig) => {
    setGigToDelete(gig);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!gigToDelete) return;
    
    setDeleting(true);
    const result = await dispatch(deleteGig(gigToDelete._id));
    
    if (deleteGig.fulfilled.match(result)) {
      toast.success('Gig deleted successfully');
      setShowDeleteModal(false);
      setGigToDelete(null);
      // Refresh the list
      dispatch(fetchMyGigs());
    } else {
      toast.error(result.payload || 'Failed to delete gig');
    }
    setDeleting(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-page flex items-center justify-center page-enter">
        <div className="text-center glass rounded-3xl shadow-2xl p-8 border" style={{ borderColor: 'var(--color-border)' }}>
          <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>Please Login</h2>
          <p className="mb-6" style={{ color: 'var(--color-text-secondary)' }}>You need to be logged in to view your gigs.</p>
          <Link to="/login" className="premium-button inline-block">
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-page relative overflow-hidden page-enter" style={{ color: 'var(--color-text-primary)' }}>
      {/* Subtle background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-blob-orange rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-blob-ivory rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-2000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
            My Gigs
          </h1>
          <p className="text-lg mb-4 font-medium" style={{ color: 'var(--color-text-secondary)' }}>
            Manage your posted gigs and review applications
          </p>
          <Link
            to="/create-gig"
            className="premium-button inline-block"
          >
            + Post New Gig
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <GigCardSkeleton key={i} />
            ))}
          </div>
        ) : myGigs.length === 0 ? (
          <div className="text-center py-16 glass rounded-3xl shadow-2xl p-8 border" style={{ borderColor: 'var(--color-border)' }}>
            <div className="mb-4">
              <svg className="w-24 h-24 mx-auto" style={{ color: 'var(--color-text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>No Gigs Yet</h3>
            <p className="mb-6" style={{ color: 'var(--color-text-secondary)' }}>
              You haven't posted any gigs yet. Start by creating your first gig!
            </p>
            <Link to="/create-gig" className="premium-button inline-block">
              Post Your First Gig
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myGigs.map((gig) => (
              <div
                key={gig._id}
                className="premium-card overflow-hidden group cursor-pointer h-full flex flex-col card-hover"
              >
                {/* Status Badge Header */}
                <div className={`h-2 ${
                  gig.status === 'open' 
                    ? 'bg-gradient-to-r from-orange-400 to-amber-400' 
                    : 'bg-gradient-to-r from-gray-400 to-gray-500'
                }`}></div>
                
                <div className="p-6 flex-grow">
                  <div className="flex justify-between items-start mb-4">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                      gig.status === 'open' 
                        ? 'badge-pending' 
                        : ''
                    }`} style={gig.status !== 'open' ? {
                      backgroundColor: 'var(--color-surface)',
                      color: 'var(--color-text-secondary)',
                      border: '1px solid var(--color-border)'
                    } : {}}>
                      {gig.status === 'open' ? 'Open' : 'Assigned'}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold mb-3 line-clamp-2 transition-all duration-300 group-hover:text-brand" style={{ color: 'var(--color-text-primary)' }}>
                    {gig.title}
                  </h3>

                  <p className="mb-4 line-clamp-3 text-sm leading-relaxed transition-colors" style={{ color: 'var(--color-text-secondary)' }}>
                    {gig.description}
                  </p>

                  {gig.createdAt && (
                    <p className="text-xs mb-4" style={{ color: 'var(--color-text-muted)' }}>
                      Posted {formatDate(gig.createdAt)}
                    </p>
                  )}
                </div>

                <div className="card-footer flex items-center justify-between border-t pt-3 mt-4 px-6 pb-6" style={{ borderColor: 'var(--color-border)' }}>
                  <div>
                    <p className="text-xs mb-1 font-medium" style={{ color: 'var(--color-text-muted)' }}>Budget</p>
                    <span className="text-2xl font-bold" style={{ color: 'var(--color-brand)' }}>
                      ${gig.budget.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {gig.status === 'open' ? (
                      <Link
                        to={`/gigs/${gig._id}/review`}
                        className="premium-button text-sm px-4 py-2"
                      >
                        View Bids
                      </Link>
                    ) : (
                      <Link
                        to={`/gigs/${gig._id}/review`}
                        className="premium-button-secondary text-sm px-4 py-2"
                      >
                        View Result
                      </Link>
                    )}
                    <button
                      onClick={() => handleDeleteClick(gig)}
                      className="premium-button-secondary text-sm px-4 py-2"
                      style={{ 
                        backgroundColor: 'var(--color-error-tint)',
                        borderColor: 'var(--color-error)',
                        color: 'var(--color-error)'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = 'var(--color-error)';
                        e.target.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'var(--color-error-tint)';
                        e.target.style.color = 'var(--color-error)';
                      }}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setGigToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Gig"
        message={`Are you sure you want to delete "${gigToDelete?.title}"? This action cannot be undone. All bids associated with this gig will also be removed.`}
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={deleting}
      />
    </div>
  );
};

export default MyGigs;
