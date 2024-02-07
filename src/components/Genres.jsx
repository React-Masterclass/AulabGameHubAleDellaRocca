import React, {useEffect, useState} from 'react'
import axios from "../axios/axios";
import {useNavigate} from "react-router-dom";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";

function Genres({onClose}) {
    const [genres, setGenres] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`genres?key=${import.meta.env.VITE_TOKEN}`)
            .then((response) => {
                setGenres(response.data.results)
            }).catch((error) => {
            console.log(error)
        })
    },[])

    function hanleClick(slug) {
        setGenres(false);
        navigate("/games/" + slug);
    }

    return (
        <Box
            role="presentation"
            onClick={() => onClose(false)}
            onKeyDown={() => onClose(false)}
        >
            <List>
                {genres && genres.map((genre) => (
                    <ListItem key={genre.name} disablePadding>
                        <ListItemButton onClick={() => hanleClick(genre.slug)}>
                            <ListItemText primary={genre.name} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    )
}

export default Genres
