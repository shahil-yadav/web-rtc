import { RefObject, useEffect } from 'react'
import { Action } from '~/components/contexts/StreamsContext'

export function useSnapshotOfMediaStreams({
  dispatch,
  localStream,
  ref,
  remoteStream,
  state,
}: {
  dispatch: (arg: Action) => void
  localStream?: MediaStream
  ref: RefObject<HTMLVideoElement>
  remoteStream?: MediaStream
  state: 'local' | 'remote'
}) {
  useEffect(() => {
    const video = ref.current
    if (!video) return
    if (state === 'local') dispatch({ type: 'SET-LOCAL-VIDEO', payload: video })
    else dispatch({ type: 'SET-REMOTE-VIDEO', payload: video })
  }, [ref.current])

  useEffect(() => {
    const video = ref.current
    if (!video) return
    if (video.srcObject === null) return

    if (state === 'local' && localStream !== undefined) {
      video.srcObject = localStream
    } else if (state === 'remote' && remoteStream !== undefined) {
      video.srcObject = remoteStream
    }
  }, [ref.current, localStream, remoteStream])
}
