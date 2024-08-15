import { useRef, useEffect } from 'react'
import { useStreamsContext } from '~/components/contexts/StreamsContext'
import { useLocalStream } from '../hooks/useStreams'
import { Placeholder } from './placeholder'

export function Local() {
  const {
    state: { camera },
  } = useStreamsContext()
  const ref = useRef<HTMLVideoElement>(null)
  const localStream = useLocalStream()

  useEffect(() => {
    if (ref.current === null) return

    if (camera === true && localStream !== undefined) {
      ref.current.srcObject = localStream
    }
  }, [camera])

  return (
    <>
      {camera === false && <Placeholder />}
      <video
        autoPlay
        className={`${camera === false && 'hidden'} h-full w-full max-w-[800px] object-cover`}
        muted
        playsInline
        ref={ref}
      />
    </>
  )
}
