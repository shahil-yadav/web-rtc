import { VideocamIcon } from '~/assets/svg/VideocamIcon'
import { Action, useStreamsContext } from '~/components/contexts/StreamsContext'

export async function handleMedia(
  dispatch: (arg: Action) => void,
  localVideo?: HTMLVideoElement,
  remoteVideo?: HTMLVideoElement,
) {
  if (!localVideo || !remoteVideo) {
    throw new Error('HTML Video not initialised properly', {
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
    <button
      disabled={localStream?.active}
      onClick={() => handleMedia(dispatch, localVideo, remoteVideo)}
      className="btn btn-circle disabled:bg-red-300"
      type="button"
    >
      <VideocamIcon />
    </button>
  )
}
