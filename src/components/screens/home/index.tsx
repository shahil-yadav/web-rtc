import { Head } from '~/components/shared/Head'
import { Controls } from './_components/controls'
import Video from './_components/video'

function Home() {
  return (
    <>
      <Head title="Home" description="P2P Video Chatting Platform" />
      <main className="flex h-full flex-col">
        <div className="relative flex h-full items-center justify-center">
          <Video state="remote" />
          <div className="absolute bottom-5 right-5 flex aspect-[2/3] w-1/3 max-w-40 items-center justify-center bg-base-200">
            <Video state="local" />
          </div>
        </div>
        <Controls />
      </main>
    </>
  )
}

export default Home
