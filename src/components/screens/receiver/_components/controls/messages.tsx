import clsx from 'clsx'
import { useStreamsContext } from '~/components/contexts/StreamsContext'

function Messages() {
  const { state } = useStreamsContext()

  return (
    <div className="space-y-5">
      <ul className="list-decimal text-lg">
        <li className={clsx(state.isCameraOpened && 'line-through')}>Open the camera so as to start the connection</li>
        <li>Click on satellite icon to start the connection</li>
      </ul>
      {state.isConnectionEstablished === 'connecting' && <span className="loading loading-spinner loading-sm" />}
    </div>
  )
}

export { Messages }
