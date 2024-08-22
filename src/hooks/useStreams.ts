class Streams {
  static localStream: MediaStream
  static remoteStream: MediaStream

  static {
    Streams.localStream = new MediaStream()
    Streams.remoteStream = new MediaStream()
  }

  static getLocalStream() {
    return Streams.localStream
  }

  static getRemoteStream() {
    return Streams.remoteStream
  }

  static setRemoteStream(val: MediaStream | MediaStreamTrack) {
    if (val instanceof MediaStream) Streams.remoteStream = val
    else if (val instanceof MediaStreamTrack) Streams.remoteStream.addTrack(val)
    else throw new Error('Check the parameters dumbass')
  }

  static setLocalStream(val: MediaStream) {
    Streams.localStream = val
  }

  static async openCamera() {
    try {
      Streams.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      return true
    } catch (error) {
      console.error(error)
      return false
    }
  }

  static reset() {
    Streams.setLocalStream(new MediaStream())
    Streams.setRemoteStream(new MediaStream())
  }
}

export function openCameraWithAudioAndVideo() {
  return Streams.openCamera()
}

export function useLocalStream() {
  return Streams.getLocalStream()
}

export function useRemoteStream() {
  return Streams.getRemoteStream()
}

export function useSetRemoteStream() {
  return (val: MediaStream | MediaStreamTrack) => Streams.setRemoteStream(val)
}
