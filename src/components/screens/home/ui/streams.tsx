import { useEffect, useRef } from 'react'
import { LocalStream } from '../_components/local-stream'
import { useStreamsContext } from '~/components/contexts/StreamsContext'

export function Streams() {
  const ref = useRef(null)
  const { dispatch } = useStreamsContext()

  useEffect(() => {
    if (!ref.current) return
    dispatch({ type: 'SET-REMOTE-VIDEO', payload: ref.current })
  }, [ref.current])

  return (
    <>
      <video
        autoPlay
        className="absolute h-full w-full object-cover px-5 py-32"
        id="remote-stream"
        loop
        playsInline
        ref={ref}
        // src="https://assets.codepen.io/6093409/river.mp4"
      />

      <div className="absolute bottom-[10%] right-[5%] h-52 w-40 border-4">
        <div className="absolute right-1 top-1 h-6 w-6 rounded-full border-4" />
        <LocalStream />
      </div>
    </>
  )
}
