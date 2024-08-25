import { collection, doc, setDoc } from 'firebase/firestore'
import { iceConfiguration, useStreamsContext } from '~/components/contexts/StreamsContext'
import { deleteCollection } from '../utils/deleteCollection'
import { useFirestore } from '~/lib/firebase'
import toast from 'react-hot-toast'
import { useCreateCall } from '~/components/screens/caller/hooks/useCreateCall'

export function useReset() {
  const {
    state: { roomID },
    dispatch,
    reference,
  } = useStreamsContext()
  const call = useCreateCall()

  const db = useFirestore()

  return () => {
    if (reference === undefined || roomID.length === 0) return
    // reference.localStream.current.getTracks().map((track) => track.stop())
    // reference.localStream.current =
    reference.remoteStream.current = new MediaStream()
    reference.peerConnection.current.close()
    reference.peerConnection.current = new RTCPeerConnection(iceConfiguration)
    dispatch({ type: 'SET-REMOTE-ANSWER-STATUS', payload: false })
    dispatch({ type: 'SET-RESET-TRIGGER', payload: true })

    deleteCollection(db, collection(db, 'rooms', roomID, 'callerCandidates'), 10)
    deleteCollection(db, collection(db, 'rooms', roomID, 'calleeCandidates'), 10)
    setDoc(doc(db, 'rooms', roomID), {})
    toast.success('New Peer Connection is ready')
    call(roomID)
  }
}
