import { DocumentData, getDocs, collection } from 'firebase/firestore'
import { useState, useEffect } from 'react'
import { useFirestore } from '~/lib/firebase'

export function useFetchRemoteIceCandidates(roomID: string) {
  const [state, setState] = useState<DocumentData[]>([])
  const db = useFirestore()

  useEffect(() => {
    if (!roomID) return

    async function fetchCallerIceCandidates() {
      const iceCandidatesSnapshot = await getDocs(collection(db, 'rooms', roomID, 'callerCandidates'))

      if (iceCandidatesSnapshot.empty === true) {
        setState([])
        return
      }

      const iceCandidates: DocumentData[] = []
      iceCandidatesSnapshot.forEach((doc) => {
        iceCandidates.push(doc.data())
      })
      setState((prev) => [...prev, ...iceCandidates])
    }

    fetchCallerIceCandidates()
  }, [roomID])

  return state
}
