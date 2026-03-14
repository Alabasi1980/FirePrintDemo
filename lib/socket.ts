import { io } from "socket.io-client";

// Use polling first as it is more reliable in some proxy environments
export const socket = io({
  transports: ["polling", "websocket"],
  path: "/socket.io",
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  withCredentials: true,
});
