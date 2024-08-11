import Hangup from '~/assets/images/hangup.png'
import { useStreamsContext } from '~/components/contexts/StreamsContext'
import { useToast } from '~/components/contexts/ToastContext'
import { Camera } from '~/components/screens/home/_components/camera'
import Create from '~/components/screens/home/_components/create'

export function Controls() {
  const {
    state: { localVideo, remoteVideo },
  } = useStreamsContext()
  const toast = useToast()

  async function handleHangup() {
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

    document.location.reload()
  }

  return (
    <div className="flex justify-center gap-5 bg-base-300 py-8">
      <Camera />
      <Create />
      <button onClick={handleHangup} className="btn btn-circle p-2" type="button">
        <img src={Hangup} alt="hangup" />
      </button>
    </div>
  )
}
