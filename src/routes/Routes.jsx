import {createBrowserRouter, Navigate} from "react-router-dom";
import Home from "../pages/common/Home.jsx";
import Login from "../pages/common/Login.jsx";
import Register from "../pages/common/Register.jsx";
import PrivateRoute from "../components/PrivateRoute.jsx";
import Profile from "../pages/logged/Profile.jsx";
import GenrePage from "../pages/common/GenrePage.jsx";
import GamePage, {getSingleGame} from "../pages/common/GamePage.jsx";
import Layout from "../pages/common/Layout.jsx";
import GamePageCustom, {getSingleGameCustom} from "../pages/common/GamePageCustom.jsx";


const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout/>,
        children: [
            {
                path: '/',
                element: <Navigate to="/home" />,
            },
            {
                path: '/home',
                element: <Home />,
            },
            {
                path: '/login',
                element: <Login />,
            },
            {
                path: '/register',
                element: <Register />,
            },
            {
                path: '/user/*',
                element: <PrivateRoute />,
                children: [
                    {
                        path: 'profile',
                        element: <Profile />,
                    },
                ],
            },
            {
                path: '/games/:genre',
                element: <GenrePage />,
            },
            {
                path: '/game/:game_slug',
                element: <GamePage />,
                loader: getSingleGame,
            },
            {
                path: '/game/custom/:game_slug',
                element: <GamePageCustom />,
                loader: getSingleGameCustom,
            },
        ],
    },
]);

export default router;
