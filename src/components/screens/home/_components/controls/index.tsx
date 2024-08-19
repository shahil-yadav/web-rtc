import { useStreamsContext } from '~/components/contexts/StreamsContext'
import { Camera } from '~/components/screens/home/_components/controls/camera'
import { Create } from '~/components/screens/home/_components/controls/create'
import { Connect } from './connect'

function Controls() {
  const {
    state: { role },
  } = useStreamsContext()

  return (
    <div className="flex justify-center gap-5 bg-base-300 py-8">
      <Camera />
      {role === 'callee' ? <Connect /> : <Create />}
    </div>
  )
}

export default Controls
