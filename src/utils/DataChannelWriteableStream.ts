import type { SenderProgress } from "../types/TransferProgress";

export function createRtcWritableStream(
  dataChannel: RTCDataChannel,
  onProgress: (progress: SenderProgress) => void,
): WritableStream<Uint8Array> {
  let bytesSent = 0;

  return new WritableStream<Uint8Array>({
    start(controller) {
      if (dataChannel.readyState !== "open") {
        controller.error(new Error("Data channel is not open"));
        return;
      }

      controller.signal.addEventListener("abort", () => {
        if (dataChannel.readyState === "open") {
          dataChannel.close();
        }
      });
    },

    write(chunk, controller) {
      if (dataChannel.readyState !== "open") {
        const error = new Error("Data channel is not open");
        controller.error(error);
        throw error;
      }

      try {
        dataChannel.send(chunk);
        bytesSent += chunk.byteLength;
        onProgress?.({
          bytesTransferred: bytesSent,
          bytesBuffered: dataChannel.bufferedAmount,
          timestamp: Date.now(),
        });
      } catch (error) {
        controller.error(error);
        throw error;
      }

      if (dataChannel.bufferedAmount > dataChannel.bufferedAmountLowThreshold) {
        return new Promise<void>((resolve) => {
          const onLow = () => {
            dataChannel.removeEventListener("bufferedamountlow", onLow);
            resolve();
          };
          dataChannel.addEventListener("bufferedamountlow", onLow);
        });
      }
      return undefined;
    },

    close() {
      if (dataChannel.readyState === "open") {
        dataChannel.close();
      }
    },

    abort(reason) {
      console.error("WritableStream aborted:", reason);
      if (dataChannel.readyState === "open") {
        dataChannel.close();
      }
    },
  });
}
