import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'
import { useStreamsContext } from '~/components/contexts/StreamsContext'

export function Remote() {
  const ref = useRef<HTMLVideoElement>(null)
  const [display, setDisplay] = useState(false)
  const { state, reference } = useStreamsContext()

  useEffect(() => {
    if (!reference) return
    /** 4. Add remote stream to the peer connection[START] 👇 */
    function listenRemoteStreams(event: RTCTrackEvent) {
      event.streams[0].getTracks().forEach((track) => {
        if (!reference) return
        console.log('Attatching a remote track to remote streams', track)
        if (reference.remoteStream !== undefined) reference.remoteStream.current.addTrack(track)
      })

      if (ref.current !== null && reference !== undefined) {
        ref.current.srcObject = reference.remoteStream.current
        setDisplay(true)
      }
    }
    reference.peerConnection.current.addEventListener('track', listenRemoteStreams)
    /** Add remote stream to the peer connection[END] 👆 */

    return () => {
      reference.peerConnection.current.removeEventListener('track', listenRemoteStreams)
    }
  }, [ref.current, state.isResetTriggered])

  return (
    <video
      autoPlay
      width={800}
      className={clsx('h-full w-full max-w-[800px] object-cover', {
        hidden: !display || state.isConnectionEstablished !== 'connected',
      })}
      playsInline
      ref={ref}
    />
  )
}
