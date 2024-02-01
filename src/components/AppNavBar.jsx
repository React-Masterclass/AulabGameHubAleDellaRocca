import React from 'react'
import {Link, useNavigate} from "react-router-dom";
import supabase from "../DB/database.js";
import AppBar from "@mui/material/AppBar";
import ButtonAppBar from "./AppBar.jsx";
import Button from "@mui/material/Button";

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
                    <Button color="inherit" onClick={() => navigate("/home")}>Home</Button>
                    <Button color="inherit" onClick={() => navigate("/user/profile")}>Profile</Button>
                    <Button color="inherit" onClick={() => handleLogout()}>Logout</Button>
                </ButtonAppBar>
                {props.children}
            </>

        )
    }

    return (
        <>
            <ButtonAppBar>
                <Button color="inherit" onClick={() => navigate("/home")}>Home</Button>
                <Button color="inherit" onClick={() => navigate("/login")}>Login</Button>
                <Button color="inherit" onClick={() => navigate("/register")}>Register</Button>
            </ButtonAppBar>
            {props.children}
        </>

    )
}

export default AppNavBar
