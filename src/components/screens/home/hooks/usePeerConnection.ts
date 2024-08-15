let peerConnection: RTCPeerConnection

const config = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
    },
  ],
  iceCandidatePoolSize: 10,
}

export function usePeerConnection() {
  if (!peerConnection) {
    setupPeerConnection()
  }

  return peerConnection
}

export function setupPeerConnection() {
  peerConnection = new RTCPeerConnection(config)
}
