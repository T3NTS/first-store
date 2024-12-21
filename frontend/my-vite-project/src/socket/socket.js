import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const useWebSocket = (user) => {
  const socketRef = useRef(null);

  useEffect(() => {
    console.log(user, socketRef.current)
    if (user && !socketRef.current) {
      // Initialize WebSocket connection
      socketRef.current = io('http://localhost:5000', {
        transports: ['websocket']
      });

      socketRef.current.on('connect', () => {
        console.log(`Connected to server: ${socketRef.current.id}`);
      });

      socketRef.current.on('disconnect', () => {
        console.log('Disconnected from server');
      });
    }

    return () => {
      // Cleanup WebSocket connection on unmount
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [user]);
  console.log(socketRef.current)
  return socketRef.current;
};

export default useWebSocket;
