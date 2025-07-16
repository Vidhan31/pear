# Pear: Peer-to-Peer File Sharing

> ⚠️ **Project Status: Under Active Development**  
> This project is a work in progress. Features, APIs, and UI are subject to change.  
> Contributions and feedback are welcome!

---

Pear is a modern, privacy-focused peer-to-peer file sharing application for local networks. It enables users to share files directly with each other using WebRTC, without relying on a central server for file transfer.

## Features

- **Direct P2P File Transfer:** Files are sent directly between devices using WebRTC's RTCDataChannel.
- **Local Network Discovery:** Peers on the same network can discover each other automatically.
- **Modern UI:** Built with React 19, Vite, and Tailwind CSS for a fast, responsive, and accessible experience.
- **Progress & Speed Reporting:** Real-time transfer progress and speed feedback.
- **No Third-Party File Servers:** Only a lightweight Socket.IO signaling server is required for connection setup.

## Planned Features

- **Multi-file & Folder Transfer:** Select and send multiple files or entire folders in a single session.
- **Transfer History:** View a history of sent and received files.
- **Peer Nicknames & Avatars:** Assign custom names and avatars to peers for easier identification.
- **LAN QR Code Connect:** Scan a QR code to quickly connect devices on the same network.
- **Dark Mode:** Toggle between light and dark themes.
- **Accessibility Improvements:** Enhanced keyboard navigation and screen reader support.
- **PWA Support:** Progressive Web App capabilities for native-like user experience.

## Tech Stack

- **Frontend:** React 19.1, Vite 7.2, TypeScript 5.8, Tailwind CSS 4.1
- **P2P Communication:** WebRTC (RTCDataChannel)
- **Signaling:** Socket.IO 4.8.1
- **Environment:** Node.js 24+ for server-side signaling and Chromium-based browsers for WebRTC support

## How It Works

1. **Peer Discovery:** Peers identify each other using Socket.IO signaling.
2. **Connection Setup:** WebRTC handshake (SDP/ICE) is performed via the signaling server.
3. **File Transfer:** Files are streamed directly over RTCDataChannel, abstracted as Web Streams for flow control and composability.
4. **Progress Reporting:** Both sender and receiver get real-time updates on transfer status.

## Development

### Prerequisites

- Node.js 24+
- Yarn or npm

### Setup

```sh
npm
```
