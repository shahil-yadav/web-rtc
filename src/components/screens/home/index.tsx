import { ReactNode, useEffect } from 'react'
import { Head } from '~/components/shared/Head'
import { Controls } from './_components/controls'
import { Streams } from './ui/streams'
import { useStreamsContext } from '~/components/contexts/StreamsContext'
import { useParams } from 'react-router-dom'
import { handleMedia } from './_components/camera'
import { addDoc, collection, doc, getDoc, onSnapshot, query, updateDoc } from 'firebase/firestore'
import { useFirestore } from '~/lib/firebase'
import { usePeerConnection } from './hooks/usePeerConnection'

function Page({ children, title = 'Home' }: { children?: ReactNode; title?: string }) {
  const {
    state: { room, localVideo, remoteVideo, localStream, remoteStream },
    dispatch,
  } = useStreamsContext()

  const db = useFirestore()
  const { joinID } = useParams()

  useEffect(() => {
    if (!joinID || !localVideo || !remoteVideo) return
    handleMedia(dispatch, localVideo, remoteVideo)
  }, [joinID, localVideo, remoteVideo])

  useEffect(() => {
    if (!joinID || !localStream || !remoteStream) return

    async function handleJoinRoom(args: { joinID: string; localStream: MediaStream; remoteStream: MediaStream }) {
      const roomID = args.joinID
      const document = await getDoc(doc(db, 'rooms', roomID))
      if (document.exists()) {
        const peerConnection = usePeerConnection()

        /** 1. Add local streams to the peer connection[START] 👇 */
        args.localStream.getTracks().forEach((track) => {
          peerConnection.addTrack(track, args.localStream)
        })
        /** Add local streams to the peer connection[END] 👆 */

        /** 2. Listen for calleeCandidates[START] 👇 */
        peerConnection.addEventListener('icecandidate', function (event) {
          if (!event.candidate) {
            console.log('Got final candidates!')
            return
          }
          console.log('Got candidate: ', event.candidate)
          addDoc(collection(db, 'rooms', roomID, 'calleeCandidates'), event.candidate.toJSON())
        })
        /** Listen for calleeCandidates[END] 👆 */

        /** 3. Add an event listener to remote streams[START] 👇 */
        peerConnection.addEventListener('track', (event) => {
          console.log('Got remote track:', event.streams[0])
          event.streams[0].getTracks().forEach((track) => {
            console.log('Add a track to the remoteStream:', track)
            args.remoteStream.addTrack(track)
          })
        })
        /** Add an event listener to remote streams[END] 👆 */

        /** 4. Code for creating a SDP answer[START] 👇 */
        const offer = document.data().offer
        console.log('Got offer:', offer)
        await peerConnection.setRemoteDescription(new RTCSessionDescription(offer))
        const answer = await peerConnection.createAnswer()
        console.log('Created answer:', answer)
        await peerConnection.setLocalDescription(answer)
        const roomWithAnswer = {
          answer: {
            type: answer.type,
            sdp: answer.sdp,
          },
        }
        await updateDoc(doc(db, 'rooms', roomID), roomWithAnswer)
        /** Code for creating a SDP answer[END] 👆 */

        /** 5.Listening for remote ice candidates[START] 👇 */
        onSnapshot(query(collection(db, 'rooms', roomID, 'callerCandidates')), (snapshot) => {
          snapshot.docChanges().forEach(async (change) => {
            if (change.type === 'added') {
              const iceCandidate = change.doc.data()
              console.log(`Got new remote ICE candidate: ${JSON.stringify(iceCandidate)}`)
              await peerConnection.addIceCandidate(new RTCIceCandidate(iceCandidate))
            }
          })
        })
        /** Listening for remote ice candidates[END] 👆 */
      }
    }

    handleJoinRoom({ joinID, localStream, remoteStream })
  }, [joinID, localStream, remoteStream])

  return (
    <>
      <Head title={title} description="Developed with ❤️ by Shahil Yadav" />
      <main className="relative grid h-svh place-items-center px-2">
        <Streams />
        <Controls />
        <div className="relative">
          <p className="text-2xl font-bold">{room}</p>
          {children}
        </div>
      </main>
    </>
  )
}

export default Page
