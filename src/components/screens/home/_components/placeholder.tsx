import { useMemo } from 'react'
import { useAuthState } from '~/components/contexts/UserContext'

export function Placeholder() {
  const { state } = useAuthState()
  const isActive = useMemo(() => navigator.onLine, [navigator.onLine])

  if (state.state === 'SIGNED_IN') {
    const avatar = state?.avatar
    return (
      <div
        className={`flex aspect-square w-1/2 max-w-80 items-center justify-center rounded-full bg-neutral ring-2 ${isActive && 'ring-primary'} ring-offset-4`}
      >
        {avatar && <img className="aspect-square w-1/2 rounded-xl" src={avatar.src} alt={avatar.alt} />}
      </div>
    )
  }

  return null
}
