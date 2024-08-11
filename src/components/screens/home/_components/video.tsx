import { useMemo, useRef } from 'react'
import { useStreamsContext } from '~/components/contexts/StreamsContext'
import { useSnapshotOfMediaStreams } from '../hooks/useSnapshotOfMediaStreams'
import { Placeholder } from './placeholder'

function Video({ state }: { state: 'local' | 'remote' }) {
  const ref = useRef<HTMLVideoElement>(null)

  const {
    dispatch,
    state: { localStream, remoteStream },
  } = useStreamsContext()

  const display = useMemo(() => {
    const mediaStream = ref.current?.srcObject as MediaStream | null
    return mediaStream?.active ?? false
  }, [ref.current?.srcObject])

  useSnapshotOfMediaStreams({
    dispatch,
    localStream,
    ref,
    remoteStream,
    state,
  })

  return (
    <>
      {display === false && <Placeholder />}
      <video autoPlay className={`${!display && 'hidden'} h-full w-full object-cover`} muted playsInline ref={ref} />
    </>
  )
}

export default Video
