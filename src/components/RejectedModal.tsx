import React from "react";

interface RejectedModalProps {
  isOpen: boolean;
  peerName: string;
  onClose: () => void;
}

const RejectedModal: React.FC<RejectedModalProps> = ({ isOpen, peerName, onClose }) => {
  if (!isOpen) {return null;}

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-6 flex flex-col items-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>

          <h3 className="mb-2 text-lg font-semibold text-gray-900">Request Rejected</h3>

          <p className="text-center text-gray-600">{peerName} has declined your file sharing request.</p>
        </div>

        <div className="flex justify-center">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectedModal;
