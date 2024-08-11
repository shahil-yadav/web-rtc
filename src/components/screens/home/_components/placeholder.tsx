import { useMemo } from 'react'
import { useProfileImage } from '~/assets/pfps/useProfileImage'

export function Placeholder() {
  const avatar = useProfileImage()
  const isActive = useMemo(() => navigator.onLine, [navigator.onLine])
  return (
    <div
      className={`flex aspect-square w-1/2 max-w-80 items-center justify-center rounded-full bg-neutral ring-2 ${isActive && 'ring-primary'} ring-offset-4`}
    >
      {avatar && <img className="aspect-square w-1/2 rounded-xl" src={avatar.src} alt={avatar.alt} />}
    </div>
  )
}
