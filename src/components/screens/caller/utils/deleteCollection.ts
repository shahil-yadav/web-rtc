import {
  Firestore,
  CollectionReference,
  DocumentData,
  Query,
  getDocs,
  writeBatch,
  query,
  limit,
} from 'firebase/firestore'

export function deleteCollection(db: Firestore, collectionRef: CollectionReference<DocumentData>, batchSize: number) {
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
