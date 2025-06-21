import type { ReceiverProgress } from "../types/TransferProgress";

export function createRtcReadableStream(
  dataChannel: RTCDataChannel,
  onProgress?: (progress: ReceiverProgress) => void,
  signal?: AbortSignal,
): ReadableStream<Uint8Array> {
  let bytesReceived = 0;
  return new ReadableStream<Uint8Array>({
    start(controller) {
      const onMessage = async (ev: MessageEvent) => {
        const {data} = ev;
        if (!(data instanceof ArrayBuffer || data instanceof Uint8Array)) {
          controller.error(new Error("Received data is not an ArrayBuffer or Uint8Array"));
          return;
        }
        const chunk = new Uint8Array(data);
        bytesReceived += chunk.byteLength;
        controller.enqueue(chunk);

        onProgress?.({
          bytesTransferred: bytesReceived,
          timestamp: Date.now(),
        });
      };

      const cleanup = () => {
        dataChannel.removeEventListener("message", onMessage);
        dataChannel.removeEventListener("close", onClose);
        dataChannel.removeEventListener("error", onError);
      };

      const onClose = () => {
        cleanup();
        controller.close();
      };

      const onError = (error: Event) => {
        cleanup();
        controller.error(new Error(`Data channel error: ${error}`));
      };

      if (dataChannel.readyState !== "open") {
        controller.error(new Error("Data channel is not open"));
        return;
      }

      dataChannel.addEventListener("message", onMessage);
      dataChannel.addEventListener("close", onClose);
      dataChannel.addEventListener("error", onError);

      signal?.addEventListener("abort", () => {
        cleanup();
      });
    },

    cancel(reason) {
      console.warn("ReadableStream cancelled:", reason);
      if (dataChannel.readyState === "open") {
        dataChannel.close();
      }
    },
  });
}
