let peerConnection: RTCPeerConnection

const config = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
    },
  ],
  iceCandidatePoolSize: 10,
}

function setupPeerConnection() {
  peerConnection = new RTCPeerConnection(config)
}

function usePeerConnection() {
  if (!peerConnection) {
    setupPeerConnection()
  }
  return peerConnection
}

export { setupPeerConnection, usePeerConnection }

// class Peer {
//   static peerConnection: RTCPeerConnection

//   static {
//     Peer.setupPeerConnection()
//     Peer.registerEventListeners()
//   }

//   static setupPeerConnection() {
//     Peer.peerConnection = new RTCPeerConnection({
//       iceServers: [
//         {
//           urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
//         },
//       ],
//       iceCandidatePoolSize: 10,
//     })
//   }

//   static registerEventListeners() {
//     Peer.peerConnection.addEventListener('icegatheringstatechange', function iceGatheringStateChange() {
//       console.log(`ICE gathering state changed: ${Peer.peerConnection.iceGatheringState}`)
//     })

//     Peer.peerConnection.addEventListener('signalingstatechange', function signalingStateChange() {
//       console.log(`Signaling state change: ${Peer.peerConnection.signalingState}`)
//     })

//     Peer.peerConnection.addEventListener('iceconnectionstatechange ', function iceConnectionStateChange() {
//       console.log(`ICE connection state change: ${Peer.peerConnection.iceConnectionState}`)
//     })
//   }

//   static getPeerConnection() {
//     return Peer.peerConnection
//   }
// }

// export function usePeerConnection() {
//   return Peer.getPeerConnection()
// }

// export function resetPeerConnection() {
//   Peer.setupPeerConnection()
// }
