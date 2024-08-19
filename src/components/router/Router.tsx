import { lazy, Suspense } from 'react'
import { BrowserRouter, Outlet, RouteObject, useRoutes } from 'react-router-dom'

const Page404Screen = lazy(() => import('~/components/screens/404'))
// const WebRtcScreen = lazy(() => import('~/components/screens/home'))
const Profile = lazy(() => import('~/components/screens/profile'))
const Navbar = lazy(() => import('~/components/shared/navbar/navbar'))
const Reciever = lazy(() => import('~/components/screens/receiver'))
const Caller = lazy(() => import('~/components/screens/caller'))

function Loading() {
  return (
    <div className="absolute flex h-screen w-screen items-center justify-center">
      <span className="loading loading-spinner w-14" />
    </div>
  )
}

function Layout() {
  return (
    <main className="flex h-svh flex-col">
      <Navbar />
      <Outlet />
    </main>
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
          element: <Caller />,
        },
        {
          path: ':roomID',
          element: <Reciever />,
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
