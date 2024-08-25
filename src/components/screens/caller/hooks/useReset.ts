import { collection, doc, setDoc } from 'firebase/firestore'
import toast from 'react-hot-toast'
import { iceConfiguration, useStreamsContext } from '~/components/contexts/StreamsContext'
import { useCreateCall } from '~/components/screens/caller/hooks/useCreateCall'
import { deleteCollection } from '~/components/screens/utils/deleteCollection'
import { useFirestore } from '~/lib/firebase'

export function useReset() {
  const {
    state: { roomID },
    dispatch,
    reference,
  } = useStreamsContext()
  const call = useCreateCall()

  const db = useFirestore()

  return () => {
    if (roomID.length === 0) return

    const toastID = toast.loading(`Resetting the room ${roomID} in Firebase`)
    Promise.all([
      deleteCollection(db, collection(db, 'rooms', roomID, 'callerCandidates'), 10),
      deleteCollection(db, collection(db, 'rooms', roomID, 'calleeCandidates'), 10),
      setDoc(doc(db, 'rooms', roomID), {}),
    ]).then(() => {
      if (reference === undefined) return
      // reference.localStream.current.getTracks().map((track) => track.stop())
      // reference.localStream.current =
      reference.remoteStream.current = new MediaStream()
      reference.peerConnection.current.close()
      reference.peerConnection.current = new RTCPeerConnection(iceConfiguration)
      dispatch({ type: 'SET-REMOTE-ANSWER-STATUS', payload: false })
      dispatch({ type: 'SET-RESET-TRIGGER', payload: true })
      call(roomID)
      toast.success('New Peer Connection is ready')
      toast.success('Call Made')
    })

    toast.dismiss(toastID)
  }
}
