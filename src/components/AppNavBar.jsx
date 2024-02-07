import React from 'react'
import { useNavigate} from "react-router-dom";
import supabase from "../DB/database.js";
import ButtonAppBar from "./AppBar.jsx";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import {AccountCircle} from "@mui/icons-material";
import LogoutIcon from '@mui/icons-material/Logout';

function AppNavBar(props) {

    const navigate = useNavigate();
    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        sessionStorage.clear();
        localStorage.clear();
        if (error){
            alert("Errore: " + error.message)
            console.log(error)
        }else {
            navigate("/home");
        }
    }

    if (props.logged){
        return (
            <>
                <ButtonAppBar>
                    <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        color="inherit"
                        onClick={() => navigate("/user/profile")}
                    >
                        <AccountCircle />
                    </IconButton>
                    <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        color="inherit"
                        onClick={() => handleLogout()}
                    >
                        <LogoutIcon />
                    </IconButton>
                </ButtonAppBar>
                {props.children}
            </>

        )
    }

    return (
        <>
            <ButtonAppBar>
                <Button color="inherit" onClick={() => navigate("/login")}>Login</Button>
                <Button color="inherit" onClick={() => navigate("/register")}>Register</Button>
            </ButtonAppBar>
            {props.children}
        </>

    )
}

export default AppNavBar
