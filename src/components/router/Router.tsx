import { lazy, Suspense } from 'react'
import { BrowserRouter, Outlet, RouteObject, useRoutes } from 'react-router-dom'
import Profile from '../screens/profile'
import Navbar from '../shared/Navbar'

const Page404Screen = lazy(() => import('~/components/screens/404'))
const WebRtcScreen = lazy(() => import('~/components/screens/home'))

const Loading = () => (
  <div className="absolute flex h-screen w-screen items-center justify-center">
    <span className="loading loading-spinner w-20" />
  </div>
)

function Layout() {
  return (
    <>
      <Navbar />
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
          path: '404',
          element: <Page404Screen />,
        },
      ],
    },
  ]
  const element = useRoutes(routes)

  return <Suspense fallback={<Loading />}>{element}</Suspense>
}
