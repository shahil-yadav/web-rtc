import { LogoIcon } from '~/assets/svg/LogoIcon'
import { Profile } from './profile'
import { Time } from './time'

export const navAssetsSize = 60

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

export default Navbar
