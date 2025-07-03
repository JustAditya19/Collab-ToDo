import { io } from 'socket.io-client';

const socket = io("http://localhost:5000", {
  transports: ['websocket'], // more stable fallback
  reconnection: true
});

export default socket;
