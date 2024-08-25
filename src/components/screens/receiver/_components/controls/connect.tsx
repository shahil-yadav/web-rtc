import { Unsubscribe } from 'firebase/auth'
import { addDoc, collection, doc, getDoc, onSnapshot, query, updateDoc } from 'firebase/firestore'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useStreamsContext } from '~/components/contexts/StreamsContext'
import { useFirestore } from '~/lib/firebase'

export function Connect() {
  const navigate = useNavigate()
  const { state, dispatch, reference } = useStreamsContext()
  const { roomID } = useParams()
  const db = useFirestore()

  async function handleJoinRoomById() {
    if (!roomID) return
    const document = await getDoc(doc(db, 'rooms', roomID))
    if (document.exists()) {
      if (!reference) return
      /** 1. Add local streams to the peer connection */
      reference.localStream.current.getTracks().forEach((track) => {
        reference.peerConnection.current.addTrack(track, reference.localStream.current)
      })

      /** Code for creating a SDP answer */
      const offer = document.data().offer
      console.log('Got offer:', offer)
      await reference.peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer))
      const answer = await reference.peerConnection.current.createAnswer()
      console.log('Created answer:', answer)
      await reference.peerConnection.current.setLocalDescription(answer)
      const roomWithAnswer = {
        answer: {
          type: answer.type,
          sdp: answer.sdp,
        },
      }
      await updateDoc(doc(db, 'rooms', roomID), roomWithAnswer)
      if (roomID !== undefined) dispatch({ type: 'SET-ROOM', payload: roomID })
    } else {
      navigate('/404')
      window.location.reload()
    }
  }

  useEffect(() => {
    if (state.roomID.length === 0) {
      return
    }
    if (!reference) return

    const roomID = state.roomID
    function connectionStateChangeEventListener() {
      console.log(`Peer connection state change => ${reference?.peerConnection.current.connectionState}`)
      dispatch({
        type: 'SET-CONNECTION-ESTABILISHMENT-STATUS',
        payload: reference.peerConnection.current.connectionState,
      })
    }
    reference.peerConnection.current.addEventListener('connectionstatechange', connectionStateChangeEventListener)

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
    reference.peerConnection.current.addEventListener('icecandidate', sendLocalIceCandidatesToDb)
    /**  Listen for ice-candidates[END] 👆 */

    const unsubSnapshot: Unsubscribe[] = []
    unsubSnapshot.push(
      /** 5.Listening for remote ice candidates[START] 👇 */
      onSnapshot(query(collection(db, 'rooms', roomID, 'callerCandidates')), (snapshot) => {
        snapshot.docChanges().forEach(async (change) => {
          if (change.type === 'added') {
            const iceCandidate = change.doc.data()
            console.log(`Got new remote ICE candidate: ${JSON.stringify(iceCandidate)}`)
            await reference.peerConnection.current.addIceCandidate(new RTCIceCandidate(iceCandidate))
          }
        })
      }),
      /** Listening for remote ice candidates[END] 👆 */
    )

    return () => {
      reference.peerConnection.current.removeEventListener('icecandidate', sendLocalIceCandidatesToDb)
      reference.peerConnection.current.removeEventListener('connectionstatechange', connectionStateChangeEventListener)
      unsubSnapshot.forEach((fn) => fn())
    }
  }, [state.roomID])

  useEffect(() => {
    state.isCameraOpened && handleJoinRoomById()
  }, [state.isCameraOpened])

  return null
}
