import { Link, useLocation } from 'react-router-dom';

const LoginPromptModal = ({ isOpen, onClose }) => {
  const location = useLocation();

  if (!isOpen) return null;

  const loginUrl = `/login${location.pathname !== '/login' ? `?redirect=${encodeURIComponent(location.pathname)}` : ''}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto animate-fadeIn">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity animate-fadeIn" 
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full animate-scaleIn" style={{
          backgroundColor: 'var(--color-surface)',
          color: 'var(--color-text-primary)'
        }}>
          <div className="px-6 pt-8 pb-6 sm:p-8">
            {/* Icon */}
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full mb-4" style={{ 
              backgroundColor: 'var(--color-brand-tint)',
              border: '2px solid var(--color-brand)'
            }}>
              <svg className="h-8 w-8 animate-bounce" style={{ color: 'var(--color-brand)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>

            {/* Content */}
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>
                Login Required
              </h3>
              <p className="text-base mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                You need to be logged in to explore more features and submit bids on gigs.
              </p>
              <p className="text-sm mb-6" style={{ color: 'var(--color-text-muted)' }}>
                Login or create an account to:
              </p>

              {/* Features List */}
              <div className="text-left mb-6 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="w-5 h-5" style={{ color: 'var(--color-brand)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    Submit proposals and bids on gigs
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="w-5 h-5" style={{ color: 'var(--color-brand)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    View bid counts and competition
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="w-5 h-5" style={{ color: 'var(--color-brand)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    Post your own gigs and hire freelancers
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="w-5 h-5" style={{ color: 'var(--color-brand)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    Manage your bids and track applications
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="px-6 py-4 sm:px-8 sm:py-6 border-t space-y-3 sm:flex sm:flex-row-reverse sm:space-y-0 sm:gap-3" style={{ borderColor: 'var(--color-border)' }}>
            <Link
              to={loginUrl}
              className="premium-button w-full sm:w-auto sm:flex-1 text-center block"
            >
              Login to Continue
            </Link>
            <Link
              to={`/register${location.pathname !== '/register' ? `?redirect=${encodeURIComponent(location.pathname)}` : ''}`}
              className="premium-button-secondary w-full sm:w-auto sm:flex-1 text-center block"
            >
              Create Account
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="premium-button-secondary w-full sm:w-auto text-center"
            >
              Browse as Guest
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPromptModal;
