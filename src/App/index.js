import { StrictMode } from 'react';
import { createBrowserRouter, Link, RouterProvider } from 'react-router-dom';

import ErrorPage from 'Error';
import ChampionRoutes from 'Champion';
import DraftRoutes from 'Draft';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Home />,
        errorElement: <ErrorPage />,
    },
    ChampionRoutes,
    DraftRoutes,
])

export default function App() {
    return (
        <StrictMode>
            <RouterProvider router={router} />
        </StrictMode>
    )
}

function Home() {
    return (
        <div className='container mt-3'>
            <div className='btn-group'>
                <Link to='/champion' className='btn btn-primary'>
                    Champion Lookup
                </Link>
                <Link to='/draft' className='btn btn-primary'>
                    Draft Mode
                </Link>
            </div>
        </div>
    )
}