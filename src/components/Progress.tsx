import { useEffect, useMemo, useRef } from "react";

import type { FileMetadata } from "../types/FileMetadata";
import type { ReceiverProgress, SenderProgress } from "../types/TransferProgress";
import { calculateTransferSpeedWithProgress, formatBytes } from "../utils/FileUtils";

interface ProgressProps {
  file: FileMetadata;
  progress: SenderProgress | ReceiverProgress;
  variant: "sender" | "receiver";
  onCancel: () => void;
}

export const Progress = ({ file, progress, variant = "sender", onCancel }: ProgressProps) => {
  const lastSpeedRef = useRef<number>(0);
  const lastTimestampRef = useRef<number>(progress.timestamp);
  const lastBytesRef = useRef<number>(progress.bytesTransferred);

  const speed = useMemo(() => {
    const currentSpeed = calculateTransferSpeedWithProgress(
      progress,
      lastTimestampRef.current,
      lastBytesRef.current
    );

    lastSpeedRef.current = lastSpeedRef.current * 0.7 + currentSpeed * 0.3;

    lastTimestampRef.current = progress.timestamp;
    lastBytesRef.current = progress.bytesTransferred;
    return lastSpeedRef.current;
  }, [progress]);

  const percentage = Math.min(100, Math.round((progress.bytesTransferred / file.size) * 100));

  useEffect(() => {
    return () => {
      lastSpeedRef.current = 0;
      lastTimestampRef.current = 0;
      lastBytesRef.current = 0;
    };
  }, []);

  return (
    <div className="w-full max-w-md space-y-4 rounded-lg bg-white p-6 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-semibold text-gray-900">{file.name}</h3>
          <p className="text-sm text-gray-500">{formatBytes(file.size)}</p>
        </div>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="ml-4 p-2 text-gray-400 transition-colors hover:text-gray-600"
            aria-label="Cancel transfer"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <div className="relative pt-1">
        <div className="mb-2 flex items-center justify-between">
          <div>
            <span className="inline-block text-xs font-semibold text-blue-600">
              {variant === "sender" ? "Sending" : "Receiving"}
            </span>
          </div>
          <div className="text-right">
            <span className="inline-block text-xs font-semibold text-blue-600">{percentage}%</span>
          </div>
        </div>
        <div className="flex h-2 overflow-hidden rounded-full bg-blue-100 text-xs">
          <div
            style={{ width: `${percentage}%` }}
            className="flex flex-col justify-center bg-blue-500 text-center whitespace-nowrap text-white shadow-none transition-all duration-300 ease-out"
          />
        </div>
      </div>

      <div className="flex justify-between text-sm text-gray-500">
        <span>
          {formatBytes(progress.bytesTransferred)} / {formatBytes(file.size)}
        </span>
        <span>{formatBytes(speed)}/s</span>
      </div>

      {variant === "sender" && "bytesBuffered" in progress && (
        <div className="text-right text-xs text-gray-400">
          Buffer: {formatBytes(progress.bytesBuffered)}
        </div>
      )}
    </div>
  );
}
