import { useAuthState } from '~/components/contexts/UserContext'
import { navAssetsSize } from '.'

export function Profile() {
  const { state } = useAuthState()
  if (state.state === 'SIGNED_IN') {
    const avatar = state.avatar
    return (
      avatar && (
        <>
          <span className="hidden sm:inline">
            Welcome, <span className="font-semibold">{avatar.alt}</span>
          </span>
          <div className="avatar">
            <div
              style={{ width: navAssetsSize - 20 }}
              className="rounded-full ring ring-primary ring-offset-1 ring-offset-base-100"
            >
              <img src={avatar.src} alt={avatar.alt} />
            </div>
          </div>
        </>
      )
    )
  }
  return null
}
