let localStream: MediaStream | undefined
let remoteStream: MediaStream

export async function openCameraWithAudioAndVideo() {
  try {
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    return true
  } catch (error) {
    return false
  }
}

export function useLocalStream() {
  /*
    if (!localStream) {
      // localStream = new MediaStream()
    }
  */

  return localStream
}

export function useRemoteStream() {
  if (!remoteStream) {
    setupRemoteStream()
  }

  return remoteStream
}

export function setupRemoteStream() {
  remoteStream = new MediaStream()
}
