import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import {Link, useLocation} from "react-router-dom";
import {useState} from "react";
import {useAppContext} from "../context/AppContext.jsx";

export default function ButtonAppBar(props) {
    const { toggleSideBar } = useAppContext();
    const location = useLocation();
    const unviewable = location.pathname.includes("/login") || location.pathname.includes("/register")

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2, display: unviewable ? "none": ""}}
                        onClick={toggleSideBar}
                    >
                        <MenuIcon/>
                    </IconButton>
                    {props.children}
                </Toolbar>
            </AppBar>
        </Box>
    );
}
