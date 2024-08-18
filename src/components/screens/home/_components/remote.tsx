import { useEffect, useRef } from 'react'
import { useStreamsContext } from '~/components/contexts/StreamsContext'
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
      <Messages />
      <video
        autoPlay
        width={800}
        className={clsx('h-full w-full max-w-[800px] object-cover', { hidden: connected !== 'success' })}
        playsInline
        ref={ref}
      />
    </>
  )
}

function Messages() {
  const {
    state: { connected, isOfferCreated },
  } = useStreamsContext()

  return (
    <>
      {connected === 'none' && <span>No one is in the call</span>}
      {connected === 'error' && (
        <div className="flex flex-col items-center">
          <span className="text-2xl text-error">Remote connection lost</span>
          <span className="text-xl text-error-content">
            Please create a new room for <span className="font-semibold">reconnection</span>
          </span>
        </div>
      )}
      {isOfferCreated && <span>✅ Caller offer created successfully</span>}
    </>
  )
}
