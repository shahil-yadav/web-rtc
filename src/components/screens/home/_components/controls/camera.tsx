import { VideocamIcon } from '~/assets/svg/VideocamIcon'
import { useStreamsContext } from '~/components/contexts/StreamsContext'
import { openCameraWithAudioAndVideo } from '~/components/screens/home/hooks/useStreams'
import { Button } from '~/components/screens/home/ui/button'

export function Camera() {
  const {
    dispatch,
    state: { camera },
  } = useStreamsContext()
  return (
    <Button
      disabled={camera}
      handleClickEvent={async () => {
        dispatch({ type: 'SET-CAMERA', payload: await openCameraWithAudioAndVideo() })
      }}
    >
      <VideocamIcon />
    </Button>
  )
}
