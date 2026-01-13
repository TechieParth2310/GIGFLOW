import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchGigs } from '../store/slices/gigSlice';
import { GigCardSkeleton } from '../components/Skeleton';
import { EmptyGigs, EmptySearchResults } from '../components/EmptyState';
import { formatDate } from '../utils/dateUtils';
import toast from 'react-hot-toast';

// Card gradient colors array - Orange + Ivory theme
const cardGradients = [
  'from-orange-50 via-amber-50 to-yellow-50',
  'from-amber-50 via-orange-50 to-rose-50',
  'from-yellow-50 via-orange-50 to-amber-50',
  'from-rose-50 via-orange-50 to-yellow-50',
  'from-orange-50 via-yellow-50 to-amber-50',
  'from-amber-50 via-yellow-50 to-orange-50',
];

const Gigs = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { gigs, loading, error, pagination } = useSelector((state) => state.gigs);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    dispatch(fetchGigs({ search: '', page: currentPage, limit }));
  }, [dispatch, currentPage]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    dispatch(fetchGigs({ search, page: 1, limit }));
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    dispatch(fetchGigs({ search, page: newPage, limit }));
  };

  const handleClearSearch = () => {
    setSearch('');
    setCurrentPage(1);
    dispatch(fetchGigs({ search: '', page: 1, limit }));
  };

  return (
    <div className="min-h-screen bg-gradient-page relative overflow-hidden page-enter" style={{ color: 'var(--color-text-primary)' }}>
      {/* Subtle background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blob-orange rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blob-ivory rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Header Section */}
        <div className="mb-10 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4" style={{ color: 'var(--color-text-primary)' }}>
            Browse Gigs
          </h1>
          <p className="text-xl font-medium mb-8" style={{ color: 'var(--color-text-secondary)' }}>Discover amazing opportunities from clients worldwide</p>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mt-6 max-w-2xl mx-auto">
            <div className="flex gap-3">
              <div className="flex-1 relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 transition-colors" style={{ color: 'var(--color-brand)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search gigs by title or description..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="premium-input pl-10"
                />
              </div>
              <button
                type="submit"
                className="premium-button px-8"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <GigCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="premium-card p-4 mb-6" style={{ 
            backgroundColor: 'rgba(239, 68, 68, 0.1)', 
            borderLeft: '4px solid #DC2626',
            color: '#DC2626'
          }}>
            <div className="flex items-start">
              <svg className="h-5 w-5 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-semibold mb-1">Error Loading Gigs</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Gigs Grid */}
        {!loading && !error && (
          <>
            {gigs.length === 0 ? (
              search ? (
                <EmptySearchResults searchTerm={search} onClear={handleClearSearch} />
              ) : (
                <EmptyGigs onAction={() => navigate('/create-gig')} />
              )
            ) : (
              <>
                {/* Results Info */}
                <div className="mb-4 flex justify-between items-center">
                  <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    Showing <span className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                      {((currentPage - 1) * limit) + 1}-{Math.min(currentPage * limit, pagination.total)}
                    </span> of <span className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>{pagination.total}</span> gigs
                  </div>
                </div>

                {/* Gigs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 items-stretch">
                  {gigs.map((gig, index) => {
                    const gradientClass = cardGradients[index % cardGradients.length];
                    return (
                      <Link
                        key={gig._id}
                        to={`/gigs/${gig._id}`}
                        className="premium-card overflow-hidden group cursor-pointer h-full flex flex-col card-hover"
                      >
                        {/* Gradient Header - Orange theme */}
                        <div className={`h-2 bg-gradient-to-r ${gradientClass} relative overflow-hidden flex-shrink-0`}>
                          <div className="absolute inset-0 shimmer"></div>
                        </div>
                        
                        {/* Card Body - Flex Grow */}
                        <div className="p-6 flex-grow flex flex-col">
                          {/* Status Badge */}
                          <div className="flex justify-between items-start mb-4 flex-shrink-0">
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
                            <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${gradientClass} opacity-0 group-hover:opacity-60 transition-all duration-300`}></div>
                          </div>

                          {/* Title */}
                          <h3 className="text-xl font-bold mb-3 line-clamp-2 transition-all duration-300 group-hover:text-brand flex-shrink-0" style={{ color: 'var(--color-text-primary)' }}>
                            {gig.title}
                          </h3>

                          {/* Description */}
                          <p className="mb-4 line-clamp-3 text-sm leading-relaxed transition-colors flex-grow" style={{ color: 'var(--color-text-secondary)' }}>
                            {gig.description}
                          </p>

                          {/* Posted Date */}
                          {gig.createdAt && (
                            <p className="text-xs mb-4 flex-shrink-0" style={{ color: 'var(--color-text-muted)' }}>
                              Posted {formatDate(gig.createdAt)}
                            </p>
                          )}
                        </div>

                        {/* Footer */}
                        <div className="px-6 pb-6 pt-4 border-t flex-shrink-0" style={{ borderColor: 'var(--color-border)' }}>
                          <div className="flex justify-between items-center mb-3">
                            <div>
                              <p className="text-xs mb-1 font-medium" style={{ color: 'var(--color-text-muted)' }}>Budget</p>
                              <span className="text-2xl font-bold" style={{ color: 'var(--color-brand)' }}>
                                ${gig.budget.toLocaleString()}
                              </span>
                            </div>
                            <div className="text-right">
                              <p className="text-xs mb-1 font-medium" style={{ color: 'var(--color-text-muted)' }}>Posted by</p>
                              <Link
                                to={`/profile/${gig.ownerId?._id || gig.ownerId}`}
                                className="text-sm font-semibold block transition-colors"
                                style={{ color: 'var(--color-text-primary)' }}
                                onMouseEnter={(e) => e.target.style.color = 'var(--color-brand)'}
                                onMouseLeave={(e) => e.target.style.color = 'var(--color-text-primary)'}
                              >
                                {gig.ownerId?.username || 'Client'}
                              </Link>
                            </div>
                          </div>
                          {/* Arrow below Posted by - appears on hover */}
                          <div className="flex justify-end mt-2">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center shadow-sm transition-all duration-300 opacity-0 group-hover:opacity-100" style={{ 
                              backgroundColor: 'var(--color-brand-tint)', 
                              border: '1px solid var(--color-brand)' 
                            }}>
                              <svg className="w-4 h-4" style={{ color: 'var(--color-brand)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between border-t pt-6" style={{ borderColor: 'var(--color-border)' }}>
                    <div className="flex-1 flex justify-between sm:hidden">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ 
                          backgroundColor: 'var(--color-surface)',
                          border: '1px solid var(--color-border)',
                          color: 'var(--color-text-primary)'
                        }}
                        onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = 'var(--color-brand-tint)')}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-surface)'}
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === pagination.totalPages}
                        className="ml-3 relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ 
                          backgroundColor: 'var(--color-surface)',
                          border: '1px solid var(--color-border)',
                          color: 'var(--color-text-primary)'
                        }}
                        onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = 'var(--color-brand-tint)')}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-surface)'}
                      >
                        Next
                      </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                          Page <span className="font-medium" style={{ color: 'var(--color-text-primary)' }}>{currentPage}</span> of <span className="font-medium" style={{ color: 'var(--color-text-primary)' }}>{pagination.totalPages}</span>
                        </p>
                      </div>
                      <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                          <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center px-2 py-2 rounded-l-md text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ 
                              backgroundColor: 'var(--color-surface)',
                              border: '1px solid var(--color-border)',
                              color: 'var(--color-text-secondary)'
                            }}
                            onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = 'var(--color-brand-tint)')}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-surface)'}
                          >
                            <span className="sr-only">Previous</span>
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </button>
                          {[...Array(pagination.totalPages)].map((_, i) => {
                            const page = i + 1;
                            if (
                              page === 1 ||
                              page === pagination.totalPages ||
                              (page >= currentPage - 1 && page <= currentPage + 1)
                            ) {
                              return (
                                <button
                                  key={page}
                                  onClick={() => handlePageChange(page)}
                                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-all ${
                                    currentPage === page ? 'z-10' : ''
                                  }`}
                                  style={currentPage === page ? {
                                    backgroundColor: 'var(--color-brand-tint)',
                                    borderColor: 'var(--color-brand)',
                                    color: 'var(--color-brand)'
                                  } : {
                                    backgroundColor: 'var(--color-surface)',
                                    border: '1px solid var(--color-border)',
                                    color: 'var(--color-text-secondary)'
                                  }}
                                  onMouseEnter={(e) => currentPage !== page && (e.currentTarget.style.backgroundColor = 'var(--color-brand-tint)')}
                                  onMouseLeave={(e) => currentPage !== page && (e.currentTarget.style.backgroundColor = 'var(--color-surface)')}
                                >
                                  {page}
                                </button>
                              );
                            } else if (page === currentPage - 2 || page === currentPage + 2) {
                              return <span key={page} className="relative inline-flex items-center px-4 py-2 border text-sm font-medium" style={{ 
                                borderColor: 'var(--color-border)',
                                backgroundColor: 'var(--color-surface)',
                                color: 'var(--color-text-secondary)'
                              }}>...</span>;
                            }
                            return null;
                          })}
                          <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === pagination.totalPages}
                            className="relative inline-flex items-center px-2 py-2 rounded-r-md text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ 
                              backgroundColor: 'var(--color-surface)',
                              border: '1px solid var(--color-border)',
                              color: 'var(--color-text-secondary)'
                            }}
                            onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = 'var(--color-brand-tint)')}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-surface)'}
                          >
                            <span className="sr-only">Next</span>
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </nav>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Gigs;
