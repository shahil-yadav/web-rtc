import { useEffect, useRef } from 'react'
import { useStreamsContext } from '~/components/contexts/StreamsContext'
import { Placeholder } from './placeholder'
import { useRemoteStream } from '../hooks/useStreams'
import clsx from 'clsx'

export function Remote() {
  const ref = useRef<HTMLVideoElement>(null)
  const {
    state: { connected },
  } = useStreamsContext()
  const remoteStream = useRemoteStream()

  useEffect(() => {
    if (!ref.current) return

    if (connected === 'success' && remoteStream !== undefined) {
      ref.current.srcObject = remoteStream
    }
  }, [connected])

  return (
    <>
      {connected === 'none' && <Placeholder />}
      {connected === 'error' && <span className="text-xl">Remote connection lost</span>}
      <video
        autoPlay
        className={clsx('h-full w-full max-w-[800px] object-cover', { hidden: connected !== 'success' })}
        playsInline
        ref={ref}
      />
    </>
  )
}
