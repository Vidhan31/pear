import { use, useEffect, useState } from "react";

import type { Peer } from "../types/Peer.ts";

import { SocketContext } from "./SocketContext.tsx";

export function useDiscoverPeers(selfPeer: Peer) {
  const context = use(SocketContext);
  const [nearbyPeers, setNearbyPeers] = useState<Peer[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!context) {
      setError("Socket context is not available");
      return undefined;
    }
    const { socket } = context;
    if (!socket) {
      setError("Socket is not connected");
      return undefined;
    }

    const handleNewPeer = (newPeer: Peer) => {
      if (newPeer.id !== selfPeer.id) {
        setNearbyPeers((prevPeers) => {
          const existingPeer = prevPeers.find((peer) => peer.id === newPeer.id);
          if (existingPeer) {
            return prevPeers.map((peer) => (peer.id === newPeer.id ? { ...peer, ...newPeer } : peer));
          }
          return [...prevPeers, newPeer];
        });
      }
    };

    const handlePeerLeft = (leftPeer: Peer) => {
      setNearbyPeers((prevPeers) => {
        return prevPeers.filter((peer) => peer.id !== leftPeer.id);
      });
    };

    const handlePeersIdentified = (peers: Peer[]) => {
      setNearbyPeers(() => {
        return peers.filter((peer) => peer.id !== selfPeer.id);
      });
    };

    socket.on("peers-identified", handlePeersIdentified);
    socket.on("new-peer-joined", handleNewPeer);
    socket.on("peer-left", handlePeerLeft);
    socket.emit("identify-peers", selfPeer);

    return () => {
      socket.off("peers-identified", handlePeersIdentified);
      socket.off("new-peer-joined", handleNewPeer);
      socket.off("peer-left", handlePeerLeft);
    };
  }, [selfPeer, context]);

  return { nearbyPeers, error };
}
