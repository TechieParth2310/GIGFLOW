import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link, useLocation, useSearchParams } from 'react-router-dom';
import { login, clearError } from '../store/slices/authSlice';
import toast from 'react-hot-toast';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  useEffect(() => {
    if (isAuthenticated) {
      const redirectUrl = searchParams.get('redirect') || location.state?.from?.pathname || '/gigs';
      toast.success('Welcome back!');
      navigate(redirectUrl, { replace: true });
    }
    return () => {
      dispatch(clearError());
    };
  }, [isAuthenticated, navigate, dispatch, location, searchParams]);

  useEffect(() => {
    if (error) {
      toast.error(typeof error === 'string' ? error : error.message || 'Login failed');
    }
  }, [error]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(login(formData));
    if (login.fulfilled.match(result)) {
      toast.success('Login successful!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-page relative overflow-hidden page-enter">
      {/* Subtle background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blob-orange rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blob-ivory rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>
      
      <div className="max-w-md w-full relative z-10">
        {/* Premium Card */}
        <div className="glass rounded-3xl shadow-2xl p-8 space-y-6 border" style={{ borderColor: 'var(--color-border)' }}>
          {/* Logo/Header */}
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
              GigFlow
            </h1>
            <h2 className="text-2xl font-bold mt-4" style={{ color: 'var(--color-text-primary)' }}>
              Welcome Back
            </h2>
            <p className="mt-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              Sign in to continue to your account
            </p>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="premium-input"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* Password Input */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="password" className="block text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-medium transition-colors"
                  style={{ color: 'var(--color-brand)' }}
                  onMouseEnter={(e) => e.target.style.color = 'var(--color-brand-deep)'}
                  onMouseLeave={(e) => e.target.style.color = 'var(--color-brand)'}
                >
                  Forgot?
                </Link>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="premium-input"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="premium-button w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Sign Up Link and Forgot Password Link */}
          <div className="text-center pt-4 border-t space-y-3" style={{ borderColor: 'var(--color-border)' }}>
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              <Link 
                to="/forgot-password" 
                className="font-semibold transition-colors inline-block"
                style={{ color: 'var(--color-brand)' }}
                onMouseEnter={(e) => e.target.style.color = 'var(--color-brand-deep)'}
                onMouseLeave={(e) => e.target.style.color = 'var(--color-brand)'}
              >
                Forgot Password?
              </Link>
            </p>
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              Don't have an account?{' '}
              <Link 
                to="/register" 
                className="font-semibold transition-colors inline-block"
                style={{ color: 'var(--color-brand)' }}
                onMouseEnter={(e) => e.target.style.color = 'var(--color-brand-deep)'}
                onMouseLeave={(e) => e.target.style.color = 'var(--color-brand)'}
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
