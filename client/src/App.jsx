import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme } from './store/slices/themeSlice';
import { getMe } from './store/slices/authSlice';
import { initSocket, disconnectSocket } from './services/socket';
import { addNotification } from './store/slices/notificationSlice';
import Navbar from './components/Navbar';
import OnboardingModal from './components/OnboardingModal';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Gigs from './pages/Gigs';
import GigDetails from './pages/GigDetails';
import CreateGig from './pages/CreateGig';
import MyBids from './pages/MyBids';
import MyGigs from './pages/MyGigs';
import ClientReview from './pages/ClientReview';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import toast from 'react-hot-toast';

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { theme } = useSelector((state) => state.theme);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated && user) {
      const socket = initSocket(user.id);

      socket.on('hired', (data) => {
        dispatch(addNotification({
          id: data.notificationId,
          type: 'success',
          message: data.message,
          gigId: data.gigId,
          bidId: data.bidId,
          read: false,
          createdAt: new Date().toISOString()
        }));
        toast.success(data.message);
      });

      socket.on('newBid', (data) => {
        dispatch(addNotification({
          id: `newBid-${Date.now()}`,
          type: 'bid',
          message: data.message,
          gigId: data.gigId,
          bidId: data.bidId,
          read: false,
          createdAt: new Date().toISOString()
        }));
        toast.info(data.message);
      });

      // Notify gig owners when someone bids on their gig
      socket.on('bidReceived', (data) => {
        dispatch(addNotification({
          id: `bidReceived-${Date.now()}`,
          type: 'bid',
          message: data.message,
          gigId: data.gigId,
          bidId: data.bidId,
          read: false,
          createdAt: new Date().toISOString()
        }));
        toast.success(data.message);
      });

      socket.on('bidReceived', (data) => {
        dispatch(addNotification({
          id: `bidReceived-${Date.now()}`,
          type: 'bid',
          message: data.message,
          gigId: data.gigId,
          bidId: data.bidId,
          read: false,
          createdAt: new Date().toISOString()
        }));
        toast.success(data.message);
      });

      return () => {
        socket.off('hired');
        socket.off('newBid');
        socket.off('bidReceived');
      };
    } else {
      disconnectSocket();
    }
  }, [isAuthenticated, user, dispatch]);

  // Redirect after login
  useEffect(() => {
    if (isAuthenticated && (location.pathname === '/login' || location.pathname === '/register')) {
      toast.success(`Welcome back, ${user?.username}!`);
      navigate('/gigs', { replace: true });
    }
  }, [isAuthenticated, location.pathname, navigate, user]);

  // Apply theme class to document - FORCE dark mode as default
  useEffect(() => {
    // If no theme saved or theme is dark, FORCE dark mode
    const savedTheme = localStorage.getItem('theme');
    const shouldBeDark = !savedTheme || theme === 'dark' || savedTheme === 'dark';
    
    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      if (theme !== 'dark') {
        // Sync Redux state if it's out of sync
        dispatch(setTheme('dark'));
      }
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [theme, dispatch]);

  // Show onboarding modal: first 3 times, then every 5th reload
  useEffect(() => {
    const onboardingCount = parseInt(localStorage.getItem('onboardingCount') || '0', 10);
    
    // Show modal if:
    // 1. First 3 visits (count < 3)
    // 2. After that, every 5th reload (count >= 3 and (count - 3) % 5 === 0)
    const shouldShow = onboardingCount < 3 || (onboardingCount >= 3 && (onboardingCount - 3) % 5 === 0);
    
    if (shouldShow) {
      // Show after 3 seconds
      const timer = setTimeout(() => {
        setShowOnboarding(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleCloseOnboarding = () => {
    setShowOnboarding(false);
    // Increment count in localStorage
    const currentCount = parseInt(localStorage.getItem('onboardingCount') || '0', 10);
    localStorage.setItem('onboardingCount', (currentCount + 1).toString());
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark' : ''} bg-gradient-page`} style={{ color: 'var(--color-text-primary)' }}>
      <Navbar />
      {showOnboarding && <OnboardingModal onClose={handleCloseOnboarding} />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={!isAuthenticated ? <Login /> : <Navigate to="/gigs" replace />}
        />
        <Route
          path="/register"
          element={!isAuthenticated ? <Register /> : <Navigate to="/gigs" replace />}
        />
        <Route
          path="/forgot-password"
          element={!isAuthenticated ? <ForgotPassword /> : <Navigate to="/gigs" replace />}
        />
        <Route
          path="/reset-password"
          element={!isAuthenticated ? <ResetPassword /> : <Navigate to="/gigs" replace />}
        />
        <Route path="/gigs" element={<Gigs />} />
        <Route path="/gigs/:id" element={<GigDetails />} />
        <Route
          path="/gigs/:id/review"
          element={
            <ProtectedRoute>
              <ClientReview />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-gig"
          element={
            <ProtectedRoute>
              <CreateGig />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-gigs"
          element={
            <ProtectedRoute>
              <MyGigs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-bids"
          element={
            <ProtectedRoute>
              <MyBids />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/:userId?"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
