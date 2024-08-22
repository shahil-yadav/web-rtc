import { Unsubscribe } from 'firebase/auth'
import { addDoc, collection, onSnapshot, query } from 'firebase/firestore'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useStreamsContext } from '~/components/contexts/StreamsContext'
import { Video } from '~/components/screens/_components/video'
import { Controls } from '~/components/screens/receiver/_components/controls'
import { Messages } from '~/components/screens/receiver/_components/controls/messages'
import { Head } from '~/components/shared/Head'
import { usePeerConnection } from '~/hooks/usePeerConnection'
import { useFirestore } from '~/lib/firebase'

function Reciever() {
  const peerConnection = usePeerConnection()

  const { state, dispatch } = useStreamsContext()
  const db = useFirestore()
  const { roomID: pathVariable } = useParams()

  useEffect(() => {
    if (state.roomID.length === 0) {
      return
    }

    const roomID = state.roomID

    function connectionStateChangeEventListener() {
      console.log(`Peer connection state change => ${peerConnection.connectionState}`)
      dispatch({ type: 'SET-CONNECTION-ESTABILISHMENT-STATUS', payload: peerConnection.connectionState })
    }
    peerConnection.addEventListener('connectionstatechange', connectionStateChangeEventListener)

    /** 2. Listen for ice-candidates[START] 👇 */
    function sendLocalIceCandidatesToDb(event: RTCPeerConnectionIceEvent) {
      if (!event.candidate) {
        console.log('Got final candidates!')
        return
      }
      console.log('Got candidate: ', event.candidate)
      if (!roomID) return
      addDoc(collection(db, 'rooms', roomID, 'calleeCandidates'), event.candidate.toJSON())
    }
    peerConnection.addEventListener('icecandidate', sendLocalIceCandidatesToDb)
    /**  Listen for ice-candidates[END] 👆 */

    const unsubSnapshot: Unsubscribe[] = []
    unsubSnapshot.push(
      /** 5.Listening for remote ice candidates[START] 👇 */
      onSnapshot(query(collection(db, 'rooms', roomID, 'callerCandidates')), (snapshot) => {
        snapshot.docChanges().forEach(async (change) => {
          if (change.type === 'added') {
            const iceCandidate = change.doc.data()
            console.log(`Got new remote ICE candidate: ${JSON.stringify(iceCandidate)}`)
            await peerConnection.addIceCandidate(new RTCIceCandidate(iceCandidate))
          }
        })
      }),
      /** Listening for remote ice candidates[END] 👆 */
    )

    return () => {
      peerConnection.removeEventListener('icecandidate', sendLocalIceCandidatesToDb)
      peerConnection.removeEventListener('connectionstatechange', connectionStateChangeEventListener)
      unsubSnapshot.forEach((fn) => fn())
    }
  }, [peerConnection, state.roomID])

  return (
    <>
      <Head title="Reciever" description="P2P Video Chatting Platform" />
      <main className="flex h-full flex-col">
        <div className="relative my-5 flex h-full items-center justify-center">
          {state.isConnectionEstablished !== 'connected' && <Messages />}
          <Video state="remote" />
          <div className="absolute bottom-5 right-5 flex aspect-[2/3] w-1/3 max-w-40 items-center justify-center bg-base-200">
            <Video state="local" />
          </div>
        </div>
      </main>
      <Controls />
    </>
  )
}

export default Reciever
