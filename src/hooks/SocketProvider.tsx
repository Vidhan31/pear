import { useState, useEffect, useMemo, type ReactNode } from "react";
import { io, type Socket } from "socket.io-client";

import { SocketContext, type SocketContextState } from "./SocketContext.tsx";

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const url = useMemo(() => "http://localhost:3000", []);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const socketOptions = useMemo(
    () => ({
      autoConnect: true,
      reconnection: true,
    }),
    [],
  );

  useEffect(() => {
    const newSocket = io(url, socketOptions);
    setSocket(newSocket);

    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    newSocket.on("connect", onConnect);
    newSocket.on("disconnect", onDisconnect);

    return () => {
      newSocket.off("connect", onConnect);
      newSocket.off("disconnect", onDisconnect);
      newSocket.disconnect();
    };
  }, [url, socketOptions]);

  const contextValue = useMemo<SocketContextState>(
    () => ({
      socket,
      isConnected,
    }),
    [socket, isConnected],
  );

  return <SocketContext.Provider value={contextValue}>{children}</SocketContext.Provider>;
};
