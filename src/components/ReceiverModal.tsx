import React from "react";

import type { FileMetadata } from "../types/FileMetadata";
import { formatBytes } from "../utils/FileUtils";

interface ReceiverModalProps {
  isOpen: boolean;
  senderName: string;
  fileMetadata: FileMetadata;
  onAccept: () => void;
  onReject: () => void;
}

const ReceiverModal: React.FC<ReceiverModalProps> = ({ isOpen, senderName, fileMetadata, onAccept, onReject }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Incoming File Share Request</h3>

        <div className="mb-6 space-y-4">
          <p className="text-gray-700">
            <span className="font-medium">{senderName}</span> wants to share a file with you:
          </p>

          <div className="rounded-md bg-gray-50 p-4">
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">File:</span> {fileMetadata.name}
              </p>
              <p className="text-sm">
                <span className="font-medium">Size:</span> {formatBytes(fileMetadata.size)}
              </p>
              <p className="text-sm">
                <span className="font-medium">Type:</span> {fileMetadata.type || "Unknown"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onReject}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
          >
            Reject
          </button>
          <button
            type="button"
            onClick={onAccept}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiverModal;
