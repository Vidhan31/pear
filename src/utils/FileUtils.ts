import type { SenderProgress, ReceiverProgress } from "../types/TransferProgress";

export function getFileExtension(filename: string): string {
  const lastDotIndex = filename.lastIndexOf(".");
  return lastDotIndex === -1 ? "" : filename.slice(lastDotIndex + 1);
}

export function formatBytes(bytes: number, precision: number = 2): string {
  const units = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  if (!Number.isFinite(bytes) || bytes < 0) {return "0 B";}

  if (bytes === 0) {return "0 B";}

  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const unitIndex = Math.max(0, Math.min(i, units.length - 1));
  const value = bytes / 1024 ** unitIndex;
  return `${value.toFixed(precision).replace(/\.?0+$/, "")} ${units[unitIndex]}`;
}

export function calculateTransferSpeedWithProgress(
  progress: SenderProgress | ReceiverProgress,
  lastTimestamp: number,
  lastBytesTransferred: number,
): number {
  const timeDiff = progress.timestamp - lastTimestamp;
  const bytesDiff = progress.bytesTransferred - lastBytesTransferred;

  if (timeDiff <= 0) {
    return 0;
  }

  return (bytesDiff / timeDiff) * 1000;
}
