import { useStreamsContext } from '~/components/contexts/StreamsContext'
import { openCameraWithAudioAndVideo, useLocalStream } from '~/components/screens/home/hooks/useStreams'
import { Button } from '~/components/screens/home/ui/button'
import { CiVideoOff, CiVideoOn } from 'react-icons/ci'
import { useToast } from '~/components/contexts/ToastContext'

export function Camera() {
  const {
    dispatch,
    state: { camera },
  } = useStreamsContext()
  const localStream = useLocalStream()
  const toast = useToast()
  return (
    <Button
      handleClickEvent={() => {
        if (camera === false) {
          openCameraWithAudioAndVideo().then((state) => dispatch({ type: 'SET-CAMERA', payload: state }))
          toast.open('Opening camera. Please wait!')
        } else {
          localStream?.getTracks().forEach((track) => track.stop())
          dispatch({ type: 'SET-CAMERA', payload: false })
        }
      }}
    >
      {camera === false ? <CiVideoOn color="#fff" size={24} /> : <CiVideoOff color="#fff" size={24} />}
    </Button>
  )
}
