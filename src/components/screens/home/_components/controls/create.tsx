import { Dialog } from '@headlessui/react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import AddIcon from '~/assets/svg/AddIcon'
import { useStreamsContext } from '~/components/contexts/StreamsContext'
import { Camera } from '~/components/screens/home/_components/controls/camera'
import { Video } from '~/components/screens/home/_components/video'
import { usePeerConnection } from '~/components/screens/home/hooks/usePeerConnection'
import { Button } from '~/components/screens/home/ui/button'
import { Tooltip } from '~/components/screens/home/ui/tooltip'
import { useFirestore } from '~/lib/firebase'

export function Create() {
  const [isOpen, setIsOpen] = useState(false)
  const db = useFirestore()
  const peerConnection = usePeerConnection()

  const {
    state: { room, status, localStream, remoteStream },
    dispatch,
  } = useStreamsContext()

  async function handleCreateRoom() {
    if (!localStream || !remoteStream) throw new Error('Local Stream or Remote Stream is not setup')

    const { addDoc, collection, doc, onSnapshot, query, updateDoc } = await import('firebase/firestore')

    let roomID: string | undefined
    /** 0. Create a document(room) in the collection of rooms [START] 👇 */
    try {
      dispatch({ type: 'SET-STATUS', payload: 'loading' })
      const roomIDDocRef = await addDoc(collection(db, 'rooms'), {})
      roomID = roomIDDocRef.id
      dispatch({ type: 'SET-ROOM', payload: roomIDDocRef.id })
      dispatch({ type: 'SET-STATUS', payload: 'success' })
    } catch (error) {
      dispatch({ type: 'SET-STATUS', payload: 'error' })
    }
    /** Create a document(room) in the collection of rooms [END] 👆 */

    /** 1. Add local stream to the peer connection[START] 👇 */
    localStream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localStream)
    })
    console.log('Attatched localStreams to the peer-connection')
    /**  Add local stream to the peer connection[END] 👆 */

    /** 2. Listen for ice-candidates[START] 👇 */
    function sendLocalIceCandidatesToDb(event: RTCPeerConnectionIceEvent) {
      if (!event.candidate) {
        console.log('Got final candidates!')
        return
      }
      console.log('Got candidate: ', event.candidate)
      if (!roomID) return
      addDoc(collection(db, 'rooms', roomID, 'callerCandidates'), event.candidate.toJSON())
    }
    peerConnection.addEventListener('icecandidate', sendLocalIceCandidatesToDb)
    /**  Listen for ice-candidates[END] 👆 */

    /** 3. Create an offer and send to the DB[START] 👇 */
    if (!peerConnection.currentLocalDescription) {
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
    }
    /** Create an offer and send to the DB[END] 👆 */

    /** 4. Add remote stream to the peer connection[START] 👇 */
    function listenRemoteStreams(event: RTCTrackEvent) {
      event.streams[0].getTracks().forEach((track) => {
        console.log('Attatching a remote track to remote streams', track)
        if (remoteStream !== undefined) remoteStream.addTrack(track)
      })
    }
    peerConnection.addEventListener('track', listenRemoteStreams)
    /** Add remote stream to the peer connection[END] 👆 */

    /** 5. Listen for remote ice candidates[START] 👇 */
    if (!roomID) return
    onSnapshot(query(collection(db, 'rooms', roomID, 'calleeCandidates')), (snapshot) => {
      snapshot.docChanges().forEach(async (change) => {
        if (change.type === 'added') {
          const iceCandidate = new RTCIceCandidate(change.doc.data())
          console.log(`Got new remote ICE candidate: ${iceCandidate.address}~${iceCandidate.port}`)
          await peerConnection.addIceCandidate(iceCandidate)
        }
      })
    })
    /** Listen for remote ice candidates[END] 👆 */

    /** 6. Listen for remote offers[START] 👇 */
    onSnapshot(doc(db, 'rooms', roomID), async (snapshot) => {
      const data = snapshot.data()
      if (!peerConnection.currentRemoteDescription && data?.answer) {
        console.log('Got remote description: ', data.answer)
        const rtcSessionDescription = new RTCSessionDescription(data.answer)
        await peerConnection.setRemoteDescription(rtcSessionDescription)
      }
    })
    /** Listen for remote offers[END] 👆 */
  }

  return (
    <>
      <Button disabled={localStream === undefined} handleClickEvent={() => setIsOpen(true)}>
        <AddIcon />
      </Button>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 flex w-screen items-center justify-center">
          <Dialog.Panel className="space-y-4 border bg-white p-4">
            <Dialog.Title className="text-2xl font-bold">
              {room.length === 0 && status === 'loading' ? (
                <div className="flex items-center gap-2">
                  Please wait:
                  <span className="loading loading-spinner loading-md" />
                </div>
              ) : (
                room.length === 0 && 'No room created'
              )}
              {status === 'error' && 'Please retry !'}
              {status === 'success' && `Room: ${room}`}
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
            {room.length > 0 && (
              <label className="input input-bordered flex items-center">
                <input value={window.location.href + room} disabled type="text" className="grow text-black" />

                <Tooltip text={window.location.href + room} />
              </label>
            )}
            <div className="flex gap-4">
              <button className="btn" onClick={() => setIsOpen(false)}>
                Cancel
              </button>
              {room.length === 0 && (
                <button className="btn" onClick={handleCreateRoom}>
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
