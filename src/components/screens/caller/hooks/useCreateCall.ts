import { addDoc, collection, updateDoc, doc } from 'firebase/firestore'
import { useStreamsContext } from '~/components/contexts/StreamsContext'
import { useFirestore } from '~/lib/firebase'

export function useCreateCall() {
  const { reference, dispatch } = useStreamsContext()
  const db = useFirestore()

  /** Add local stream to the peer connection */
  function attatchMediaStreamToPeerConnection() {
    if (!reference) return

    reference.localStream.current.getTracks().forEach((track) => {
      reference.peerConnection.current.addTrack(track, reference.localStream.current)
    })
    console.log('Attatched localStreams to the peer-connection')
  }

  function registerEventListeners(roomID: string) {
    if (!reference) return

    reference.peerConnection.current.onicecandidate = function (event: RTCPeerConnectionIceEvent) {
      if (!event.candidate) {
        console.log('Got final candidate')
        return
      }
      if (roomID.length > 0) {
        addDoc(collection(db, 'rooms', roomID, 'callerCandidates'), event.candidate.toJSON()).then(() =>
          console.log('Sent ice candidate to DB', event.candidate),
        )
      } else console.error('Room ID is null, cannot send ice to db')
    }

    reference.peerConnection.current.onconnectionstatechange = function connectionStateChangeEventListener() {
      dispatch({
        type: 'SET-CONNECTION-ESTABILISHMENT-STATUS',
        payload: reference.peerConnection.current.connectionState,
      })
      console.log(`Peer connection state change => ${reference.peerConnection.current.connectionState}`)
    }
  }

  async function createLocalOffer(roomID: string) {
    if (!reference) return
    const offer = await reference.peerConnection.current.createOffer()
    await reference.peerConnection.current.setLocalDescription(offer)
    await updateDoc(doc(db, 'rooms', roomID), {
      offer: {
        type: offer.type,
        sdp: offer.sdp,
      },
    })
  }

  return (roomID: string) => {
    if (!reference || roomID.length === 0) return

    attatchMediaStreamToPeerConnection()
    registerEventListeners(roomID)
    createLocalOffer(roomID)
  }
}
