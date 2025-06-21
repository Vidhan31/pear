import type { Peer } from "./Peer";

export interface IceCandidateForPeer {
  candidate: RTCIceCandidate;
  target: Peer;
}
