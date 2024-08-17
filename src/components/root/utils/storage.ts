import { QuerySnapshot, DocumentData } from 'firebase/firestore'
import { setupFirebase, useFirestore } from '~/lib/firebase'
import { Image } from '~/components/contexts/UserContext'

setupFirebase()

export async function fetchRandomAvatar(): Promise<Image> {
  const { collection, limit, orderBy, query, where, getDocs } = await import('firebase/firestore')
  const db = useFirestore()

  const citiesRef = collection(db, 'profiles')

  const TOTAL_PROFILE_PICTURES = 330
  const index = Math.random() * TOTAL_PROFILE_PICTURES

  let snapshot: QuerySnapshot<DocumentData>
  snapshot = await getDocs(query(citiesRef, where('index', '>=', index), orderBy('index'), limit(1)))
  if (snapshot.empty) {
    snapshot = await getDocs(query(citiesRef, where('index', '<=', index), orderBy('index'), limit(1)))
  }

  const avatar = snapshot.docs[0].data()
  return {
    src: avatar.src,
    alt: avatar.alt,
  }
}
