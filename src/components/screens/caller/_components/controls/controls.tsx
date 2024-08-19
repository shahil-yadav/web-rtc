import { Camera } from '~/components/screens/_components/controls/camera'
import { Create } from '~/components/screens/caller/_components/controls/create'

export const Controls = () => {
  return (
    <div className="flex justify-center gap-5 bg-base-300 py-8">
      <Camera />
      <Create />
    </div>
  )
}
