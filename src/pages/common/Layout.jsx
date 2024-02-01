import React, {useContext} from 'react'
import AppNavBar from "../../components/AppNavBar";
import AppLayout from "../../layout/AppLayout";
import AppFooter from "../../components/AppFooter";
import {Outlet, useLocation} from "react-router-dom";
import AppContext from "../../context/AuthContext.js";


function Layout(props) {

    const location = useLocation().pathname;
    const {session} = useContext(AppContext);


    if (location === '/login' || location === '/register'){
        return (
            <AppNavBar >
                <Outlet></Outlet>
            </AppNavBar>
        )
    }
    if (session && session.user.role === "authenticated"){
        return (
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <div style={{ flex: '1' }}>
                    <AppNavBar logged={true}/>
                    <AppLayout sideView={props.sideView}>
                        <Outlet/>
                    </AppLayout>
                </div>
                <AppFooter/>
            </div>
        )
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <div style={{ flex: '1' }}>
                <AppNavBar/>
                <AppLayout>
                    <Outlet/>
                </AppLayout>
            </div>
            <AppFooter/>
        </div>
    )
}

export default Layout
