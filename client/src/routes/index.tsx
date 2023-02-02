import { useRoutes } from 'react-router-dom';
import { Login, Chat } from '../chat';
import { Landing, ProductGrid, Payment, TermsCondition } from '../features/misc';
import { useAuth } from '../lib/auth';

import { protectedRoutes } from './protected';
import { publicRoutes } from './public';

export const AppRoutes = () => {
  const auth = useAuth();

  const commonRoutes = [
    { path: '/', element: <Landing /> },
    { path: '/checkout', element: <Payment /> },
    { path: '/discussion', element: <Login /> },
    { path: '/chat', element: <Chat /> },
    { path: '/products', element: <ProductGrid/> },
    { path: '/terms-condition', element: <TermsCondition/> },
  ];

  const routes = auth.user ? protectedRoutes : publicRoutes;

  const element = useRoutes([...routes, ...commonRoutes]);

  return <>{element}</>;
};
