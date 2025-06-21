import { createContext } from "react";
import type { Socket } from "socket.io-client";

export interface SocketContextState {
  socket: Socket | null;
  isConnected: boolean;
}

export const SocketContext = createContext<SocketContextState | null>(null);
