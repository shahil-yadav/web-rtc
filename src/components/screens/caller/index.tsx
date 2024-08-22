import { Unsubscribe } from 'firebase/auth'
import { addDoc, collection, doc, onSnapshot, query } from 'firebase/firestore'
import { useEffect } from 'react'
import { useStreamsContext } from '~/components/contexts/StreamsContext'
import { Video } from '~/components/screens/_components/video'
import { Controls } from '~/components/screens/caller/_components/controls/controls'
import { Messages } from '~/components/screens/caller/_components/messages'
import { Head } from '~/components/shared/Head'
import { usePeerConnection } from '~/hooks/usePeerConnection'
import { useFirestore } from '~/lib/firebase'

function Caller() {
  const { state, dispatch } = useStreamsContext()
  const db = useFirestore()
  const peerConnection = usePeerConnection()

  useEffect(() => {
    if (state.roomID.length === 0) return

    function sendLocalIceCandidatesToDb(event: RTCPeerConnectionIceEvent) {
      if (!event.candidate) {
        console.log('Got final candidate')
        return
      }
      if (state.roomID.length > 0) {
        addDoc(collection(db, 'rooms', state.roomID, 'callerCandidates'), event.candidate.toJSON()).then(() =>
          console.log('Sent ice candidate to DB'),
        )
      } else console.error('Room ID is null, cannot send ice to db')
    }
    peerConnection.addEventListener('icecandidate', sendLocalIceCandidatesToDb)

    function connectionStateChangeEventListener() {
      console.log(`Peer connection state change => ${peerConnection.connectionState}`)
      dispatch({ type: 'SET-CONNECTION-ESTABILISHMENT-STATUS', payload: peerConnection.connectionState })
    }
    peerConnection.addEventListener('connectionstatechange', connectionStateChangeEventListener)

    const unsubSnapshot: Unsubscribe[] = []
    if (state.roomID.length > 0) {
      unsubSnapshot.push(
        /** 5. Listen for remote ice candidates[START] 👇 */
        onSnapshot(query(collection(db, 'rooms', state.roomID, 'calleeCandidates')), (snapshot) => {
          snapshot.docChanges().forEach(async (change) => {
            if (change.type === 'added') {
              const iceCandidate = new RTCIceCandidate(change.doc.data())
              console.log(`Got new remote ICE candidate: ${iceCandidate.address}~${iceCandidate.port}`)
              await peerConnection.addIceCandidate(iceCandidate)
            }
          })
        }),
        /** Listen for remote ice candidates[END] 👆 */

        /** 6. Listen for remote answers[START] 👇 */
        onSnapshot(doc(db, 'rooms', state.roomID), async (snapshot) => {
          const data = snapshot.data()
          if (!peerConnection.currentRemoteDescription && data?.answer) {
            console.log('Got remote description: ', data.answer)
            const rtcSessionDescription = new RTCSessionDescription(data.answer)
            await peerConnection.setRemoteDescription(rtcSessionDescription)
            dispatch({ type: 'SET-REMOTE-ANSWER-STATUS', payload: true })
          }
        }),
        /** Listen for remote answers[END] 👆 */
      )
    }

    return () => {
      peerConnection.removeEventListener('icecandidate', sendLocalIceCandidatesToDb)
      peerConnection.removeEventListener('connectionstatechange', connectionStateChangeEventListener)
      unsubSnapshot.forEach((fn) => fn())
    }
  }, [state.roomID])

  return (
    <>
      <Head title="Caller" description="P2P Video Chatting Platform" />
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

export default Caller
