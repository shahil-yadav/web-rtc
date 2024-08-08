import { Link } from 'react-router-dom'
import { Head } from '~/components/shared/Head'

function Page404() {
  return (
    <>
      <Head title="The page is not found" />
      <div className="hero min-h-screen bg-gray-800">
        <div className="hero-content text-center text-3xl font-bold">
          <div>
            <h1 className="text-white">The page is not found.</h1>
            <div className="mt-4">
              <Link to="/" className="link-primary">
                Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Page404
