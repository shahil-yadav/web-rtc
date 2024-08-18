import { useEffect } from 'react'
import { useStreamsContext } from '~/components/contexts/StreamsContext'
import { Head } from '~/components/shared/Head'
import { Video } from './_components/video'
import { setupPeerConnection, usePeerConnection } from './hooks/usePeerConnection'
import { setRemoteStream } from './hooks/useStreams'

const thread = new ComlinkWorker<typeof import('~/lib/workers')>(new URL('~/lib/workers', import.meta.url), {
  type: 'module',
})

function Home() {
  const {
    dispatch,
    state: { room },
  } = useStreamsContext()
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
        setRemoteStream(new MediaStream())
      }
    }

    function signalingStateChange() {
      console.log(`Signaling state change: ${peerConnection.signalingState}`)
    }

    function iceConnectionStateChange() {
      console.log(`ICE connection state change: ${peerConnection.iceConnectionState}`)
    }

    function iceCandidateEventHandler(event: RTCPeerConnectionIceEvent) {
      if (!event.candidate) {
        console.log('Got final ice-candidate')
        return
      }
      console.log('Ice Candidate :', event)
      thread.sendLocalIceCandidatesToDb({
        candidate: event.candidate.toJSON(),
        roomID: room,
      })
    }

    function listenRemoteStreams(event: RTCTrackEvent) {
      event.streams[0].getTracks().forEach((track) => {
        console.log('Attatching a remote track to remote streams', track)
        setRemoteStream(track)
      })
    }

    peerConnection.addEventListener('connectionstatechange', connectionStateChange)
    peerConnection.addEventListener('icecandidate', iceCandidateEventHandler)
    peerConnection.addEventListener('iceconnectionstatechange ', iceConnectionStateChange)
    peerConnection.addEventListener('icegatheringstatechange', iceGatheringStateChange)
    peerConnection.addEventListener('signalingstatechange', signalingStateChange)
    peerConnection.addEventListener('track', listenRemoteStreams)

    return () => {
      peerConnection.removeEventListener('connectionstatechange', connectionStateChange)
      peerConnection.removeEventListener('icecandidate', iceCandidateEventHandler)
      peerConnection.removeEventListener('iceconnectionstatechange ', iceConnectionStateChange)
      peerConnection.removeEventListener('icegatheringstatechange', iceGatheringStateChange)
      peerConnection.removeEventListener('signalingstatechange', signalingStateChange)
      peerConnection.removeEventListener('track', listenRemoteStreams)
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
      </main>
    </>
  )
}

export default Home
