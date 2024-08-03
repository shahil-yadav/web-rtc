import { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter, Outlet, RouteObject, useRoutes } from 'react-router-dom';

const IndexScreen = lazy(() => import('~/components/screens/Index'));
const Page404Screen = lazy(() => import('~/components/screens/404'));
const WebRTC = lazy(() => import('~/components/screens/web-rtc'));

const Loading = () => <p className="p-4 w-full h-full text-center">Loading...</p>;

function Layout() {
  return (
    <div>
      <nav className="p-4 flex items-center justify-between">
        <h1 className="font-bold text-xl">@Developed By Shahil Yadav</h1>
      </nav>
      <Outlet />
    </div>
  );
}

export const Router = () => {
  return (
    <BrowserRouter>
      <InnerRouter />
    </BrowserRouter>
  );
};

const InnerRouter = () => {
  const routes: RouteObject[] = [
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          path: '/index',
          element: <IndexScreen />,
        },
        {
          index: true,
          element: <WebRTC />,
        },
        {
          path: '*',
          element: <Page404Screen />,
        },
      ],
    },
    {
      path: 'test',
      element: <Test />,
    },
  ];
  const element = useRoutes(routes);

  return (
    <div>
      <Suspense fallback={<Loading />}>{element}</Suspense>
    </div>
  );
};

function Test() {
  const [state, setState] = useState(0);

  useEffect(() => {
    console.log('🚀 ~ file: Router.tsx:67 ~ useEffect ~ useEffect:', useEffect);
    setState((state) => state + 1);
    setState((state) => state + 1);
    setState((state) => state + 1);
  }, []);

  return <p>{state}</p>;
}
