import { Navbar } from '../Landing';
import * as React from 'react';

interface LandingLayoutProps {
    children: React.ReactNode
}

export const LandingLayout: React.FC<LandingLayoutProps> = ({ children }) => {
    return (
        <>
            <Navbar />
            {children}
        </>
    )
}
