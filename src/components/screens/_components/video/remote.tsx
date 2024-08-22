import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'
import { useStreamsContext } from '~/components/contexts/StreamsContext'
import { usePeerConnection } from '~/hooks/usePeerConnection'
import { useRemoteStream } from '~/hooks/useStreams'

export function Remote() {
  const ref = useRef<HTMLVideoElement>(null)
  const [display, setDisplay] = useState(false)
  const { state } = useStreamsContext()
  const remoteStream = useRemoteStream()
  const peerConnection = usePeerConnection()

  useEffect(() => {
    /** 4. Add remote stream to the peer connection[START] 👇 */
    function listenRemoteStreams(event: RTCTrackEvent) {
      event.streams[0].getTracks().forEach((track) => {
        console.log('Attatching a remote track to remote streams', track)
        if (remoteStream !== undefined) remoteStream.addTrack(track)
      })
      if (ref.current !== null) {
        ref.current.srcObject = remoteStream
        setDisplay(true)
      }
    }
    peerConnection.addEventListener('track', listenRemoteStreams)
    /** Add remote stream to the peer connection[END] 👆 */

    return () => {
      peerConnection.removeEventListener('track', listenRemoteStreams)
    }
  }, [peerConnection])

  return (
    <video
      autoPlay
      width={800}
      className={clsx('h-full w-full max-w-[800px] object-cover', {
        hidden: !display || state.isConnectionEstablished === 'disconnected',
      })}
      playsInline
      ref={ref}
    />
  )
}
