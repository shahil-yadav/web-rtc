import { Head } from '~/components/shared/Head'
import Image404 from '~/assets/404.jpg'
import { Link } from 'react-router-dom'

function Page404() {
  return (
    <>
      <Head title="The page is not found" />
      <div
        style={{
          backgroundColor: 'rgb(251,219,188)',
        }}
      >
        <div className="relative">
          <img src={Image404} alt="404" className="h-screen w-screen object-contain" />
        </div>
      </div>
    </>
  )
}

export default Page404
