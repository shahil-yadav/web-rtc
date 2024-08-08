import { useRef } from 'react'

export function useVideoStreamsRef() {
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)

  return { localVideoRef, remoteVideoRef }
}
