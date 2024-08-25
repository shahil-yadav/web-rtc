import { useStreamsContext } from '~/components/contexts/StreamsContext'
import { Video } from '~/components/screens/_components/video'
import { Controls } from '~/components/screens/caller/_components/controls/controls'
import { Messages } from '~/components/screens/caller/_components/messages'
import { Head } from '~/components/shared/Head'

function Caller() {
  const { state } = useStreamsContext()

  return (
    <>
      <Head title="Caller" description="P2P Video Chatting Platform" />
      <main className="flex h-full flex-col">
        <div className="relative my-5 flex h-full items-center justify-center">
          {state.isConnectionEstablished !== 'connected' && <Messages />}
          <Video state="remote" />
          <div className="absolute bottom-5 right-5 flex aspect-[2/3] w-1/3 max-w-40 items-center justify-center bg-base-200">
            <Video state="local" />
          </div>
        </div>
      </main>
      <Controls />
    </>
  )
}

export default Caller
