import * as React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { BrowserRouter as Router } from 'react-router-dom';
import io from "socket.io-client";
import { API_URL } from "../config";

import { Button, Spinner, ProductViewDialog } from '../components/Elements';
import { Notifications } from '../components/Notifications/Notifications';
import { AuthProvider } from '../lib/auth';
import { queryClient } from '../lib/react-query';
import { useSocketStore } from '../stores/socket';
import { Checkout } from '../features/misc';
import { useNotificationStore } from "../stores/notifications";

interface AppProviderProps {
    children: React.ReactNode
}

const ErrorFallback = () => {
    return (
        <div
            className="text-red-500 w-screen h-screen flex flex-col justify-center items-center"
            role="alert"
        >
            <h2 className="text-lg font-semibold">Ooops, something went wrong :( </h2>
            <Button className="mt-4" onClick={() => window.location.assign(window.location.origin)}>
                Refresh
            </Button>
        </div>
    )
}

const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
    const { setSocket } = useSocketStore();
    const { addNotification } = useNotificationStore();
    React.useEffect(() => {
        let socket = io(API_URL);
        setSocket(socket);
        socket.on("notification", () => {
            addNotification({
                type: "success",
                title: "New message"
            })
        })
    }, [])
    return (
        <React.Suspense fallback={
            <div className="flex items-center justify-center w-screen h-screen">
                <Spinner size="xl" />
            </div>
        }>
            <ErrorBoundary FallbackComponent={ErrorFallback}>
                <HelmetProvider>
                    <QueryClientProvider client={queryClient}>
                        {process.env.NODE_ENV !== 'test' && <ReactQueryDevtools />}
                        <Notifications />
                        <AuthProvider>
                            <Router>{children}<Checkout /></Router>
                        </AuthProvider>
                        <ProductViewDialog />
                    </QueryClientProvider>
                </HelmetProvider>
            </ErrorBoundary>
        </React.Suspense>
    )
}

export default AppProvider;