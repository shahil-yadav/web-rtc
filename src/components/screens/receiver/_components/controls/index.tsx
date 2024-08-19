import { Camera } from '~/components/screens/_components/controls/camera'
import { Connect } from '~/components/screens/receiver/_components/controls/connect'

export function Controls() {
  return (
    <div className="flex justify-center gap-5 bg-base-300 py-8">
      <Camera />
      <Connect />
    </div>
  )
}
