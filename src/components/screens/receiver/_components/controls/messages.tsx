import clsx from 'clsx'
import { useStreamsContext } from '~/components/contexts/StreamsContext'

function Messages() {
  const { state } = useStreamsContext()

  if (state.isConnectionEstablished === 'failed' || state.isConnectionEstablished === 'disconnected') {
    return (
      <ul>
        <li className="text-error">The room creator has left the room</li>
        <li className="text-error-content">You may exit this room, since it cannot be reused</li>
      </ul>
    )
  }

  return (
    <div className="space-y-5">
      <ul className="list-decimal text-lg">
        <li className={clsx(state.isCameraOpened && 'line-through')}>Open the camera so as to start the connection</li>
      </ul>
      {state.isConnectionEstablished === 'connecting' && <span className="loading loading-spinner loading-sm" />}
    </div>
  )
}

export { Messages }
