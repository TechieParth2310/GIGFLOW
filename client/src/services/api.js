import axios from 'axios';

// In production, use relative path (server serves both client and API)
// In development, use environment variable or default to localhost
const API_URL = import.meta.env.PROD
  ? '/api'
  : (import.meta.env.VITE_API_URL || 'http://localhost:5001/api');

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.code === 'ECONNREFUSED' || error.message === 'Network Error') {
      error.response = {
        data: {
          success: false,
          message: 'Cannot connect to server. Please make sure the server is running on port 5001.'
        }
      };
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me')
};

// Gigs API
export const gigsAPI = {
  getGigs: (search = '', page = 1, limit = 10) => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    params.append('page', page);
    params.append('limit', limit);
    return api.get(`/gigs?${params.toString()}`);
  },
  getGig: (id) => api.get(`/gigs/${id}`),
  getMyGigs: () => api.get('/gigs/mine'),
  createGig: (data) => api.post('/gigs', data),
  deleteGig: (id) => api.delete(`/gigs/${id}`)
};

// Bids API
export const bidsAPI = {
  getBidsByGig: (gigId) => api.get(`/bids/${gigId}`),
  createBid: (data) => api.post('/bids', data),
  getMyBids: () => api.get('/bids/my-bids'),
  getBidCount: (gigId) => api.get(`/bids/count/${gigId}`),
  hireFreelancer: (bidId) => api.patch(`/bids/${bidId}/hire`)
};

// Notification API
export const notificationsAPI = {
  getNotifications: () => api.get('/notifications'),
  markAsRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllAsRead: () => api.patch('/notifications/mark-all-read')
};

// User API
export const usersAPI = {
  getUserProfile: (userId) => api.get(`/users/${userId}`),
  getMyProfile: () => api.get('/users/me')
};

export default api;
