import { Outlet } from 'react-router-dom';

import ErrorPage from 'Error';

import ChampionHomepage, { championHomepageLoader } from './homepage';
import ChampionDetail, { championDetailLoader } from './championDetail';

const ChampionRoutes = {
    path: '/champion/*',
    element: <Outlet />,
    errorElement: <ErrorPage />,
    children: [
        {
            index: true,
            element: <ChampionHomepage />,
            loader: championHomepageLoader
        },
        {
            path: ':championId',
            element: <ChampionDetail />,
            loader: championDetailLoader,
        },
    ]
};
export default ChampionRoutes;