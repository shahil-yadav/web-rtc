import { useNavigate, useParams } from 'react-router-dom'
import connect from '~/assets/images/connect.png'
import { useStreamsContext } from '~/components/contexts/StreamsContext'
import { Button } from '~/components/ui/button'
import { usePeerConnection } from '~/hooks/usePeerConnection'
import { useLocalStream } from '~/hooks/useStreams'
import { useFirestore } from '~/lib/firebase'

export function Connect() {
  const navigate = useNavigate()
  const { state, dispatch } = useStreamsContext()

  const { roomID } = useParams()
  const localStream = useLocalStream()

  async function handleJoinRoomById() {
    const { getDoc, doc, updateDoc } = await import('firebase/firestore')

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
      // peerConnection.addEventListener('icecandidate', function (event) {
      //   if (!event.candidate) {
      //     console.log('Got final candidates!')
      //     return
      //   }
      //   console.log('Got candidate: ', event.candidate)
      //   addDoc(collection(db, 'rooms', roomID, 'calleeCandidates'), event.candidate.toJSON())
      // })
      /** Listen for calleeCandidates[END] 👆 */

      // /** 3. Add an event listener to remote streams[START] 👇 */
      // if (!remoteStream) return
      // peerConnection.addEventListener('track', (event) => {
      //   console.log('Got remote track:', event.streams[0])
      //   event.streams[0].getTracks().forEach((track) => {
      //     console.log('Add a track to the remoteStream:', track)
      //     remoteStream.addTrack(track)
      //   })
      // })
      // /** Add an event listener to remote streams[END] 👆 */

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

      if (roomID !== undefined) dispatch({ type: 'SET-ROOM', payload: roomID })
    } else {
      navigate('/404')
      window.location.reload()
    }
  }

  return (
    <Button disabled={state.isCameraOpened === false} handleClickEvent={handleJoinRoomById}>
      <img src={connect} />
    </Button>
  )
}
