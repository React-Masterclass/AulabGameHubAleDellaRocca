import React from 'react'
import {Outlet} from "react-router-dom";
import AppSideBar from "../components/AppSideBar.jsx";

function AppLayout(props) {
    return (
        <div style={{
            display:"flex",
            marginTop: "3px",
            width:"100%"
        }}>
            <AppSideBar/>
            {props.children}
        </div>
    )
}

export default AppLayout
