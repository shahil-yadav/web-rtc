import { useProfileImage } from '~/assets/pfps/useProfileImage'
import { LogoIcon } from '~/assets/svg/LogoIcon'
import { getCalenderDate } from '~/components/screens/home/utils/getCalenderDate'

function Navbar() {
  const navAssetsSize = 60
  const profileUrl = useProfileImage()
  const date = getCalenderDate()

  return (
    <nav className="flex items-center justify-between p-2 text-neutral">
      <div className="flex items-center gap-1">
        <LogoIcon size={navAssetsSize} />
        <h1 className="text-2xl font-bold sm:text-3xl">Vidloom</h1>
      </div>
      <div className="flex items-center gap-2 sm:gap-5">
        <time className="hidden sm:inline">{date}</time>
        {profileUrl && (
          <>
            <span className="hidden sm:inline">
              Welcome, <span className="font-semibold">{profileUrl.alt}</span>
            </span>
            <div className="avatar">
              <div
                style={{ width: navAssetsSize - 20 }}
                className="rounded-full ring ring-primary ring-offset-1 ring-offset-base-100"
              >
                <img src={profileUrl.src} alt={profileUrl.src} />
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar
