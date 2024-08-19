import { useNavigate, useParams } from 'react-router-dom'
import connect from '~/assets/images/connect.png'
import { useStreamsContext } from '~/components/contexts/StreamsContext'
import { usePeerConnection } from '~/components/screens/home/hooks/usePeerConnection'
import { useFirestore } from '~/lib/firebase'
import { useLocalStream, useRemoteStream } from '../../hooks/useStreams'

export function Connect() {
  const navigate = useNavigate()
  const {
    state: { isCameraOpened: camera },
  } = useStreamsContext()

  const { roomID } = useParams()
  const localStream = useLocalStream()
  const remoteStream = useRemoteStream()

  async function handleJoinRoomById() {
    const { getDoc, doc, addDoc, onSnapshot, query, collection, updateDoc } = await import('firebase/firestore')

    if (!roomID) return

    const db = useFirestore()
    const document = await getDoc(doc(db, 'rooms', roomID))
    if (document.exists()) {
      const peerConnection = usePeerConnection()

      if (!localStream) return
      /** 1. Add local streams to the peer connection[START] 👇 */
      localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream)
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
      if (!remoteStream) return
      peerConnection.addEventListener('track', (event) => {
        console.log('Got remote track:', event.streams[0])
        event.streams[0].getTracks().forEach((track) => {
          console.log('Add a track to the remoteStream:', track)
          remoteStream.addTrack(track)
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
    } else {
      navigate('/404')
      window.location.reload()
    }
  }

  return (
    <button disabled={camera === false} onClick={handleJoinRoomById} className="btn btn-circle p-2 disabled:bg-red-500">
      <img src={connect} />
    </button>
  )
}
