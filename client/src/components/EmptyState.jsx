// Empty state components

export const EmptyGigs = ({ onAction }) => {
  return (
    <div className="text-center py-20 glass rounded-3xl shadow-2xl border page-enter" style={{ borderColor: 'var(--color-border)' }}>
      <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center border" style={{ 
        backgroundColor: 'var(--color-brand-tint)', 
        borderColor: 'var(--color-brand)' 
      }}>
        <svg className="h-10 w-10" style={{ color: 'var(--color-brand)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>No gigs found</h3>
      <p className="mb-6" style={{ color: 'var(--color-text-secondary)' }}>Be the first to post a gig and start connecting with freelancers!</p>
      {onAction && (
        <button onClick={onAction} className="premium-button inline-block">
          Post Your First Gig
        </button>
      )}
    </div>
  );
};

export const EmptyBids = ({ onAction }) => {
  return (
    <div className="premium-card p-12 text-center glass border page-enter" style={{ borderColor: 'var(--color-border)' }}>
      <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center border" style={{ 
        backgroundColor: 'var(--color-brand-tint)', 
        borderColor: 'var(--color-brand)' 
      }}>
        <svg className="h-10 w-10" style={{ color: 'var(--color-brand)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>No Bids Yet</h3>
      <p className="mb-6" style={{ color: 'var(--color-text-secondary)' }}>Start bidding on gigs to see them here!</p>
      {onAction && (
        <button onClick={onAction} className="premium-button inline-block">
          Browse Available Gigs
        </button>
      )}
    </div>
  );
};

export const EmptyNotifications = () => {
  return (
    <div className="premium-card p-12 text-center glass border page-enter" style={{ borderColor: 'var(--color-border)' }}>
      <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center border" style={{ 
        backgroundColor: 'var(--color-brand-tint)', 
        borderColor: 'var(--color-brand)' 
      }}>
        <svg className="h-10 w-10" style={{ color: 'var(--color-brand)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      </div>
      <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>No Notifications</h3>
      <p style={{ color: 'var(--color-text-secondary)' }}>You're all caught up! Notifications will appear here when you receive them.</p>
    </div>
  );
};

export const EmptySearchResults = ({ searchTerm, onClear }) => {
  return (
    <div className="text-center py-20 glass rounded-3xl shadow-2xl border page-enter" style={{ borderColor: 'var(--color-border)' }}>
      <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center border" style={{ 
        backgroundColor: 'var(--color-brand-tint)', 
        borderColor: 'var(--color-brand)' 
      }}>
        <svg className="h-10 w-10" style={{ color: 'var(--color-brand)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>No results found</h3>
      <p className="mb-2" style={{ color: 'var(--color-text-secondary)' }}>No gigs match your search for "{searchTerm}"</p>
      {onClear && (
        <button onClick={onClear} className="font-medium mt-4 transition-colors" style={{ color: 'var(--color-brand)' }}
          onMouseEnter={(e) => e.target.style.color = 'var(--color-brand-deep)'}
          onMouseLeave={(e) => e.target.style.color = 'var(--color-brand)'}
        >
          Clear search
        </button>
      )}
    </div>
  );
};
