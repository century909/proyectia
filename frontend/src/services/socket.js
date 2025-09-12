import { io } from 'socket.io-client';

let socketInstance = null;

export function getSocket(token) {
  if (socketInstance) return socketInstance;
  const socketUrl = import.meta?.env?.VITE_SOCKET_URL || 'http://localhost:5000';
  socketInstance = io(socketUrl, {
    autoConnect: false,
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 8000,
    auth: token ? { token } : undefined,
  });
  return socketInstance;
}

export function disconnectSocket() {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
}



