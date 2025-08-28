import { Suspense, lazy, type JSX } from 'react';
import type { RouteObject } from 'react-router-dom';
import FullScreenLoader from '../components/FullScreenLoader';

const Loadable =
  (Component: React.ComponentType<any>) => (props: JSX.IntrinsicAttributes) =>
    (
      <Suspense fallback={<FullScreenLoader />}>
        <Component {...props} />
      </Suspense>
    );

const ListUserPage = Loadable(lazy(() => import('../pages/users/list.user.page')));
const CreateUserPage = Loadable(lazy(() => import('../pages/users/create.user.page')));
const EditUserPage = Loadable(lazy(() => import('../pages/users/edit.user.page')));

const normalRoutes: RouteObject = {
  path: '*',
  children: [
    {
      path: 'users',
      children: [
        {
          path: '',
          element: <ListUserPage />,
        },
      ],
    },
    {
      path: 'user',
      children: [
        {
          path: '',
          element: <CreateUserPage />,
        },
        {
          path: ':id',
          element: <EditUserPage />,
        },
      ],
    },
  ],
};

const routes: RouteObject[] = [normalRoutes];

export default routes;
