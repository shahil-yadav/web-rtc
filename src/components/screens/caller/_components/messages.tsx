import clsx from 'clsx'
import { useStreamsContext } from '~/components/contexts/StreamsContext'

export function Messages() {
  const { state } = useStreamsContext()
  const isRoomCreated = state.roomID.length > 0

  return (
    <div className="space-y-5">
      <ul className="list-decimal text-lg">
        <li className={clsx(state.isCameraOpened && 'line-through')}>Open the camera</li>
        <li className={clsx(isRoomCreated && 'line-through')}>Create the room</li>
        <li>Send the link via Social Media</li>
      </ul>

      {isRoomCreated && !state.isRemoteAnswerRecieved && (
        <p className="flex items-center space-x-2">
          <span className="loading loading-dots loading-sm" /> <span>Awaiting for remote answer</span>
        </p>
      )}
    </div>
  )
}
