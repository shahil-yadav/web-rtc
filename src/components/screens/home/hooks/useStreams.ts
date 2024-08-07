let localStream: MediaStream
let remoteStream: MediaStream

export async function setLocalStream() {
  localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
}

export function useLocalStream() {
  if (!localStream) {
    localStream = new MediaStream()
  }

  return localStream
}

export function useRemoteStream() {
  if (!remoteStream) {
    remoteStream = new MediaStream()
  }

  return remoteStream
}
