import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useStreamsContext } from '~/components/contexts/StreamsContext'
import { Placeholder } from '~/components/screens/home/_components/placeholder'
import { Connect } from './controls/connect'
import { usePeerConnection } from '../hooks/usePeerConnection'

export function Video({ state }: { state: 'local' | 'remote' }) {
  const ref = useRef<HTMLVideoElement>(null)
  const {
    state: { localStream, remoteStream },
  } = useStreamsContext()
  const [display, setDisplay] = useState(false)
  const { roomID } = useParams()
  const peerConnection = usePeerConnection()

  /** Toggle the display on for a remote connection */
  useEffect(() => {
    function handleConnectionsStateChange() {
      console.log(`Connection state change: ${peerConnection.connectionState}`)
      if (state === 'remote' && peerConnection.connectionState === 'connected') setDisplay(true)
    }
    peerConnection.addEventListener('connectionstatechange', handleConnectionsStateChange)

    return () => {
      peerConnection.removeEventListener('connectionstatechange', handleConnectionsStateChange)
    }
  }, [])

  useEffect(() => {
    if (!ref.current) return
    if (ref.current.srcObject !== null) return

    if (state === 'local' && localStream !== undefined) {
      ref.current.srcObject = localStream
      setDisplay(true)
    } else if (state === 'remote' && remoteStream !== undefined) {
      ref.current.srcObject = remoteStream
    }
  }, [ref.current, localStream, remoteStream])

  return (
    <>
      {display === false && <Placeholder />}
      <video
        autoPlay
        className={`${!display && 'hidden'} h-full w-full object-cover`}
        muted={state === 'local'}
        playsInline
        ref={ref}
      />
      {state === 'remote' && roomID && <Connect />}
    </>
  )
}
