// Skeleton loading components

export const GigCardSkeleton = () => {
  return (
    <div className="premium-card overflow-hidden animate-pulse">
      <div className="h-2" style={{ backgroundColor: 'var(--color-border)' }}></div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="h-6 w-20 rounded-full" style={{ backgroundColor: 'var(--color-border)' }}></div>
          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: 'var(--color-border)' }}></div>
        </div>
        <div className="h-6 rounded mb-3" style={{ backgroundColor: 'var(--color-border)' }}></div>
        <div className="h-4 rounded mb-2" style={{ backgroundColor: 'var(--color-border)' }}></div>
        <div className="h-4 rounded w-3/4 mb-6" style={{ backgroundColor: 'var(--color-border)' }}></div>
        <div className="flex justify-between items-center pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
          <div>
            <div className="h-3 w-12 rounded mb-1" style={{ backgroundColor: 'var(--color-border)' }}></div>
            <div className="h-8 w-24 rounded" style={{ backgroundColor: 'var(--color-border)' }}></div>
          </div>
          <div className="text-right">
            <div className="h-3 w-16 rounded mb-1" style={{ backgroundColor: 'var(--color-border)' }}></div>
            <div className="h-4 w-20 rounded" style={{ backgroundColor: 'var(--color-border)' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const GigDetailsSkeleton = () => {
  return (
    <div className="premium-card p-8 mb-8 animate-pulse">
      <div className="flex justify-between items-start mb-4">
        <div className="h-10 rounded w-3/4" style={{ backgroundColor: 'var(--color-border)' }}></div>
        <div className="h-8 w-24 rounded-full" style={{ backgroundColor: 'var(--color-border)' }}></div>
      </div>
      <div className="space-y-3 mb-6">
        <div className="h-4 rounded" style={{ backgroundColor: 'var(--color-border)' }}></div>
        <div className="h-4 rounded" style={{ backgroundColor: 'var(--color-border)' }}></div>
        <div className="h-4 rounded w-5/6" style={{ backgroundColor: 'var(--color-border)' }}></div>
      </div>
      <div className="flex justify-between items-center pt-6 border-t" style={{ borderColor: 'var(--color-border)' }}>
        <div>
          <div className="h-3 w-16 rounded mb-2" style={{ backgroundColor: 'var(--color-border)' }}></div>
          <div className="h-6 w-32 rounded" style={{ backgroundColor: 'var(--color-border)' }}></div>
        </div>
        <div className="text-right">
          <div className="h-3 w-16 rounded mb-2" style={{ backgroundColor: 'var(--color-border)' }}></div>
          <div className="h-12 w-40 rounded" style={{ backgroundColor: 'var(--color-border)' }}></div>
        </div>
      </div>
    </div>
  );
};

export const BidCardSkeleton = () => {
  return (
    <div className="premium-card p-5 animate-pulse">
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="h-5 w-32 rounded mb-2" style={{ backgroundColor: 'var(--color-border)' }}></div>
          <div className="h-4 w-48 rounded" style={{ backgroundColor: 'var(--color-border)' }}></div>
        </div>
        <div className="text-right">
          <div className="h-8 w-24 rounded mb-2" style={{ backgroundColor: 'var(--color-border)' }}></div>
          <div className="h-5 w-16 rounded" style={{ backgroundColor: 'var(--color-border)' }}></div>
        </div>
      </div>
      <div className="h-4 rounded mb-2" style={{ backgroundColor: 'var(--color-border)' }}></div>
      <div className="h-4 rounded w-4/5 mb-4" style={{ backgroundColor: 'var(--color-border)' }}></div>
      <div className="h-10 w-full rounded" style={{ backgroundColor: 'var(--color-border)' }}></div>
    </div>
  );
};

export const NotificationSkeleton = () => {
  return (
    <div className="premium-card p-4 animate-pulse mb-3">
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--color-border)' }}></div>
        <div className="flex-1">
          <div className="h-4 rounded w-3/4 mb-2" style={{ backgroundColor: 'var(--color-border)' }}></div>
          <div className="h-3 rounded w-1/2" style={{ backgroundColor: 'var(--color-border)' }}></div>
        </div>
      </div>
    </div>
  );
};
