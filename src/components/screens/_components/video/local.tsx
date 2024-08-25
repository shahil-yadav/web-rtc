import { useEffect, useRef } from 'react'
import { useStreamsContext } from '~/components/contexts/StreamsContext'
import { LocalAvatar } from '~/components/screens/caller/_components/placeholder'

export function Local() {
  const {
    state: { isCameraOpened: camera },
    reference,
  } = useStreamsContext()
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (ref.current === null) return

    if (camera === true && reference?.localStream !== undefined) {
      console.log('Set video')
      ref.current.srcObject = reference.localStream.current
    }
  }, [camera])

  return (
    <>
      {camera === false && <LocalAvatar />}
      <video
        autoPlay
        className={`${camera === false && 'hidden'} h-full w-full max-w-[800px] object-cover`}
        muted
        playsInline
        ref={ref}
      />
    </>
  )
}
