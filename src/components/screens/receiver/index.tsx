import { useStreamsContext } from '~/components/contexts/StreamsContext'
import { Video } from '~/components/screens/_components/video'
import { Controls } from '~/components/screens/receiver/_components/controls'
import { Messages } from '~/components/screens/receiver/_components/controls/messages'
import { Head } from '~/components/shared/Head'

function Reciever() {
  const { state } = useStreamsContext()

  return (
    <>
      <Head title="Reciever" description="P2P Video Chatting Platform" />
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

export default Reciever
