import toast from 'react-hot-toast'
import { VideocamIcon } from '~/assets/svg/VideocamIcon'
import { useStreamsContext } from '~/components/contexts/StreamsContext'
import { Button } from '~/components/ui/button'

export function Camera() {
  const {
    dispatch,
    state: { isCameraOpened },
    reference,
  } = useStreamsContext()

  async function handleEvent() {
    if (reference !== undefined) {
      reference.localStream.current = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    }
    dispatch({ type: 'SET-CAMERA', payload: true })
  }

  return (
    <Button
      disabled={isCameraOpened}
      handleClickEvent={() =>
        toast.promise(handleEvent(), {
          success: 'Set camera successfully',
          loading: 'Gaining access',
          error: 'User denied the camera permissions',
        })
      }
    >
      <VideocamIcon />
    </Button>
  )
}
