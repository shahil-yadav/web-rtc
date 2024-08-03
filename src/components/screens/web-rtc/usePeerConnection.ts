let peerConnection: RTCPeerConnection

const config = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
    },
  ],
  iceCandidatePoolSize: 10,
}

function registerPeerConnectionListeners(peerConnection: RTCPeerConnection) {
  peerConnection.addEventListener('icegatheringstatechange', () => {
    console.log(`ICE gathering state changed: ${peerConnection.iceGatheringState}`)
  })

  peerConnection.addEventListener('connectionstatechange', () => {
    console.log(`Connection state change: ${peerConnection.connectionState}`)
  })

  peerConnection.addEventListener('signalingstatechange', () => {
    console.log(`Signaling state change: ${peerConnection.signalingState}`)
  })

  peerConnection.addEventListener('iceconnectionstatechange ', () => {
    console.log(`ICE connection state change: ${peerConnection.iceConnectionState}`)
  })
}

export async function usePeerConnection() {
  if (!peerConnection) {
    // Calling the REST API TO fetch the TURN Server Credentials
    const response = await fetch(
      'https://shahilyadav.metered.live/api/v1/turn/credentials?apiKey=8d1046e721cfe80f173adb5e8a94d48bb403',
    )
    // Saving the response in the iceServers array
    const iceServers = await response.json()
    peerConnection = new RTCPeerConnection({ iceServers })

    registerPeerConnectionListeners(peerConnection)
  }

  return peerConnection
}
