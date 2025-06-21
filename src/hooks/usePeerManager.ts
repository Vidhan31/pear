import { use, useCallback, useEffect, useMemo, useRef } from "react";

import type { Answer } from "../types/Answer";
import type { IceCandidateForPeer } from "../types/IceCandidateForPeer";
import type { Offer } from "../types/Offer";
import type { Peer } from "../types/Peer";

import { SocketContext } from "./SocketContext";

export function usePeerManager() {
  const context = use(SocketContext);
  if (!context) {
    throw new Error("Socket context is not available");
  }
  const socket = context.socket || null;
  const connectionsRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const pendingCandidatesRef = useRef<Map<string, RTCIceCandidate[]>>(new Map());
  const myself: Peer = useMemo(
    () => ({
      id: crypto.randomUUID(),
      socketId: "",
      timestamp: "",
    }),
    [],
  );

  const configuration: RTCConfiguration = useMemo(
    () => ({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
        { urls: "stun:stun2.l.google.com:19302" },
      ],
    }),
    [],
  );

  const createPeerConnection = useCallback(
    (peer: Peer) => {
      if (!socket) {
        console.error("Socket is not connected, cannot create peer connection.");
        return null;
      }

      if (connectionsRef.current.has(peer.id)) {
        return connectionsRef.current.get(peer.id)!;
      }

      const peerConnection = new RTCPeerConnection(configuration);
      connectionsRef.current.set(peer.id, peerConnection);

      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          const iceCandidate: IceCandidateForPeer = {
            candidate: event.candidate,
            target: peer,
          };
          socket.emit("ice-candidate", iceCandidate);
        }
      };

      return peerConnection;
    },
    [socket, configuration],
  );

  const getPeerConnection = useCallback((peerId: string) => {
    return connectionsRef.current.get(peerId) || null;
  }, []);

  const closePeerConnection = useCallback((peerId: string) => {
    const peerConnection = connectionsRef.current.get(peerId);
    if (peerConnection) {
      peerConnection.close();
      connectionsRef.current.delete(peerId);
    }
  }, []);

  const bufferIceCandidates = useCallback((peer: Peer, candidate: RTCIceCandidate) => {
    if (!pendingCandidatesRef.current.has(peer.id)) {
      pendingCandidatesRef.current.set(peer.id, []);
    }
    pendingCandidatesRef.current.get(peer.id)?.push(candidate);
  }, []);

  const handleOffer = useCallback(
    async (offer: Offer) => {
      if (!socket) {
        console.error("Socket is not connected, cannot handle offer.");
        return;
      }
      const peerConnection = createPeerConnection(offer.from);
      if (!peerConnection) {
        console.error("Failed to create peer connection for offer:", offer.from.id);
        return;
      }
      await peerConnection.setRemoteDescription(new RTCSessionDescription(offer.sdp!));
      const pendingCandidates = pendingCandidatesRef.current.get(offer.from.id);
      if (pendingCandidates) {
        await Promise.all(
          pendingCandidates.map((candidate) =>
            peerConnection.addIceCandidate(candidate).catch((error) => {
              console.error("Error adding buffered ICE candidate:", error);
            }),
          ),
        );
        pendingCandidatesRef.current.delete(offer.from.id);
      }
      const answerSdp = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answerSdp);
      const answer: Answer = { from: myself, to: offer.from, sdp: answerSdp };
      socket.emit("answer", answer);
    },
    [createPeerConnection, myself, socket],
  );

  const handleAnswer = useCallback(
    async (answer: Answer) => {
      const peerConnection = getPeerConnection(answer.from.id);
      if (peerConnection) {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(answer.sdp!));
        const pendingCandidates = pendingCandidatesRef.current.get(answer.from.id);
        if (pendingCandidates) {
          await Promise.all(
            pendingCandidates.map((candidate) =>
              peerConnection.addIceCandidate(candidate).catch((error) => {
                console.error("Error adding buffered ICE candidate:", error);
              }),
            ),
          );
          pendingCandidatesRef.current.delete(answer.from.id);
        }
      } else {
        console.error("Peer connection not found for answer:", answer.from.id);
      }
    },
    [getPeerConnection],
  );

  const handleIceCandidate = useCallback(
    (candidateInfo: IceCandidateForPeer) => {
      const peerConnection = getPeerConnection(candidateInfo.target.id);
      if (peerConnection) {
        if (!peerConnection.remoteDescription) {
          bufferIceCandidates(candidateInfo.target, candidateInfo.candidate);
        } else {
          peerConnection.addIceCandidate(new RTCIceCandidate(candidateInfo.candidate)).catch((error) => {
            console.error("Error adding ICE candidate:", error);
          });
        }
      } else {
        console.error("Peer connection not found for ICE candidate:", candidateInfo.target.id);
      }
    },
    [getPeerConnection, bufferIceCandidates],
  );

  const handlePeerLeft = useCallback(
    (peer: Peer) => {
      closePeerConnection(peer.id);
    },
    [closePeerConnection],
  );

  const initiateConnection = useCallback(
    async (peer: Peer) => {
      if (!socket) {
        console.error("Socket is not connected, cannot initiate connection.");
        return;
      }

      if (connectionsRef.current.has(peer.id)) {
        console.warn(`Connection to peer ${peer.id} already exists.`);
        return;
      }

      const peerConnection = createPeerConnection(peer);

      if (!peerConnection) {
        console.error("Failed to create peer connection for:", peer.id);
        return;
      }

      const offerOptions: RTCOfferOptions = {
        offerToReceiveAudio: false,
        offerToReceiveVideo: false,
      };

      const offer = await peerConnection.createOffer(offerOptions);

      let { sdp } = offer;
      // increase bandwidth to 1638400 kbps
      if (sdp) {
        sdp = sdp.replace("b=AS:30", "b=AS:1638400");
      }
      const modifiedOffer = new RTCSessionDescription({
        type: offer.type,
        sdp: sdp,
      });

      await peerConnection.setLocalDescription(modifiedOffer);

      const offerData: Offer = {
        from: myself,
        to: peer,
        sdp: modifiedOffer,
      };
      socket.emit("offer", offerData);
    },
    [createPeerConnection, myself, socket],
  );

  useEffect(() => {
    if (!socket) {
      return undefined;
    }

    socket.on("offer", handleOffer);
    socket.on("answer", handleAnswer);
    socket.on("ice-candidate", handleIceCandidate);
    socket.on("peer-left", handlePeerLeft);

    const connections = connectionsRef.current;

    return () => {
      socket.off("offer", handleOffer);
      socket.off("answer", handleAnswer);
      socket.off("ice-candidate", handleIceCandidate);
      socket.off("peer-left", handlePeerLeft);

      connections.forEach((pc) => pc.close());
      connections.clear();
    };
  }, [socket, handleOffer, handleAnswer, handleIceCandidate, handlePeerLeft]);

  return {
    getPeerConnection,
    closePeerConnection,
    initiateConnection,
  };
}
