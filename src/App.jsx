import './App.css'
import {BrowserRouter, createBrowserRouter, Navigate, Route, RouterProvider, Routes} from "react-router-dom";
import Layout from "./pages/common/Layout";
import Login from "./pages/common/Login";
import Register from "./pages/common/Register";
import Home from "./pages/common/Home";
import GenrePage from "./pages/common/GenrePage";
import GamePage, {getSingleGame} from "./pages/common/GamePage";
import useAuth from "./hooks/useAuth.js";
import AccessDenied from "./components/AccessDenied.jsx";
import NotFound from "./components/NotFound.jsx";
import Profile from "./pages/logged/Profile.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import AuthContext from "./context/AuthContext.js";
import axios from "./axios/axios.js";
import {useState} from "react";
import router from "./routes/Routes.jsx";
import {AppProvider} from "./context/AppContext.jsx";


function App() {
    const dataAuth = useAuth();

  // return (
  //     <AuthContext.Provider value={dataAuth}>
  //         <BrowserRouter>
  //             <Layout>
  //                 <Routes>
  //                     <Route path="/" element={<Navigate to={'/login'} replace />} />
  //                     {/*<Route path="/" element={<Navigate to={elementToRedirect} replace />} />*/}
  //                     <Route exact path="/login" element={<Login/>}/>
  //                     <Route exact path="/register" element={<Register/>}/>
  //
  //                     {/*Rotte di errore*/}
  //                     <Route exact path="/access-denied" element={<AccessDenied/>}/>
  //                     <Route path="*" element={<NotFound/>}/>
  //
  //                     {/*Rotte libere*/}
  //                     <Route exact path="/home" element={<Home/>}/>
  //                     <Route exact path="/games/:genre" element={<GenrePage/>}/>
  //                     <Route exact path="/game/:game_slug" element={<GamePage/>} loader={getSingleGame}/>
  //
  //
  //                     {/*User Routes.jsx*/}
  //
  //                     <Route exact path='/user/profile' element={<PrivateRoute userOnly />}>
  //                         <Route exact path='/user/profile' element={<Profile />}/>
  //                     </Route>
  //
  //                 </Routes>
  //             </Layout>
  //         </BrowserRouter>
  //     </AuthContext.Provider>
  // )
    return(
        <AppProvider>
            <AuthContext.Provider value={dataAuth}>
                <RouterProvider router={router} />
            </AuthContext.Provider>
        </AppProvider>
    )
}

export default App;
