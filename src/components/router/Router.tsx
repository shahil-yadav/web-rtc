import { lazy, Suspense } from 'react'
import { BrowserRouter, Outlet, RouteObject, useRoutes } from 'react-router-dom'

const Page404Screen = lazy(() => import('~/components/screens/404'))
const WebRtcScreen = lazy(() => import('~/components/screens/home'))

const Loading = () => (
  <div className="absolute grid h-screen place-items-center">
    <p>Loading...</p>
  </div>
)

function Layout() {
  return (
    <>
      <nav className="absolute left-0 top-0 flex items-center justify-between p-2">
        <h1 className="text-xl font-bold">@Developed By Shahil Yadav</h1>
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
