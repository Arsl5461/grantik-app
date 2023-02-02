import { Suspense } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { Spinner } from '../components/Elements';
import { MainLayout } from '../components/Layout';
import { lazyImport } from '../utils/lazyImport';

const { Dashboard } = lazyImport(() => import('../features/misc'), 'Dashboard');
const { Profile } = lazyImport(() => import('../features/users'), 'Profile');
const { Users } = lazyImport(() => import('../features/users'), 'Users');
const { Builder } = lazyImport(() => import('../features/builder'), 'Builder');
const { OrdersRoutes } = lazyImport(() => import('../features/order'), 'OrdersRoutes');
const { ProductsRoutes } = lazyImport(() => import('../features/product'), 'ProductsRoutes');

const App = () => {
    return (
        <MainLayout>
            <Suspense
                fallback={
                    <div className="h-full w-full flex items-center justify-center">
                        <Spinner size="xl" />
                    </div>
                }
            >
                <Outlet />
            </Suspense>
        </MainLayout>
    );
};

export const protectedRoutes = [
    {
        path: "/app",
        element: <App />,
        children: [
            { path: '/app/builder/*', element: <Builder /> },
            { path: "/app/users", element: <Users /> },
            { path: "/app/products/*", element: <ProductsRoutes /> },
            { path: "/app/orders/*", element: <OrdersRoutes /> },
            { path: '/app/profile', element: <Profile /> },
            { path: '/app/', element: <Dashboard /> },
            { path: '*', element: <Navigate to="." /> },
        ],
    },
];
