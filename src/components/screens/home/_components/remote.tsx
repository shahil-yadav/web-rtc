import { useEffect, useRef } from 'react'
import { useStreamsContext } from '~/components/contexts/StreamsContext'
import { setRemoteStream, useRemoteStream } from '../hooks/useStreams'
import clsx from 'clsx'
import { usePeerConnection } from '../hooks/usePeerConnection'

export function Remote() {
  const ref = useRef<HTMLVideoElement>(null)
  const {
    state: { connected },
  } = useStreamsContext()
  const remoteStream = useRemoteStream()
  const peerConnection = usePeerConnection()

  useEffect(() => {
    function listenRemoteStreams(event: RTCTrackEvent) {
      event.streams[0].getTracks().forEach((track) => {
        console.log('Attatching a remote track to remote streams', track)
        setRemoteStream(track)
      })
      if (ref.current !== null) {
        ref.current.srcObject = remoteStream
      }
    }
    peerConnection.addEventListener('track', listenRemoteStreams)
    return () => {
      peerConnection.removeEventListener('track', listenRemoteStreams)
    }
  }, [])

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
      {connected === 'none' && <p>No one is in the call</p>}
      {connected === 'error' && (
        <div className="flex flex-col items-center">
          <p className="text-2xl text-error">Remote connection lost</p>
          <p className="text-xl text-error-content">
            Please create a new room for <span className="font-semibold">reconnection</span>
          </p>
        </div>
      )}
      {isOfferCreated && connected === 'none' && <p>✅ Caller offer created successfully</p>}
    </>
  )
}
