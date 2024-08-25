import { Link } from 'react-router-dom'
import { CopyIcon } from '~/assets/svg/SearchIcon'
import { ShareIcon } from '~/assets/svg/ShareIcon'

export function Hero() {
  return (
    <div className="prose rounded-xl border p-5">
      <div className="flex items-center justify-between">
        <h3 className="m-0">You&apos;re the only one here</h3>
        <Link className="no-underline" to="/">
          ❌
        </Link>
      </div>
      <p>Share this meeting link with others that you want in the meeting</p>
      <div className="space-y-5">
        <label className="input input-bordered flex items-center gap-2 rounded-full">
          <input type="text" className="grow" placeholder="Link to join" />
          <CopyIcon />
        </label>
        <button className="btn rounded-full">
          <ShareIcon />
          Share invite
        </button>
      </div>
    </div>
  )
}
