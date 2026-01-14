import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (!token) {
      toast.error('Invalid reset token');
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.resetPassword({
        token,
        password: formData.password
      });
      if (response.data.success) {
        toast.success('Password reset successfully!');
        navigate('/login', { replace: true });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-page relative overflow-hidden page-enter">
        <div className="max-w-md w-full relative z-10">
          <div className="glass rounded-3xl shadow-2xl p-8 space-y-6 border text-center" style={{ borderColor: 'var(--color-border)' }}>
            <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
              Invalid Reset Link
            </h2>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              The password reset link is invalid or expired.
            </p>
            <Link to="/forgot-password" className="premium-button inline-block">
              Request New Link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-page relative overflow-hidden page-enter">
      {/* Subtle background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blob-orange rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blob-ivory rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>
      
      <div className="max-w-md w-full relative z-10">
        <div className="glass rounded-3xl shadow-2xl p-8 space-y-6 border" style={{ borderColor: 'var(--color-border)' }}>
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
              GigFlow
            </h1>
            <h2 className="text-2xl font-bold mt-4" style={{ color: 'var(--color-text-primary)' }}>
              Reset Password
            </h2>
            <p className="mt-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              Enter your new password
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="password" className="block text-sm font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                New Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={6}
                className="premium-input"
                placeholder="Enter new password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                minLength={6}
                className="premium-input"
                placeholder="Confirm new password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>

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
                  Resetting...
                </span>
              ) : (
                'Reset Password'
              )}
            </button>
          </form>

          <div className="text-center pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              Remember your password?{' '}
              <Link 
                to="/login" 
                className="font-semibold transition-colors inline-block"
                style={{ color: 'var(--color-brand)' }}
                onMouseEnter={(e) => e.target.style.color = 'var(--color-brand-deep)'}
                onMouseLeave={(e) => e.target.style.color = 'var(--color-brand)'}
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
