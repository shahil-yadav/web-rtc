import HangupIMG from '~/assets/images/hangup.png'
import { useStreamsContext } from '~/components/contexts/StreamsContext'
import { useFirestore } from '~/lib/firebase'
import { Button } from '../../ui/button'
import { CollectionReference, DocumentData, Firestore, Query } from 'firebase/firestore'
import { useParams } from 'react-router-dom'

export function Hangup() {
  const {
    state: { localStream, remoteStream, room },
  } = useStreamsContext()
  const { roomID } = useParams()
  const db = useFirestore()

  async function handleHangup() {
    const { deleteDoc, doc, collection, query, limit, getDocs, writeBatch } = await import('firebase/firestore')

    const streams = [localStream, remoteStream]
    streams.forEach((stream) => {
      if (stream instanceof MediaStream) {
        const tracks = stream.getTracks()
        tracks.forEach((track) => track.stop())
      }
    })

    function deleteCollection(db: Firestore, collectionRef: CollectionReference<DocumentData>, batchSize: number) {
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

    try {
      if (roomID === undefined) {
        /** You have to be a caller in order to delete the db collection */
        await deleteCollection(db, collection(db, 'rooms', room, 'callerCandidates'), 10)
        await deleteCollection(db, collection(db, 'rooms', room, 'calleeCandidates'), 10)
        await deleteDoc(doc(db, 'rooms', room))
      }

      document.location.reload()
    } catch (error) {}
  }

  return (
    <Button disabled={room.length === 0} handleClickEvent={handleHangup}>
      <img src={HangupIMG} alt="hangup" />
    </Button>
  )
}
