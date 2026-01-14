import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { logout } from '../store/slices/authSlice';
import { clearNotifications } from '../store/slices/notificationSlice';
import { toggleTheme } from '../store/slices/themeSlice';
import { toggleMode } from '../store/slices/modeSlice';
import { disconnectSocket } from '../services/socket';
import toast from 'react-hot-toast';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { notifications } = useSelector((state) => state.notifications);
  const { mode } = useSelector((state) => state.theme);
  const { mode: userMode } = useSelector((state) => state.mode); // Client or Freelancer mode
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      disconnectSocket();
      dispatch(clearNotifications());
      await dispatch(logout());
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const isActive = (path) => location.pathname === path;
  
  // Get hover color based on theme mode
  const getHoverColor = () => {
    return mode === 'dark' ? '#CCFF00' : '#38BDF8'; // Neon for dark, blue for light
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl shadow-md border-b" style={{ 
      backgroundColor: 'var(--color-surface)', 
      borderColor: 'var(--color-border)' 
    }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link 
              to="/" 
              className="text-xl sm:text-2xl font-bold transition-colors"
              style={{ color: 'var(--color-text-primary)' }}
              onMouseEnter={(e) => e.target.style.color = getHoverColor()}
              onMouseLeave={(e) => e.target.style.color = 'var(--color-text-primary)'}
            >
              GigFlow
            </Link>
            {/* Desktop Navigation */}
            <div className="hidden md:flex ml-6 lg:ml-10 items-center space-x-1">
              {isAuthenticated ? (
                <>
                  {/* Mode Toggle */}
                  <button
                    onClick={() => dispatch(toggleMode())}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all mr-2"
                    style={{ 
                      backgroundColor: userMode === 'client' ? 'var(--color-brand-tint)' : 'var(--color-surface)',
                      borderColor: userMode === 'client' ? 'var(--color-brand)' : 'var(--color-border)',
                      color: userMode === 'client' ? 'var(--color-brand)' : 'var(--color-text-secondary)'
                    }}
                    title={`Switch to ${userMode === 'client' ? 'Freelancer' : 'Client'} Mode`}
                  >
                    {userMode === 'client' ? '👔 Client' : '💼 Freelancer'}
                  </button>

                  {/* Client Mode Navigation */}
                  {userMode === 'client' ? (
                    <>
                      <Link
                        to="/create-gig"
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all relative ${
                          isActive('/create-gig')
                            ? 'font-semibold'
                            : ''
                        }`}
                        style={{ 
                          color: isActive('/create-gig') ? 'var(--color-brand)' : 'var(--color-text-secondary)' 
                        }}
                        onMouseEnter={(e) => !isActive('/create-gig') && (e.target.style.color = getHoverColor())}
                        onMouseLeave={(e) => isActive('/create-gig') && (e.target.style.color = isActive('/create-gig') ? 'var(--color-brand)' : 'var(--color-text-secondary)')}
                      >
                        Post Gig
                        {isActive('/create-gig') && (
                          <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full" style={{ backgroundColor: 'var(--color-brand)' }}></span>
                        )}
                      </Link>
                      <Link
                        to="/my-gigs"
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all relative ${
                          isActive('/my-gigs')
                            ? 'font-semibold'
                            : ''
                        }`}
                        style={{ 
                          color: isActive('/my-gigs') ? 'var(--color-brand)' : 'var(--color-text-secondary)' 
                        }}
                        onMouseEnter={(e) => !isActive('/my-gigs') && (e.target.style.color = getHoverColor())}
                        onMouseLeave={(e) => isActive('/my-gigs') && (e.target.style.color = isActive('/my-gigs') ? 'var(--color-brand)' : 'var(--color-text-secondary)')}
                      >
                        My Gigs
                        {isActive('/my-gigs') && (
                          <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full" style={{ backgroundColor: 'var(--color-brand)' }}></span>
                        )}
                      </Link>
                    </>
                  ) : (
                    <>
                      {/* Freelancer Mode Navigation */}
                      <Link
                        to="/gigs"
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all relative ${
                          isActive('/gigs')
                            ? 'font-semibold'
                            : ''
                        }`}
                        style={{ 
                          color: isActive('/gigs') ? 'var(--color-brand)' : 'var(--color-text-secondary)' 
                        }}
                        onMouseEnter={(e) => !isActive('/gigs') && (e.target.style.color = getHoverColor())}
                        onMouseLeave={(e) => isActive('/gigs') && (e.target.style.color = isActive('/gigs') ? 'var(--color-brand)' : 'var(--color-text-secondary)')}
                      >
                        Browse Gigs
                        {isActive('/gigs') && (
                          <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full" style={{ backgroundColor: 'var(--color-brand)' }}></span>
                        )}
                      </Link>
                      <Link
                        to="/my-bids"
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all relative ${
                          isActive('/my-bids')
                            ? 'font-semibold'
                            : ''
                        }`}
                        style={{ 
                          color: isActive('/my-bids') ? 'var(--color-brand)' : 'var(--color-text-secondary)' 
                        }}
                        onMouseEnter={(e) => !isActive('/my-bids') && (e.target.style.color = getHoverColor())}
                        onMouseLeave={(e) => isActive('/my-bids') && (e.target.style.color = isActive('/my-bids') ? 'var(--color-brand)' : 'var(--color-text-secondary)')}
                      >
                        My Bids
                        {isActive('/my-bids') && (
                          <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full" style={{ backgroundColor: 'var(--color-brand)' }}></span>
                        )}
                      </Link>
                    </>
                  )}
                  
                  {/* Common Navigation */}
                  <Link
                    to="/notifications"
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all relative ${
                      isActive('/notifications')
                        ? 'font-semibold'
                        : ''
                    }`}
                    style={{ 
                      color: isActive('/notifications') ? 'var(--color-brand)' : 'var(--color-text-secondary)' 
                    }}
                    onMouseEnter={(e) => !isActive('/notifications') && (e.target.style.color = getHoverColor())}
                    onMouseLeave={(e) => isActive('/notifications') && (e.target.style.color = isActive('/notifications') ? 'var(--color-brand)' : 'var(--color-text-secondary)')}
                  >
                    Notifications
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-sm" style={{ backgroundColor: 'var(--color-brand)' }}>
                        {unreadCount}
                      </span>
                    )}
                    {isActive('/notifications') && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full" style={{ backgroundColor: 'var(--color-brand)' }}></span>
                    )}
                  </Link>
                </>
              ) : (
                <Link
                  to="/gigs"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all relative ${
                    isActive('/gigs')
                      ? 'font-semibold'
                      : ''
                  }`}
                  style={{ 
                    color: isActive('/gigs') ? 'var(--color-brand)' : 'var(--color-text-secondary)' 
                  }}
                  onMouseEnter={(e) => !isActive('/gigs') && (e.target.style.color = getHoverColor())}
                  onMouseLeave={(e) => isActive('/gigs') && (e.target.style.color = isActive('/gigs') ? 'var(--color-brand)' : 'var(--color-text-secondary)')}
                >
                  Browse Gigs
                  {isActive('/gigs') && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full" style={{ backgroundColor: 'var(--color-brand)' }}></span>
                  )}
                </Link>
              )}
            </div>
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden ml-4 p-2 rounded-lg"
              style={{ color: 'var(--color-text-primary)' }}
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Dark Mode Toggle */}
            <button
              onClick={() => dispatch(toggleTheme())}
              className="p-2 rounded-lg transition-all"
              style={{ 
                color: 'var(--color-text-secondary)',
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'var(--color-brand-tint)';
                e.target.style.color = 'var(--color-brand)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = 'var(--color-text-secondary)';
              }}
              aria-label="Toggle dark mode"
            >
              {mode === 'dark' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all card-hover"
                  style={{ 
                    backgroundColor: 'var(--color-brand-tint)', 
                    borderColor: 'var(--color-border)' 
                  }}
                >
                  <div className="h-8 w-8 rounded-full flex items-center justify-center font-semibold text-sm text-white" style={{ backgroundColor: 'var(--color-brand)' }}>
                    {user?.username?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-sm" style={{ color: 'var(--color-text-primary)' }}>
                      {user?.username}
                    </span>
                    <span className="text-xs font-semibold capitalize" style={{ color: 'var(--color-brand)' }}>
                      {userMode === 'client' ? 'Client' : 'Freelancer'}
                    </span>
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg text-sm font-semibold border transition-all"
                  style={{ 
                    backgroundColor: 'var(--color-surface)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text-primary)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'var(--color-brand-tint)';
                    e.target.style.borderColor = 'var(--color-brand)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'var(--color-surface)';
                    e.target.style.borderColor = 'var(--color-border)';
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 font-semibold rounded-lg text-sm transition-all"
                  style={{ color: 'var(--color-text-secondary)' }}
                  onMouseEnter={(e) => e.target.style.color = getHoverColor()}
                  onMouseLeave={(e) => e.target.style.color = 'var(--color-text-secondary)'}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="premium-button px-6 py-2 text-sm"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
          {/* Mobile Right Side */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={() => dispatch(toggleTheme())}
              className="p-2 rounded-lg"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {mode === 'dark' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            {!isAuthenticated && (
              <Link
                to="/login"
                className="px-3 py-1.5 text-xs font-semibold rounded-lg"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Login
              </Link>
            )}
          </div>
        </div>
        
        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t" style={{ borderColor: 'var(--color-border)' }}>
            <div className="px-2 pt-2 pb-3 space-y-1">
              {isAuthenticated ? (
                <>
                  {/* Mode Toggle */}
                  <button
                    onClick={() => dispatch(toggleMode())}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold border"
                    style={{ 
                      backgroundColor: userMode === 'client' ? 'var(--color-brand-tint)' : 'var(--color-surface)',
                      borderColor: userMode === 'client' ? 'var(--color-brand)' : 'var(--color-border)',
                      color: userMode === 'client' ? 'var(--color-brand)' : 'var(--color-text-secondary)'
                    }}
                  >
                    {userMode === 'client' ? '👔 Client Mode' : '💼 Freelancer Mode'}
                  </button>
                  
                  {/* Client Mode Navigation */}
                  {userMode === 'client' ? (
                    <>
                      <Link
                        to="/create-gig"
                        onClick={() => setMobileMenuOpen(false)}
                        className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                          isActive('/create-gig') ? 'font-semibold' : ''
                        }`}
                        style={{ 
                          color: isActive('/create-gig') ? 'var(--color-brand)' : 'var(--color-text-secondary)',
                          backgroundColor: isActive('/create-gig') ? 'var(--color-brand-tint)' : 'transparent'
                        }}
                      >
                        Post Gig
                      </Link>
                      <Link
                        to="/my-gigs"
                        onClick={() => setMobileMenuOpen(false)}
                        className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                          isActive('/my-gigs') ? 'font-semibold' : ''
                        }`}
                        style={{ 
                          color: isActive('/my-gigs') ? 'var(--color-brand)' : 'var(--color-text-secondary)',
                          backgroundColor: isActive('/my-gigs') ? 'var(--color-brand-tint)' : 'transparent'
                        }}
                      >
                        My Gigs
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/gigs"
                        onClick={() => setMobileMenuOpen(false)}
                        className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                          isActive('/gigs') ? 'font-semibold' : ''
                        }`}
                        style={{ 
                          color: isActive('/gigs') ? 'var(--color-brand)' : 'var(--color-text-secondary)',
                          backgroundColor: isActive('/gigs') ? 'var(--color-brand-tint)' : 'transparent'
                        }}
                      >
                        Browse Gigs
                      </Link>
                      <Link
                        to="/my-bids"
                        onClick={() => setMobileMenuOpen(false)}
                        className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                          isActive('/my-bids') ? 'font-semibold' : ''
                        }`}
                        style={{ 
                          color: isActive('/my-bids') ? 'var(--color-brand)' : 'var(--color-text-secondary)',
                          backgroundColor: isActive('/my-bids') ? 'var(--color-brand-tint)' : 'transparent'
                        }}
                      >
                        My Bids
                      </Link>
                    </>
                  )}
                  
                  <Link
                    to="/notifications"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-3 py-2 rounded-lg text-sm font-medium relative ${
                      isActive('/notifications') ? 'font-semibold' : ''
                    }`}
                    style={{ 
                      color: isActive('/notifications') ? 'var(--color-brand)' : 'var(--color-text-secondary)',
                      backgroundColor: isActive('/notifications') ? 'var(--color-brand-tint)' : 'transparent'
                    }}
                  >
                    Notifications
                    {unreadCount > 0 && (
                      <span className="ml-2 text-xs font-bold rounded-full px-1.5 py-0.5 text-white" style={{ backgroundColor: 'var(--color-brand)' }}>
                        {unreadCount}
                      </span>
                    )}
                  </Link>
                  
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-medium"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    Profile
                  </Link>
                  
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold border"
                    style={{ 
                      backgroundColor: 'var(--color-surface)',
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-text-primary)'
                    }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/gigs"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  Browse Gigs
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
