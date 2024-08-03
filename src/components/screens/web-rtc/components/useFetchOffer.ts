import { DocumentData, getDoc, doc } from 'firebase/firestore'
import { useState, useEffect } from 'react'
import { useFirestore } from '~/lib/firebase'

export function useFetchOffer(roomID: string) {
  const [state, setState] = useState<DocumentData>()
  const db = useFirestore()

  useEffect(() => {
    if (!roomID) return

    async function fetchRoomDetails() {
      const roomSnap = await getDoc(doc(db, 'rooms', roomID))
      if (roomSnap.exists()) {
        setState(roomSnap.data())
      } else {
        setState(undefined)
        console.info('Could not find the room')
      }
    }
    fetchRoomDetails()
  }, [roomID])

  return state
}
