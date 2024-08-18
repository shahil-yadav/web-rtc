import { CiVideoOff, CiVideoOn } from 'react-icons/ci'
import { useStreamsContext } from '~/components/contexts/StreamsContext'
import { useToast } from '~/components/contexts/ToastContext'
import { openCameraWithAudioAndVideo, useLocalStream } from '~/components/screens/home/hooks/useStreams'
import { Button } from '~/components/screens/home/ui/button'

export function Camera() {
  const {
    dispatch,
    state: { camera },
  } = useStreamsContext()
  const toast = useToast()
  const localStream = useLocalStream()

  return (
    <Button
      handleClickEvent={() => {
        if (camera === false) {
          openCameraWithAudioAndVideo().then((state) => dispatch({ type: 'SET-CAMERA', payload: state }))
          toast.open('Opening camera. Please wait!')
        } else {
          localStream.getTracks().forEach((track) => track.stop())
          dispatch({ type: 'SET-CAMERA', payload: false })
        }
      }}
    >
      {camera === false ? <CiVideoOn color="#fff" size={24} /> : <CiVideoOff color="#fff" size={24} />}
    </Button>
  )
}
