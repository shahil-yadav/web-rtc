import clsx from 'clsx'
import { useMemo } from 'react'
import { useAuthState } from '~/components/contexts/UserContext'

export function LocalAvatar() {
  const { state } = useAuthState()
  const isActive = useMemo(() => navigator.onLine, [navigator.onLine])

  if (state.state === 'SIGNED_IN') {
    const avatar = state.avatar
    return (
      <div className="avatar">
        <div
          style={{ width: 60 }}
          className={clsx('rounded-full ring ring-offset-1 ring-offset-base-100', { 'ring-primary': isActive })}
        >
          <img src={avatar.src} alt={avatar.alt} />
        </div>
      </div>
    )
  }

  return null
}
