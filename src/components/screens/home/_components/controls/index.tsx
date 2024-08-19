import { useParams } from 'react-router-dom'
import { Camera } from '~/components/screens/home/_components/controls/camera'
import { Create } from '~/components/screens/home/_components/controls/create'
import { Hangup } from '~/components/screens/home/_components/controls/hangup'
import { Connect } from './connect'

function Controls() {
  const { roomID } = useParams()
  return (
    <div className="flex justify-center gap-5 bg-base-300 py-8">
      <Camera />
      {roomID ? <Connect /> : <Create />}
      <Hangup />
    </div>
  )
}

export default Controls
