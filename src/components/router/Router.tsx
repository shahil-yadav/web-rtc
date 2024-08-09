import { lazy, Suspense } from 'react'
import { BrowserRouter, Link, Outlet, RouteObject, useRoutes } from 'react-router-dom'
import Profile from '../screens/profile'
import { useProfileImage } from '~/assets/pfps/useProfileImage'

const Page404Screen = lazy(() => import('~/components/screens/404'))
const WebRtcScreen = lazy(() => import('~/components/screens/home'))

const Loading = () => (
  <div className="absolute flex h-screen w-screen items-center justify-center">
    <span className="loading loading-spinner w-20" />
  </div>
)

function Layout() {
  const img = useProfileImage()
  return (
    <>
      <nav className="absolute left-0 top-0 flex w-full items-center justify-between p-2">
        <span className="text-xl font-bold">@Developed By Shahil Yadav</span>
        <Link className="link-hover link z-10 rounded-lg bg-red-400 p-2 font-bold text-slate-100" to="/">
          Vidloom
        </Link>

        {img && <img src={img.src} alt={img.alt} className="aspect-square w-24" />}
      </nav>
      <Outlet />
    </>
  )
}

export const Router = () => {
  return (
    <BrowserRouter>
      <InnerRouter />
    </BrowserRouter>
  )
}

const InnerRouter = () => {
  const routes: RouteObject[] = [
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          index: true,
          element: <WebRtcScreen />,
        },
        {
          path: ':joinID',
          element: <WebRtcScreen />,
        },
        {
          path: 'profile',
          element: <Profile />,
        },
        {
          path: '*',
          element: <Page404Screen />,
        },
      ],
    },
  ]
  const element = useRoutes(routes)

  return <Suspense fallback={<Loading />}>{element}</Suspense>
}
