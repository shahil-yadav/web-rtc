import { Dialog } from '@headlessui/react'
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import AddIcon from '~/assets/svg/AddIcon'
import { Status, useStreamsContext } from '~/components/contexts/StreamsContext'
import { Camera } from '~/components/screens/_components/controls/camera'
import { Video } from '~/components/screens/_components/video'
import { Button } from '~/components/ui/button'
import { Tooltip } from '~/components/ui/tooltip'
import { usePeerConnection } from '~/hooks/usePeerConnection'
import { useLocalStream } from '~/hooks/useStreams'
import { useFirestore } from '~/lib/firebase'

export function Create() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [status, setStatus] = useState<Status>('none')
  const { state, dispatch } = useStreamsContext()
  const db = useFirestore()
  const localStream = useLocalStream()
  const peerConnection = usePeerConnection()

  async function handleCreateRoom() {
    let roomID = state.roomID

    if (roomID.length === 0) {
      /** 0. Create a document(room) in the collection of rooms [START] 👇 */
      try {
        setStatus(() => 'loading')
        const roomIDDocRef = await addDoc(collection(db, 'rooms'), {})
        roomID = roomIDDocRef.id
        dispatch({ type: 'SET-ROOM', payload: roomIDDocRef.id })
        setStatus(() => 'success')
      } catch (error) {
        setStatus(() => 'error')
      }
      /** Create a document(room) in the collection of rooms [END] 👆 */
    }

    // setupPeerConnection()
    // setupRemoteStream(new MediaStream())

    /** 1. Add local stream to the peer connection[START] 👇 */
    localStream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localStream)
    })
    console.log('Attatched localStreams to the peer-connection')
    /**  Add local stream to the peer connection[END] 👆 */

    /** 3. Create an offer and send to the DB[START] 👇 */
    const offer = await peerConnection.createOffer()
    peerConnection.setLocalDescription(offer)
    const roomWithOffer = {
      offer: {
        type: offer.type,
        sdp: offer.sdp,
      },
    }
    if (!roomID) return
    await updateDoc(doc(db, 'rooms', roomID), roomWithOffer)
    /** Create an offer and send to the DB[END] 👆 */
  }

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
          <Dialog.Panel className="space-y-4 border bg-white p-4">
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
            <div className="flex gap-4">
              <button className="btn" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </button>
              <button className="btn" onClick={handleCreateRoom}>
                Create Room
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  )
}
