import React, {useEffect, useState} from 'react'
import Genres from "./Genres.jsx";
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import {useAppContext} from "../context/AppContext.jsx";

function AppSideBar() {

    const { sideBarOpen, toggleSideBar } = useAppContext();


    return (
        <div>
            <Drawer open={sideBarOpen} onClose={toggleSideBar}>
            <Genres onClose={(val) => toggleSideBar(val)} />
            </Drawer>
        </div>
    );
}

export default AppSideBar
