import { collection, deleteDoc, doc } from 'firebase/firestore'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useStreamsContext } from '~/components/contexts/StreamsContext'
import { deleteCollection } from '~/components/screens/utils/deleteCollection'
import { useFirestore } from '~/lib/firebase'

export function useReset() {
  const {
    state: { roomID },
  } = useStreamsContext()
  const db = useFirestore()
  const navigate = useNavigate()

  return () => {
    if (roomID.length === 0) return
    const toastID = toast.loading(`Resetting the room ${roomID} in Firebase`)
    Promise.all([
      deleteCollection(db, collection(db, 'rooms', roomID, 'callerCandidates'), 10),
      deleteCollection(db, collection(db, 'rooms', roomID, 'calleeCandidates'), 10),
      deleteDoc(doc(db, 'rooms', roomID)),
    ])
    toast.dismiss(toastID)
    navigate('/')
    window.location.reload()
  }
}
