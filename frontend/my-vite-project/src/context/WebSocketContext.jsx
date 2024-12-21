import { createContext, useContext, useEffect, useRef, useState } from "react";
import useWebSocket from "../socket/socket";
import { io } from 'socket.io-client';

const WebSocketContext = createContext(null)
const WebSocketProvider = ({ children, user }) => {
  const socketRef = useRef(null);
  const [socketReady, setSocketReady] = useState(false);
  useEffect(() => {
    if (user && !socketRef.current) {
      socketRef.current = io('http://localhost:5000', {
        transports: ['websocket']
      });

      socketRef.current.on('connect', () => {
        console.log(`Connected to server: ${socketRef.current.id}`);
        setSocketReady(true);
      });

      socketRef.current.on('disconnect', () => {
        console.log('Disconnected from server');
        setSocketReady(false);
      });
    }
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        console.log(`Disconnected: ${socketRef.current.id}`);
        socketRef.current = null;
        setSocketReady(false);
      }
    };
  }, [user]);
  return (
    <WebSocketContext.Provider value={socketReady ? socketRef.current : null}>
      {children}
    </WebSocketContext.Provider>
  );
};

const useWebSocketContext = () => {
  return useContext(WebSocketContext)
}

export { WebSocketProvider, useWebSocketContext }