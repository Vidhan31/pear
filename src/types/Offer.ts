import type { Peer } from "./Peer.ts";

export interface Offer {
  from: Peer;
  to: Peer;
  sdp: RTCSessionDescriptionInit | null;
}
