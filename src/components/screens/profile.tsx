import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useFirestore } from '~/lib/firebase'

interface Images {
  src: string
  alt: string
}

function Profile() {
  const [unordered, setUnordered] = useState<string[]>([])
  const [ordered, setOrdered] = useState<string[]>([])
  const db = useFirestore()

  useEffect(() => {
    async function fetchFromDb() {
      const container: string[] = []

      const querySnapshot = await getDocs(collection(db, 'profiles'))
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        // container.push(doc.data() as
        container.push(doc.id)
      })

      setUnordered(() => [...container])
    }
    fetchFromDb()
  }, [])

  useEffect(() => {
    async function fetchFromDb() {
      const container: string[] = []

      const querySnapshot = await getDocs(query(collection(db, 'profiles'), orderBy('__name__'), limit(1)))
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        // container.push(doc.data() as
        container.push(doc.id)
      })

      setOrdered(() => [...container])
    }
    fetchFromDb()
  }, [])

  return (
    <div className="flex gap-3 bg-black text-white">
      <div className="flex flex-col">
        {unordered.map((el) => (
          <span key={el}>{el}</span>
        ))}
      </div>

      <div className="flex flex-col">
        {ordered.map((el) => (
          <span key={el}>{el}</span>
        ))}
      </div>
    </div>
  )
}

export default Profile
