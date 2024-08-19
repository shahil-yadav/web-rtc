import clsx from 'clsx'
import { useEffect, useRef } from 'react'
import { usePeerConnection } from '~/hooks/usePeerConnection'
import { useRemoteStream } from '~/hooks/useStreams'

export function Remote() {
  const ref = useRef<HTMLVideoElement>(null)
  const remoteStream = useRemoteStream()
  const peerConnection = usePeerConnection()

  useEffect(() => {
    /** 4. Add remote stream to the peer connection[START] 👇 */
    function listenRemoteStreams(event: RTCTrackEvent) {
      event.streams[0].getTracks().forEach((track) => {
        console.log('Attatching a remote track to remote streams', track)
        if (remoteStream !== undefined) remoteStream.addTrack(track)
      })
      if (ref.current !== null) ref.current.srcObject = remoteStream
    }
    peerConnection.addEventListener('track', listenRemoteStreams)
    /** Add remote stream to the peer connection[END] 👆 */

    return () => {
      peerConnection.removeEventListener('track', listenRemoteStreams)
    }
  }, [peerConnection])

  return <video autoPlay className={clsx('h-full w-full max-w-[800px] object-cover')} playsInline ref={ref} />
}

/* 
{connection === 'none' && <span>No one is in the call</span>}
      {connection === 'error' && (
        <div className="flex flex-col items-center">
          <span className="text-2xl text-error">Remote connection lost</span>
          <span className="text-xl text-error-content">
            Please create a new room for <span className="font-semibold">reconnection</span>
          </span>
        </div>
      )} */
