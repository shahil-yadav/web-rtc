import {
  collection,
  CollectionReference,
  deleteDoc,
  doc,
  DocumentData,
  Firestore,
  getDocs,
  limit,
  query,
  Query,
  setDoc,
  writeBatch,
} from 'firebase/firestore'
import { useStreamsContext } from '~/components/contexts/StreamsContext'
import { Camera } from '~/components/screens/_components/controls/camera'
import { Create } from '~/components/screens/caller/_components/controls/create'
import { useSetupPeerConnection } from '~/hooks/usePeerConnection'
import { useSetRemoteStream } from '~/hooks/useStreams'
import { useFirestore } from '~/lib/firebase'

export const Controls = () => {
  return (
    <div className="flex justify-center gap-5 bg-base-300 py-8">
      <Camera />
      <Create />
      <Reset />
    </div>
  )
}

function Reset() {
  const {
    state: { roomID },
    dispatch,
  } = useStreamsContext()
  const setupPeerConnection = useSetupPeerConnection()
  const setupRemoteStream = useSetRemoteStream()
  const db = useFirestore()

  function handleReset() {
    setupPeerConnection()
    setupRemoteStream(new MediaStream())
    deleteCollection(db, collection(db, 'rooms', roomID, 'callerCandidates'), 10)
    deleteCollection(db, collection(db, 'rooms', roomID, 'calleeCandidates'), 10)
    setDoc(doc(db, 'rooms', roomID), {})
  }

  return (
    <button onClick={handleReset} className="btn btn-circle bg-base-content p-2 text-white disabled:bg-red-500">
      Reset
    </button>
  )
}

function deleteCollection(db: Firestore, collectionRef: CollectionReference<DocumentData>, batchSize: number) {
  /** Dangerous recursive function */
  async function deleteQueryBatch(
    db: Firestore,
    query: Query<DocumentData>,
    batchSize: number,
    resolve: (value?: unknown) => void,
  ) {
    const snapshot = await getDocs(query)

    // When there are no documents left, we are done
    let numDeleted = 0
    if (snapshot.size > 0) {
      // Delete documents in a batch
      const batch = writeBatch(db)
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref)
      })

      await batch.commit()
      numDeleted = snapshot.size
    }

    if (numDeleted < batchSize) {
      resolve()
      return
    }

    // Recurse on the next process tick, to avoid
    // exploding the stack.
    setTimeout(() => {
      deleteQueryBatch(db, query, batchSize, resolve)
    }, 0)
  }

  const q = query(collectionRef, limit(batchSize))
  return new Promise((resolve) => {
    deleteQueryBatch(db, q, batchSize, resolve)
  })
}
