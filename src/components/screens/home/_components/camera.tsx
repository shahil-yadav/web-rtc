import { VideocamIcon } from '~/assets/svg/VideocamIcon'
import { Action, useStreamsContext } from '~/components/contexts/StreamsContext'
import { Button } from '~/components/screens/home/ui/button'

export async function handleMedia(
  dispatch: (arg: Action) => void,
  localVideo?: HTMLVideoElement,
  remoteVideo?: HTMLVideoElement,
) {
  if (!localVideo || !remoteVideo) {
    const err = 'HTML Video not initialised properly'
    throw new Error(err, {
      cause: 'React Ref Hook Error',
    })
  }

  const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
  dispatch({ type: 'SET-LOCAL-STREAM', payload: stream })
  dispatch({ type: 'SET-EMPTY-REMOTE-STREAM', payload: null })
}

export function Camera() {
  const {
    state: { localVideo, remoteVideo, localStream },
    dispatch,
  } = useStreamsContext()

  return (
    <Button disabled={!!localStream?.active} handleClickEvent={() => handleMedia(dispatch, localVideo, remoteVideo)}>
      <VideocamIcon />
    </Button>
  )
}
