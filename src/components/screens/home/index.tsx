import { useEffect } from 'react'
import { useStreamsContext } from '~/components/contexts/StreamsContext'
import { Controls } from '~/components/screens/home/_components/controls'
import { Head } from '~/components/shared/Head'
import { Video } from './_components/video'
import { setupPeerConnection, usePeerConnection } from './hooks/usePeerConnection'
import { setupRemoteStream } from './hooks/useStreams'

function Home() {
  const { dispatch } = useStreamsContext()

  const peerConnection = usePeerConnection()
  useEffect(() => {
    function iceGatheringStateChange() {
      console.log(`ICE gathering state changed: ${peerConnection.iceGatheringState}`)
    }

    function connectionStateChange() {
      console.log(`Connection state change: ${peerConnection.connectionState}`)
      const { connectionState } = peerConnection

      if (connectionState === 'connected') {
        dispatch({ type: 'SET-CONNECTION', payload: 'success' })
      } else if (connectionState === 'disconnected') {
        dispatch({ type: 'SET-CONNECTION', payload: 'error' })
        setupPeerConnection()
        setupRemoteStream()
      }
    }

    function signalingStateChange() {
      console.log(`Signaling state change: ${peerConnection.signalingState}`)
    }

    function iceConnectionStateChange() {
      console.log(`ICE connection state change: ${peerConnection.iceConnectionState}`)
    }

    peerConnection.addEventListener('icegatheringstatechange', iceGatheringStateChange)
    peerConnection.addEventListener('connectionstatechange', connectionStateChange)
    peerConnection.addEventListener('signalingstatechange', signalingStateChange)
    peerConnection.addEventListener('iceconnectionstatechange ', iceConnectionStateChange)

    return () => {
      peerConnection.removeEventListener('icegatheringstatechange', iceGatheringStateChange)
      peerConnection.removeEventListener('connectionstatechange', connectionStateChange)
      peerConnection.removeEventListener('signalingstatechange', signalingStateChange)
      peerConnection.removeEventListener('iceconnectionstatechange ', iceConnectionStateChange)
    }
  }, [peerConnection])

  return (
    <>
      <Head title="Home" description="P2P Video Chatting Platform" />
      <main className="flex h-full flex-col">
        <div className="relative my-5 flex h-full items-center justify-center">
          <Video state="remote" />
          <div className="absolute bottom-5 right-5 flex aspect-[2/3] w-1/3 max-w-40 items-center justify-center bg-base-200">
            <Video state="local" />
          </div>
        </div>
        <Controls />
      </main>
    </>
  )
}

export default Home
