import React, {useEffect, useState} from 'react'
import {Link, useNavigate} from "react-router-dom";
import supabase from "../DB/database.js";
import {Card, CardActions, CardContent, CardMedia} from "@mui/material";
import Button from "@mui/material/Button";


function GameCard({game}) {
    const [url, setUrl] = useState(game.image_url);
    const navigate = useNavigate()

    async function downloadImage(path) {
        try {
            const { data, error } = await supabase.storage
                .from('game')
                .download(path);
            if (error) {
                throw error;
            }
            const url = URL.createObjectURL(data);
            setUrl(url);
        } catch (error) {
            console.log('Error downloading image: ', error.message);
        }
    }
    useEffect(() => {
        if (game.image_url) downloadImage(game.image_url);
    }, [game.image_url]);

    return (
        <div>
            <Card>
                    <CardMedia
                        component="img"
                        height="194"
                        image={game.background_image || url}
                        alt="img"
                        style={{padding: 0}}
                    />
                <CardContent>
                    <h4>{game.name}</h4>
                    <p style={{
                        marginTop:'10px'
                    }}>Genres: {game.genres && game.genres.map((g) => g.name || g).join(', ')}</p>
                </CardContent>
                <CardActions sx={{justifyContent: "center"}}>
                    {game.slug ? (
                        <Button variant="outlined" onClick={() => navigate(`/game/${game.slug}`)}>
                            Vai al gioco
                        </Button>
                    ):(
                        <Button variant="outlined" onClick={() => navigate(`/game/custom/${game.name}`)}>
                            Vai al gioco
                        </Button>
                    )}
                </CardActions>

            </Card>
        </div>
    )
}

export default GameCard
