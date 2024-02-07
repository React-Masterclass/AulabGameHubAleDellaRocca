import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import {Link, useLocation, useNavigate} from "react-router-dom";
import {useState} from "react";
import {useAppContext} from "../context/AppContext.jsx";
import {AccountCircle} from "@mui/icons-material";

export default function ButtonAppBar(props) {
    const { toggleSideBar } = useAppContext();
    const location = useLocation();
    const unviewable = location.pathname.includes("/login") || location.pathname.includes("/register")
    const navigate = useNavigate();
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
                        <MenuIcon />
                    </IconButton>
                    <Button color="inherit" onClick={() => navigate("/home")}>Home</Button>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    </Typography>
                    {props.children}
                </Toolbar>
            </AppBar>
        </Box>
    );
}
