import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetData, setResetData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authAPI.forgotPassword(email);
      if (response.data.success) {
        if (response.data.resetUrl) {
          setResetData({
            resetUrl: response.data.resetUrl,
            resetToken: response.data.resetToken
          });
          toast.success('Password reset link generated!');
        } else {
          // Email doesn't exist (security: don't reveal)
          toast.success('If that email exists, a password reset link has been sent.');
          setResetData({ message: 'Check your email for the reset link (or try with a registered email address)' });
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to generate reset link');
    } finally {
      setLoading(false);
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
        <div className="glass rounded-3xl shadow-2xl p-8 space-y-6 border" style={{ borderColor: 'var(--color-border)' }}>
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
              GigFlow
            </h1>
            <h2 className="text-2xl font-bold mt-4" style={{ color: 'var(--color-text-primary)' }}>
              Forgot Password
            </h2>
            <p className="mt-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              Enter your email to generate a password reset link
            </p>
          </div>

          {resetData ? (
            <div className="text-center space-y-4">
              <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--color-brand-tint)' }}>
                {resetData.resetUrl ? (
                  <>
                    <p className="mb-3 font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                      Password reset link generated!
                    </p>
                    <p className="text-xs mb-3" style={{ color: 'var(--color-text-secondary)' }}>
                      Copy the link below to reset your password:
                    </p>
                    <div className="bg-white p-3 rounded border break-all text-left" style={{ borderColor: 'var(--color-border)' }}>
                      <a 
                        href={resetData.resetUrl} 
                        className="text-xs text-blue-600 hover:underline"
                        onClick={(e) => {
                          e.preventDefault();
                          window.location.href = resetData.resetUrl;
                        }}
                      >
                        {resetData.resetUrl}
                      </a>
                    </div>
                    <p className="text-xs mt-2" style={{ color: 'var(--color-text-muted)' }}>
                      ⚠️ Note: Email service not implemented. Link is shown here for testing.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="mb-3 font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                      Request Submitted
                    </p>
                    <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                      {resetData.message || 'If that email exists, a password reset link would be sent. (Email service not implemented)'}
                    </p>
                    <p className="text-xs mt-2" style={{ color: 'var(--color-text-muted)' }}>
                      💡 Tip: Make sure you're using a registered email address.
                    </p>
                  </>
                )}
              </div>
              <div className="flex gap-2 justify-center">
                <Link to="/login" className="premium-button-secondary inline-block">
                  Back to Login
                </Link>
                {resetData.resetUrl && (
                  <button
                    onClick={() => {
                      setResetData(null);
                      setEmail('');
                    }}
                    className="premium-button inline-block"
                  >
                    Generate Another Link
                  </button>
                )}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                    Sending...
                  </span>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </form>
          )}

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

export default ForgotPassword;
