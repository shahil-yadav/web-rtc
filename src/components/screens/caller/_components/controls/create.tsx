import { Dialog } from '@headlessui/react'
import { Unsubscribe } from 'firebase/auth'
import { addDoc, collection, doc, onSnapshot, query } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import AddIcon from '~/assets/svg/AddIcon'
import { Status, useStreamsContext } from '~/components/contexts/StreamsContext'
import { Camera } from '~/components/screens/_components/controls/camera'
import { Video } from '~/components/screens/_components/video'
import { useCreateCall } from '~/components/screens/caller/hooks/useCreateCall'
import { Button } from '~/components/ui/button'
import { Tooltip } from '~/components/ui/tooltip'
import { useFirestore } from '~/lib/firebase'

export function Create() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [status, setStatus] = useState<Status>('none')
  const { state, dispatch, reference } = useStreamsContext()
  const call = useCreateCall()
  const db = useFirestore()

  /** Create a document(room) in the collection of rooms  */
  async function createRoomInDb() {
    try {
      setStatus(() => 'loading')
      const roomIDDocRef = await addDoc(collection(db, 'rooms'), {})
      dispatch({ type: 'SET-ROOM', payload: roomIDDocRef.id })
      setStatus(() => 'success')
      return roomIDDocRef.id
    } catch (error) {
      setStatus(() => 'error')
      const err = 'Room Failed to create'
      toast.error(err)
      throw new Error(err)
    }
  }

  async function handleCreateCall() {
    let roomID = state.roomID
    if (roomID.length === 0) {
      roomID = await createRoomInDb()
    }

    call(roomID)
  }

  useEffect(() => {
    const roomID = state.roomID
    if (!reference?.peerConnection) return

    const peerConnection = reference.peerConnection.current
    if (roomID.length === 0) return

    const unsubSnapshot: Unsubscribe[] = []
    unsubSnapshot.push(
      /** Listen for remote ice candidates */
      onSnapshot(query(collection(db, 'rooms', roomID, 'calleeCandidates')), (snapshot) => {
        snapshot.docChanges().forEach(async (change) => {
          if (change.type === 'added') {
            const iceCandidate = new RTCIceCandidate(change.doc.data())
            console.log(`Got new remote ICE candidate: ${iceCandidate.address}~${iceCandidate.port}`)
            await peerConnection.addIceCandidate(iceCandidate)
          }
        })
      }),

      /** Listen for remote answers */
      onSnapshot(doc(db, 'rooms', roomID), async (snapshot) => {
        const data = snapshot.data()
        if (!peerConnection.currentRemoteDescription && data?.answer) {
          console.log('Got remote description: ', data.answer)
          const rtcSessionDescription = new RTCSessionDescription(data.answer)
          await peerConnection.setRemoteDescription(rtcSessionDescription)
          dispatch({ type: 'SET-REMOTE-ANSWER-STATUS', payload: true })
        }
      }),
    )

    return () => {
      unsubSnapshot.map((fn) => fn())
      dispatch({ type: 'SET-RESET-TRIGGER', payload: false })
    }
  }, [state.roomID, state.isResetTriggered])

  return (
    <>
      <Button disabled={state.isCameraOpened === false} handleClickEvent={() => setIsDialogOpen(true)}>
        {status === 'none' && <AddIcon />}
        {status === 'loading' && <span className="loading loading-spinner loading-sm mx-2" />}
        {status === 'success' && <span>✅</span>}
        {status === 'error' && <span>❌</span>}
      </Button>

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} className="relative z-50">
        <div className="fixed inset-0 flex w-screen items-center justify-center">
          <Dialog.Panel className="w-3/4 space-y-4 border bg-white p-4">
            <Dialog.Title className="text-2xl font-bold">
              {state.roomID.length === 0 && status === 'loading' ? (
                <div className="flex items-center gap-2">
                  Please wait:
                  <span className="loading loading-spinner loading-md" />
                </div>
              ) : (
                state.roomID.length === 0 && 'No room created'
              )}
              {status === 'error' && 'Please retry !'}
              {state.roomID.length > 0 && `Room: ${state.roomID}`}
            </Dialog.Title>
            <div className="flex w-full flex-col items-center justify-center gap-2">
              <div className="h-52 w-40">
                <Video state="local" />
              </div>
              <Camera />
            </div>
            <Dialog.Description>Joining as caller</Dialog.Description>
            <p>
              This meeting is powered by{' '}
              <Link className="btn-link text-amber-600" to="https://webrtc.org/">
                SDP protocol
              </Link>
            </p>
            {state.roomID.length > 0 && (
              <label className="input input-bordered flex items-center">
                <input value={window.location.href + state.roomID} disabled type="text" className="grow text-black" />
                <Tooltip text={window.location.href + state.roomID} />
              </label>
            )}
            <div className="flex justify-end gap-4">
              <button className="btn" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </button>
              {state.roomID.length === 0 && (
                <button className="btn" onClick={handleCreateCall}>
                  Create Room
                </button>
              )}
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  )
}
