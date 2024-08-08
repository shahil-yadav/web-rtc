import { useEffect, useRef } from 'react'
import { useStreamsContext } from '~/components/contexts/StreamsContext'

export function LocalStream() {
  const ref = useRef<HTMLVideoElement>(null)
  const {
    dispatch,
    state: { localStream },
  } = useStreamsContext()

  useEffect(() => {
    if (!ref.current) return
    dispatch({ type: 'SET-LOCAL-VIDEO', payload: ref.current })
  }, [ref.current])

  useEffect(() => {
    if (!localStream || !ref.current) return

    ref.current.srcObject = localStream
  }, [localStream])

  return (
    <video
      id="local-stream"
      autoPlay
      className="m-0 h-full w-full bg-stone-300 object-cover"
      muted
      playsInline
      ref={ref}
    />
  )
}
