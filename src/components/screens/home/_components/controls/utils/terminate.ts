import {
  collection,
  CollectionReference,
  deleteDoc,
  doc,
  DocumentData,
  Firestore,
  getDocs,
  limit,
  Query,
  query,
  writeBatch,
} from 'firebase/firestore'

export async function close({
  firestore: db,
  localStream,
  remoteStream,
  room,
}: {
  firestore: Firestore
  localStream?: MediaStream
  remoteStream?: MediaStream
  room: string
}) {
  const streams = [localStream, remoteStream]
  streams.forEach((stream) => {
    if (stream instanceof MediaStream) {
      const tracks = stream.getTracks()
      tracks.forEach((track) => track.stop())
    }
  })

  try {
    /** You have to be a caller in order to delete the db collection */
    await deleteCollection(db, collection(db, 'rooms', room, 'callerCandidates'), 10)
    await deleteCollection(db, collection(db, 'rooms', room, 'calleeCandidates'), 10)
    await deleteDoc(doc(db, 'rooms', room))

    document.location.reload()
  } catch (error) {
    console.error(error)
  }
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
