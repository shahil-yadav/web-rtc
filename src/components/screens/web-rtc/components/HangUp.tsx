import { deleteDoc, doc } from 'firebase/firestore'
import { PeerStreams } from './CaptureAudioVideo'
import { useFirestore } from '~/lib/firebase'
import { useToast } from '~/components/contexts/ToastContext'
import Png from '~/assets/hangup.png'

export function HangUp({
  localVideoRef,
  remoteVideoRef,
  roomID,
  setRoomID,
}: PeerStreams & { roomID?: string; setRoomID: (value: string) => void }) {
  const db = useFirestore()
  const toast = useToast()

  const localVideo = localVideoRef.current
  const remoteVideo = remoteVideoRef.current

  function handleEvent() {
    if (!localVideo || !remoteVideo) {
      const err = 'HTML Video not initialised properly'
      toast.open(err)
      throw new Error(err, {
        cause: 'React Ref Hook Error',
      })
    }

    /** Stopping Streams code 👇 */
    const streams = [localVideo, remoteVideo]
    streams.forEach((stream) => {
      if (stream.srcObject instanceof MediaStream) {
        const tracks = stream.srcObject.getTracks()
        tracks.forEach((track) => track.stop())
        stream.srcObject = null
      }
    })
    /** Stopping Streams code 👆 */

    if (roomID)
      deleteDoc(doc(db, 'rooms', roomID)).then(() => {
        setRoomID('')
        /** Reload to remove all the attatched event listener of ICE clients */
        window.location.reload()
      })
  }

  return (
    <button onClick={handleEvent} className="btn-circle btn-outline p-2">
      <img src={Png} alt="hangup" />
    </button>
  )
}
