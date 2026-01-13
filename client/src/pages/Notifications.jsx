import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../store/slices/notificationSlice';
import { NotificationSkeleton } from '../components/Skeleton';
import { EmptyNotifications } from '../components/EmptyState';
import { formatDate } from '../utils/dateUtils';
import toast from 'react-hot-toast';

const Notifications = () => {
  const dispatch = useDispatch();
  const { notifications, unreadCount, loading } = useSelector((state) => state.notifications);
  const [activeTab, setActiveTab] = useState('unread');

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleMarkAsRead = async (id) => {
    const result = await dispatch(markNotificationAsRead(id));
    if (markNotificationAsRead.fulfilled.match(result)) {
      toast.success('Notification marked as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    const result = await dispatch(markAllNotificationsAsRead());
    if (markAllNotificationsAsRead.fulfilled.match(result)) {
      toast.success('All notifications marked as read');
    }
  };

  const filteredNotifications = activeTab === 'unread'
    ? notifications.filter(n => !n.read)
    : notifications;

  return (
    <div className="min-h-screen bg-gradient-page relative overflow-hidden page-enter" style={{ color: 'var(--color-text-primary)' }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blob-orange rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blob-ivory rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-2000"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="premium-card p-6 glass border" style={{ borderColor: 'var(--color-border)' }}>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Notifications</h1>
            {notifications.length > 0 && unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="premium-button-secondary text-sm"
              >
                Mark All as Read
              </button>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b" style={{ borderColor: 'var(--color-border)' }}>
            <button
              onClick={() => setActiveTab('unread')}
              className={`px-4 py-2 font-medium text-sm transition-colors ${
                activeTab === 'unread'
                  ? 'border-b-2'
                  : ''
              }`}
              style={activeTab === 'unread' ? {
                borderBottomColor: 'var(--color-brand)',
                color: 'var(--color-brand)'
              } : {
                color: 'var(--color-text-secondary)'
              }}
              onMouseEnter={(e) => activeTab !== 'unread' && (e.target.style.color = 'var(--color-text-primary)')}
              onMouseLeave={(e) => activeTab !== 'unread' && (e.target.style.color = 'var(--color-text-secondary)')}
            >
              Unread ({unreadCount})
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 font-medium text-sm transition-colors ${
                activeTab === 'all'
                  ? 'border-b-2'
                  : ''
              }`}
              style={activeTab === 'all' ? {
                borderBottomColor: 'var(--color-brand)',
                color: 'var(--color-brand)'
              } : {
                color: 'var(--color-text-secondary)'
              }}
              onMouseEnter={(e) => activeTab !== 'all' && (e.target.style.color = 'var(--color-text-primary)')}
              onMouseLeave={(e) => activeTab !== 'all' && (e.target.style.color = 'var(--color-text-secondary)')}
            >
              All ({notifications.length})
            </button>
          </div>

          {/* Notifications List */}
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <NotificationSkeleton key={i} />
              ))}
            </div>
          ) : filteredNotifications.length === 0 ? (
            <EmptyNotifications />
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`premium-card p-4 cursor-pointer transition-all hover:shadow-lg card-hover ${
                    !notification.read ? 'border-l-4' : ''
                  }`}
                  style={!notification.read ? {
                    backgroundColor: 'var(--color-brand-tint)',
                    borderLeftColor: 'var(--color-brand)'
                  } : {}}
                  onClick={() => !notification.read && handleMarkAsRead(notification._id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--color-brand-tint)' }}>
                      {notification.type === 'hired' ? (
                        <svg className="w-5 h-5" style={{ color: 'var(--color-brand)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" style={{ color: 'var(--color-brand)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium mb-1" style={{ color: 'var(--color-text-primary)' }}>
                        {notification.message}
                      </p>
                      {notification.createdAt && (
                        <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                          {formatDate(notification.createdAt)}
                        </p>
                      )}
                    </div>
                    {!notification.read && (
                      <div className="h-2 w-2 rounded-full flex-shrink-0 mt-2" style={{ backgroundColor: 'var(--color-brand)' }}></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
