import { useEffect } from 'react'
import { useStreamsContext } from '~/components/contexts/StreamsContext'
import { Head } from '~/components/shared/Head'
import { useFirestore } from '~/lib/firebase'
import { Video } from './_components/video'
import { setupPeerConnection, usePeerConnection } from './hooks/usePeerConnection'
import { setRemoteStream } from './hooks/useStreams'
import { useParams } from 'react-router-dom'

const thread = new ComlinkWorker<typeof import('~/lib/workers')>(new URL('~/lib/workers', import.meta.url), {
  type: 'module',
})

function Home() {
  const {
    dispatch,
    state: { room, role },
  } = useStreamsContext()
  const peerConnection = usePeerConnection()
  const db = useFirestore()
  const { roomID } = useParams()

  useEffect(() => {
    if (roomID !== undefined) {
      dispatch({ type: 'SET-ROOM', payload: roomID })
      dispatch({ type: 'SET-ROLE', payload: 'callee' })
    }
  }, [])

  useEffect(() => {
    // TODO: Fix: ROOM ERR -> (cannot distinguish between callee and caller rooms id)

    // eslint-disable-next-line no-undef
    const unsubscribe: VoidFunction[] = []
    async function snapshotSetup(role: 'caller' | 'callee') {
      const { collection, doc, onSnapshot, query } = await import('firebase/firestore')

      unsubscribe.push(
        onSnapshot(query(collection(db, 'rooms', room, `${role}Candidates`)), (snapshot) => {
          snapshot.docChanges().forEach(async (change) => {
            if (change.type === 'added') {
              const iceCandidate = new RTCIceCandidate(change.doc.data())
              console.log(`Got new remote ICE candidate: ${iceCandidate.address}~${iceCandidate.port}`)
              await peerConnection.addIceCandidate(iceCandidate)
            }
          })
        }),
      )

      if (role === 'caller') {
        unsubscribe.push(
          onSnapshot(doc(db, 'rooms', room), async (snapshot) => {
            const data = snapshot.data()
            if (!peerConnection.currentRemoteDescription && data?.answer) {
              console.log('Got remote description: ', data.answer)
              const rtcSessionDescription = new RTCSessionDescription(data.answer)
              await peerConnection.setRemoteDescription(rtcSessionDescription)
            }
          }),
        )
      }
    }

    if (role === 'caller') {
      snapshotSetup('caller')
    }

    return () => {
      unsubscribe.forEach((fn) => fn())
    }
  }, [room, role])

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

      if (role !== 'idle')
        thread.sendLocalIceCandidatesToDb({
          candidate: event.candidate.toJSON(),
          roomID: room,
          role,
        })
    }

    peerConnection.addEventListener('connectionstatechange', connectionStateChange)
    peerConnection.addEventListener('icecandidate', iceCandidateEventHandler)
    peerConnection.addEventListener('iceconnectionstatechange ', iceConnectionStateChange)
    peerConnection.addEventListener('icegatheringstatechange', iceGatheringStateChange)
    peerConnection.addEventListener('signalingstatechange', signalingStateChange)

    return () => {
      peerConnection.removeEventListener('connectionstatechange', connectionStateChange)
      peerConnection.removeEventListener('icecandidate', iceCandidateEventHandler)
      peerConnection.removeEventListener('iceconnectionstatechange ', iceConnectionStateChange)
      peerConnection.removeEventListener('icegatheringstatechange', iceGatheringStateChange)
      peerConnection.removeEventListener('signalingstatechange', signalingStateChange)
    }
  }, [peerConnection, role])

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
