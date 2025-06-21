import { useMemo } from "react";

import { useDiscoverPeers } from "../hooks/useDiscoverPeers";
import type { Peer } from "../types/Peer";

const Share = () => {
  const myself: Peer = useMemo(
    () => ({
      id: crypto.randomUUID(),
      socketId: "",
      timestamp: "",
    }),
    [],
  );

  const { nearbyPeers, error } = useDiscoverPeers(myself);
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="share-container">
      <h1>Share Component</h1>
      <ul>
        {nearbyPeers.map((peer) => (
          <li key={peer.id}>
            {peer.id} - {peer.socketId} - {new Date(peer.timestamp).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Share;
