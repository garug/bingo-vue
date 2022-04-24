import io from "socket.io-client";

export function useSocket() {
  const socket = io("http://localhost:8081");

  return socket;
}
