import { io } from 'socket.io-client';

// In production, use same origin (server serves both client and socket)
// In development, use environment variable or default
const SOCKET_URL = import.meta.env.PROD
  ? window.location.origin
  : (import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001');

let socket = null;

export const initSocket = (userId) => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      withCredentials: true
    });

    socket.on('connect', () => {
      console.log('Socket connected');
      if (userId) {
        socket.emit('join', userId);
      }
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });
  } else if (userId) {
    socket.emit('join', userId);
  }

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log('Socket disconnected');
  }
};
