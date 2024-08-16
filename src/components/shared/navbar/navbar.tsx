import { LogoIcon } from '~/assets/svg/LogoIcon'
import { useAuthState } from '~/components/contexts/UserContext'
import { Time } from './time'

const navAssetsSize = 60

function Navbar() {
  return (
    <nav className="flex items-center justify-between p-2 text-neutral">
      <div className="flex items-center gap-1">
        <LogoIcon size={navAssetsSize} />
        <h1 className="text-2xl font-bold tracking-wide sm:text-3xl">Vidloom</h1>
      </div>
      <div className="flex items-center gap-2 sm:gap-5">
        <Time />
        <Profile />
      </div>
    </nav>
  )
}

function Profile() {
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

export default Navbar
