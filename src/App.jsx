import './App.css'
import {RouterProvider} from "react-router-dom";
import useAuth from "./hooks/useAuth.js";
import AuthContext from "./context/AuthContext.js";
import router from "./routes/Routes.jsx";
import {AppProvider} from "./context/AppContext.jsx";


function App() {
    const dataAuth = useAuth();

    return(
        <AppProvider>
            <AuthContext.Provider value={dataAuth}>
                <RouterProvider router={router} />
            </AuthContext.Provider>
        </AppProvider>
    )
}

export default App;
