import { lazy, Suspense } from 'react'
import { BrowserRouter, Link, Outlet, RouteObject, useRoutes } from 'react-router-dom'

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
      <nav className="absolute left-0 top-0 flex w-full items-center justify-between p-2">
        <span className="text-xl font-bold">@Developed By Shahil Yadav</span>
        <Link className="link-hover link z-10 rounded-lg bg-red-400 p-2 font-bold text-slate-100" to="/">
          Vidloom
        </Link>
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
          path: '*',
          element: <Page404Screen />,
        },
      ],
    },
  ]
  const element = useRoutes(routes)

  return <Suspense fallback={<Loading />}>{element}</Suspense>
}
