import {Navigate, Outlet, useLocation} from "react-router-dom";
import {useContext} from "react";
import AppContext from "../context/AuthContext.js";

const PrivateRoute = () => {

    const { session } = useContext(AppContext);
    const location = useLocation();

    console.log(session);

    if (!session) {
        return <Navigate to="/home" replace state={{ path: location.pathname }} />;
    }
    return <Outlet />;
};

export default PrivateRoute;
