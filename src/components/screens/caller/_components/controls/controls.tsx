import { useEffect } from 'react'
import { useStreamsContext } from '~/components/contexts/StreamsContext'
import { Camera } from '~/components/screens/_components/controls/camera'
import { Create } from '~/components/screens/caller/_components/controls/create'
import { useReset } from '~/components/screens/caller/hooks/useReset'

export const Controls = () => {
  const reset = useReset()
  const {
    state: { isConnectionEstablished },
  } = useStreamsContext()
  useEffect(() => {
    if (isConnectionEstablished === 'disconnected') reset()
  }, [isConnectionEstablished])

  return (
    <div className="flex justify-center gap-5 bg-base-300 py-8">
      <Camera />
      <Create />
    </div>
  )
}
