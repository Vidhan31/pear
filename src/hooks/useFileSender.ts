import { useState } from "react";

import type { Peer } from "../types/Peer";
import type { SenderProgress } from "../types/TransferProgress";

export function useFileSender(file: File | null, peer: Peer | null) {
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [progress, setProgress] = useState<SenderProgress>({
    bytesTransferred: 0,
    bytesBuffered: 0,
    timestamp: Date.now(),
  });
}
