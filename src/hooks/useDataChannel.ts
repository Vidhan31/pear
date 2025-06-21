import { useCallback, useRef } from "react";

export function useDataChannel(getPeerConnection: (peerId: string) => RTCPeerConnection | null) {
  const dataChannelRef = useRef<Map<string, RTCDataChannel>>(new Map());

  const createDataChannel = useCallback(
    (peerId: string, label: string): RTCDataChannel | null => {
      const peerConnection = getPeerConnection(peerId);
      if (!peerConnection) {
        console.warn(`No peer connection found for peerId: ${peerId}`);
        return null;
      }

      const channelLabel = `${label}-${peerId}`;
      if (dataChannelRef.current.has(peerId)) {
        const existingChannel = dataChannelRef.current.get(peerId)!;
        if (existingChannel.label === channelLabel) {
          return existingChannel;
        }
        existingChannel.close();
      }

      try {
        const dataChannel = peerConnection.createDataChannel(channelLabel);
        dataChannelRef.current.set(peerId, dataChannel);
        return dataChannel;
      } catch (error) {
        console.error("Failed to create data channel:", error);
        return null;
      }
    },
    [getPeerConnection],
  );

  const getDataChannel = useCallback((peerId: string): RTCDataChannel | null => {
    return dataChannelRef.current.get(peerId) || null;
  }, []);

  const closeDataChannel = useCallback((peerId: string): void => {
    const dataChannel = dataChannelRef.current.get(peerId);
    if (dataChannel) {
      dataChannel.close();
      dataChannelRef.current.delete(peerId);
    }
  }, []);

  const getAllChannels = useCallback((): ReadonlyMap<string, RTCDataChannel> => {
    return new Map(dataChannelRef.current);
  }, []);

  return {
    createDataChannel,
    getDataChannel,
    closeDataChannel,
    getAllChannels,
  };
}
