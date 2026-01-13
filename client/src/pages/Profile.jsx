import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile, fetchMyProfile } from '../store/slices/userSlice';
import { formatDate } from '../utils/dateUtils';
import toast from 'react-hot-toast';

const Profile = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profile, loading, error } = useSelector((state) => state.user);
  const { user: currentUser } = useSelector((state) => state.auth);
  const isOwnProfile = !userId || userId === currentUser?.id;

  useEffect(() => {
    if (isOwnProfile) {
      dispatch(fetchMyProfile());
    } else {
      dispatch(fetchUserProfile(userId));
    }
  }, [dispatch, userId, isOwnProfile]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-page flex items-center justify-center page-enter">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand mx-auto mb-4"></div>
          <p style={{ color: 'var(--color-text-secondary)' }}>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="min-h-screen bg-gradient-page flex items-center justify-center page-enter">
        <div className="text-center glass rounded-3xl shadow-2xl p-8 border" style={{ borderColor: 'var(--color-border)' }}>
          <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>Profile not found</h2>
          <p className="mb-6" style={{ color: 'var(--color-text-secondary)' }}>{error}</p>
          <Link
            to="/gigs"
            className="premium-button inline-block"
          >
            Go Back
          </Link>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gradient-page relative overflow-hidden page-enter" style={{ color: 'var(--color-text-primary)' }}>
      {/* Subtle background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blob-orange rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blob-ivory rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-2000"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Profile Header Card */}
        <div className="premium-card p-8 mb-8 glass border card-hover" style={{ borderColor: 'var(--color-border)' }}>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <div className="w-32 h-32 rounded-full flex items-center justify-center text-4xl font-bold text-white flex-shrink-0" style={{ backgroundColor: 'var(--color-brand)' }}>
              {profile.username?.charAt(0).toUpperCase() || 'U'}
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                {profile.username}
              </h1>
              <p className="text-lg mb-4" style={{ color: 'var(--color-text-secondary)' }}>
                  {profile.email}
              </p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <span className="px-4 py-2 rounded-full text-sm font-semibold" style={{ 
                  backgroundColor: 'var(--color-brand-tint)', 
                  color: 'var(--color-brand)',
                  border: '1px solid var(--color-brand)'
                }}>
                  {profile.role === 'freelancer' ? '👨‍💻 Freelancer' : '👔 Client'}
                </span>
                {profile.createdAt && (
                  <span className="px-4 py-2 rounded-full text-sm" style={{ 
                    backgroundColor: 'var(--color-surface)', 
                    color: 'var(--color-text-secondary)',
                    border: '1px solid var(--color-border)'
                  }}>
                    Joined {formatDate(profile.createdAt)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {profile.role === 'freelancer' ? (
            <>
              <div className="premium-card p-6 text-center card-hover">
                <div className="text-3xl font-bold mb-2" style={{ color: 'var(--color-brand)' }}>
                  {profile.stats?.totalBids || 0}
                </div>
                <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Total Bids</div>
              </div>
              <div className="premium-card p-6 text-center card-hover">
                <div className="text-3xl font-bold mb-2" style={{ color: 'var(--color-brand)' }}>
                  {profile.stats?.hiredCount || 0}
                </div>
                <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Projects Hired</div>
              </div>
              <div className="premium-card p-6 text-center card-hover">
                <div className="text-3xl font-bold mb-2" style={{ color: 'var(--color-brand)' }}>
                  ${(profile.stats?.totalEarnings || 0).toLocaleString()}
                </div>
                <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Total Earnings</div>
              </div>
              <div className="premium-card p-6 text-center card-hover">
                <div className="text-3xl font-bold mb-2" style={{ color: 'var(--color-brand)' }}>
                  {profile.stats?.totalBids > 0 
                    ? Math.round((profile.stats?.hiredCount / profile.stats?.totalBids) * 100) 
                    : 0}%
                </div>
                <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Success Rate</div>
              </div>
            </>
          ) : (
            <>
              <div className="premium-card p-6 text-center card-hover">
                <div className="text-3xl font-bold mb-2" style={{ color: 'var(--color-brand)' }}>
                  {profile.stats?.totalGigs || 0}
                </div>
                <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Gigs Posted</div>
              </div>
            </>
          )}
        </div>

        {/* Contact Information */}
        <div className="premium-card p-6 glass border" style={{ borderColor: 'var(--color-border)' }}>
          <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>Contact Information</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5" style={{ color: 'var(--color-brand)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <a 
                href={`mailto:${profile.email}`}
                className="text-lg font-medium transition-colors"
                style={{ color: 'var(--color-brand)' }}
                onMouseEnter={(e) => e.target.style.color = 'var(--color-brand-deep)'}
                onMouseLeave={(e) => e.target.style.color = 'var(--color-brand)'}
              >
                {profile.email}
              </a>
            </div>
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5" style={{ color: 'var(--color-brand)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-lg" style={{ color: 'var(--color-text-secondary)' }}>
                {profile.role === 'freelancer' ? 'Freelancer' : 'Client'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4 justify-center">
          <Link
            to="/gigs"
            className="premium-button-secondary px-6 py-3"
          >
            Browse Gigs
          </Link>
          {isOwnProfile && (
            <>
              {currentUser?.role === 'client' && (
                <Link
                  to="/create-gig"
                  className="premium-button px-6 py-3"
                >
                  Post a Gig
                </Link>
              )}
              {currentUser?.role === 'freelancer' && (
                <Link
                  to="/my-bids"
                  className="premium-button px-6 py-3"
                >
                  My Bids
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
