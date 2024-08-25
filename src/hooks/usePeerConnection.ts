class Peer {
  static peerConnection: RTCPeerConnection

  static {
    Peer.setup()
  }

  /** The `setup` function initiates a peer connection and registers event listeners. */
  static setup() {
    Peer.initiatePeerConnnection()
    Peer.registerEventListeners()
  }

  static initiatePeerConnnection() {
    Peer.peerConnection = new RTCPeerConnection({
      iceServers: [
        {
          urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
        },
      ],
      iceCandidatePoolSize: 10,
    })
  }

  static customRegisterEventListener<K extends keyof RTCPeerConnectionEventMap>(
    type: K,
    callback: (ev: RTCPeerConnectionEventMap[K]) => void,
  ) {
    Peer.peerConnection.addEventListener(type, callback)
  }

  static registerEventListeners() {
    Peer.peerConnection.addEventListener('icegatheringstatechange', function iceGatheringStateChange() {
      console.log(`ICE gathering state changed: ${Peer.peerConnection.iceGatheringState}`)
    })

    Peer.peerConnection.addEventListener('signalingstatechange', function signalingStateChange() {
      console.log(`Signaling state change: ${Peer.peerConnection.signalingState}`)
    })

    Peer.peerConnection.addEventListener('iceconnectionstatechange ', function iceConnectionStateChange() {
      console.log(`ICE connection state change: ${Peer.peerConnection.iceConnectionState}`)
    })
  }

  static getPeerConnection() {
    return Peer.peerConnection
  }
}

export function useAddEventListener() {
  return Peer.customRegisterEventListener
}

export function usePeerConnection() {
  return Peer.getPeerConnection()
}

export function useSetupPeerConnection() {
  return Peer.setup
}

export function resetPeerConnection() {
  Peer.initiatePeerConnnection()
}
