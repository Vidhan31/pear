import React from "react";

import type { FileMetadata } from "../types/FileMetadata";
import { formatBytes } from "../utils/FileUtils";

interface RequestModalProps {
  isOpen: boolean;
  receiverName: string;
  fileMetadata: FileMetadata;
  onCancel: () => void;
}

const RequestModal: React.FC<RequestModalProps> = ({ isOpen, receiverName, fileMetadata, onCancel }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="animate-in fade-in zoom-in w-full max-w-md rounded-xl bg-white p-6 shadow-2xl duration-200">
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <svg
              className="h-6 w-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900">File Share Request Sent</h3>
          <p className="mt-2 text-sm text-gray-600">
            Waiting for <span className="font-medium text-gray-900">{receiverName}</span> to respond
          </p>
        </div>

        {/* File details */}
        <div className="mb-6">
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">File:</span>
                <span className="max-w-48 truncate text-sm text-gray-900" title={fileMetadata.name}>
                  {fileMetadata.name}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Size:</span>
                <span className="text-sm text-gray-900">{formatBytes(fileMetadata.size)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Type:</span>
                <span className="text-sm text-gray-900">{fileMetadata.type || "Unknown"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Loading indicator */}
        <div className="mb-6 flex items-center justify-center space-x-2">
          <div className="h-2 w-2 animate-pulse rounded-full bg-blue-500" />
          <div className="animation-delay-75 h-2 w-2 animate-pulse rounded-full bg-blue-500" />
          <div className="animation-delay-150 h-2 w-2 animate-pulse rounded-full bg-blue-500" />
          <span className="ml-3 text-sm text-gray-600">Awaiting response...</span>
        </div>

        {/* Actions */}
        {onCancel && (
          <div className="flex justify-center">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
            >
              Cancel Request
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestModal;
