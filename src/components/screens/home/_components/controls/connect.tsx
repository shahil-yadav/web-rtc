import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import connect from '~/assets/images/connect.png'
import { useStreamsContext } from '~/components/contexts/StreamsContext'
import { usePeerConnection } from '~/components/screens/home/hooks/usePeerConnection'
import { useFirestore } from '~/lib/firebase'
import { useLocalStream } from '../../hooks/useStreams'

const thread = new ComlinkWorker<typeof import('~/lib/workers')>(new URL('~/lib/workers', import.meta.url))

export function Connect() {
  const navigate = useNavigate()
  const {
    state: { camera },
  } = useStreamsContext()

  const { roomID: params } = useParams()
  const localStream = useLocalStream()
  const db = useFirestore()
  const peerConnection = usePeerConnection()

  useEffect(() => {
    if (camera === true) handleJoinRoomById()
  }, [camera, params])

  async function handleJoinRoomById() {
    const { getDoc, doc } = await import('firebase/firestore')
    if (!params) return

    const document = await getDoc(doc(db, 'rooms', params))
    if (document.exists()) {
      /** 1. Add local streams to the peer connection[START] 👇 */
      localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream)
      })
      /** Add local streams to the peer connection[END] 👆 */

      /** 2. Send ice candidate to calleeCandidates[START] 👇 */
      //  --> Home)
      /** Send ice candidate to calleeCandidates[END] 👆 */

      /** 3. Add an event listener to remote streams[START] 👇 */
      //  --> Remote)
      /** Add an event listener to remote streams[END] 👆 */

      /** 4. Code for creating a SDP answer[START] 👇 */
      const offer = document.data().offer
      console.log('Got offer:', offer)
      await peerConnection.setRemoteDescription(new RTCSessionDescription(offer))
      const answer = await peerConnection.createAnswer()
      console.log('Created answer:', answer)
      await peerConnection.setLocalDescription(answer)
      thread.sendCallerOfferOrAnswerToDb(params, {
        answer: {
          type: answer.type,
          sdp: answer.sdp,
        },
      })
      /** Code for creating a SDP answer[END] 👆 */
    } else {
      navigate('/404')
      window.location.reload()
    }
  }

  return (
    <button disabled onClick={handleJoinRoomById} className="btn btn-circle p-2 disabled:bg-red-500">
      <img src={connect} />
    </button>
  )
}
