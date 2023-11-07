"use client";

import { createContext, useState, useEffect, useContext, FC, ReactNode, useMemo, memo } from 'react';
import { io as ClientIO, Socket } from 'socket.io-client';

type SocketContextType = {
  socket: Socket | null,
  isConnected: boolean;
};

const SocketContext = createContext<SocketContextType>({ socket: null, isConnected: false });

export const useSocket = () => useContext(SocketContext);

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: FC<SocketProviderProps> = memo(({ children }) => {
  const [socket, setSocket] = useState<SocketContextType['socket']>(null);
  const [isConnected, setIsConnected] = useState<SocketContextType['isConnected']>(false);

  useEffect(() => {
    const socketInstance = ClientIO(process.env.NEXT_PUBLIC_SIZE_URL!, {
      path: '/api/socket/io',
      addTrailingSlash: false,
    });

    socketInstance.connect();

    socketInstance.on('connect', () => {
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    }
  }, []);

  const memoizedValue = useMemo<SocketContextType>(() => ({
    socket,
    isConnected,
  }), [isConnected, socket]);

  return (
    <SocketContext.Provider value={memoizedValue}>
      {children}
    </SocketContext.Provider>
  )
})