import { Camera } from '~/components/screens/home/_components/controls/camera'
import { Create } from '~/components/screens/home/_components/controls/create'
import { Hangup } from '~/components/screens/home/_components/controls/hangup'

export function Controls() {
  return (
    <div className="flex justify-center gap-5 bg-base-300 py-8">
      <Camera />
      <Create />
      <Hangup />
    </div>
  )
}
