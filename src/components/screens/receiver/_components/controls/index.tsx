import { useEffect } from 'react'

import { useStreamsContext } from '~/components/contexts/StreamsContext'
import { Camera } from '~/components/screens/_components/controls/camera'
import { Connect } from '~/components/screens/receiver/_components/controls/connect'
import { useReset } from '~/components/screens/receiver/hooks/useReset'

export function Controls() {
  const { state } = useStreamsContext()
  const reset = useReset()

  useEffect(() => {
    if (state.isConnectionEstablished === 'disconnected') reset()
  }, [state.isConnectionEstablished])

  return (
    <div className="flex justify-center gap-5 bg-base-300 py-8">
      <Camera />
      <Connect />
    </div>
  )
}
