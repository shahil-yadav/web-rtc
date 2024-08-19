import { VideocamIcon } from '~/assets/svg/VideocamIcon'
import { useStreamsContext } from '~/components/contexts/StreamsContext'
import { openCameraWithAudioAndVideo } from '~/hooks/useStreams'
import { Button } from '~/components/ui/button'

export function Camera() {
  const {
    dispatch,
    state: { isCameraOpened },
  } = useStreamsContext()

  return (
    <Button
      disabled={isCameraOpened}
      handleClickEvent={async () => {
        dispatch({ type: 'SET-CAMERA', payload: await openCameraWithAudioAndVideo() })
      }}
    >
      <VideocamIcon />
    </Button>
  )
}
