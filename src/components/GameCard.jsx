import React, {useEffect, useState} from 'react'
import {useNavigate} from "react-router-dom";
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
            <Card  sx={{
                transition: 'transform 0.3s ease-in-out',
                ':hover': {
                    boxShadow: 20,
                    transform: 'scale(1.05)',  // Cambia la scala per ottenere l'effetto desiderato
                },
            }}>
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
                            Go to the game
                        </Button>
                    ):(
                        <Button variant="outlined" onClick={() => navigate(`/game/custom/${game.name}`)}>
                            Go to the game
                        </Button>
                    )}
                </CardActions>

            </Card>
        </div>
    )
}

export default GameCard
