import React, {useContext, useEffect, useState} from 'react'
import {useLoaderData, useNavigate} from "react-router-dom";
import axios from "../../axios/axios";
import AuthContext from "../../context/AuthContext.js";
import supabase from "../../DB/database.js";
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import StarIcon from '@mui/icons-material/Star';
import LiveChat from "../../components/LiveChat.jsx";
import useProfile from "../../hooks/useProfile.js";
import SendIcon from '@mui/icons-material/Send';
import Reviews from "../../components/Reviews.jsx";
import ReviewModal from "../../components/ReviewModal.jsx";
import {Card, Container, Grid, TextField} from "@mui/material";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import {padding} from "@mui/system";
export async function getSingleGame({ params }) {
    try {
        const response = await axios.get(`games/${params.game_slug}?key=${import.meta.env.VITE_TOKEN}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
function GamePage() {
    let game = useLoaderData();
    const {session} = useContext(AuthContext);
    const [fav, setFav] = useState([]);
    const [updated, setUpdated] = useState(false)
    const {profile} = useProfile();
    const [isReviewModalOpen, setReviewModalOpen] = useState(false);
    const navigate = useNavigate();
    const [review, setReview] = useState()

    useEffect( () => {
        const getReview = async () => {
            let { data: reviews, error } = await supabase
                .from('reviews')
                .select('*')
                .eq("game_id", game.id)
            setReview(reviews)
            if (error){
                console.log(error)
            }
        }
        getReview();
        setUpdated(false)
    }, [updated]);

    useEffect(() => {
        if (session){
            getFavGame();
            setUpdated(false);
        }
    }, [updated]);
    const getFavGame = async () => {
        const { data, error } = await supabase
            .from('Favourite')
            .select('*')
            .eq('id_gioco', game.id)
            .eq('fk_user', session.user.id);
        if (error) {
            alert(error.message);
        } else {
            setFav(() => [...data]);
        }
    };

    async function addFavorite() {
        const { data, error } = await supabase
            .from('Favourite')
            .insert([
                {
                    id_gioco: game.id ,
                    nome_gioco: game.name ,
                    fk_user: session.user.id
                }
            ])
            .select()
        setUpdated(true)
    }

    async function removeFavorite() {
        const { error } = await supabase
            .from('Favourite')
            .delete()
            .eq('id_gioco', game.id)
            .eq("fk_user", session.user.id)
        setUpdated(true)

    }

    async function handleMessageSubmit(event) {
        event.preventDefault();
        const inputForm = event.currentTarget;
        const { message } = Object.fromEntries(new FormData(inputForm));
        if (typeof message === 'string' && message.trim().length !== 0) {
            const { data, error } = await supabase
                .from('messages')
                .insert([
                    {
                        profile_id: session.user.id,
                        game_id: game.id,
                        content: message,
                    },
                ])
                .select();
            if (error) {
                alert(error.message);
            } else {
                inputForm.reset();
                console.log(data);
            }
        }
    };

    const openReviewModal = () => {
        if (profile){
            setReviewModalOpen(true);
        }else {
            navigate("/login", {
                state:{
                    game:game.slug
                }
            });
        }
    };

    const closeReviewModal = () => {
        setReviewModalOpen(false);
        setUpdated(true)
    };

    return (
        <Container sx={{ width: '100%' }}>
            <Grid container spacing={5} sx={{mt:2}}>
                <Grid item xs={8}>
                    <Container>
                        {game && (
                            <Card sx={{
                                padding:"10px"
                            }}>
                                <h1>{game.name}</h1>
                                <img src={game.background_image} alt="" width={300}/>
                                <Container sx={{padding: 5}}>
                                    Disponibile per:
                                    <p>{game.platforms.map((p) => p.platform.name).join(', ')}</p>
                                </Container>
                                <Container sx={{cursor:"pointer" }}>
                                    {profile ? (
                                        fav.length !== 0 ? (
                                            <>Rimuovi dai preferiti <br/> <StarIcon onClick={() => (removeFavorite())}></StarIcon></>
                                        ):(
                                            <>Aggiungi ai preferiti <br/> <StarBorderOutlinedIcon onClick={() => (addFavorite())}></StarBorderOutlinedIcon></>
                                        )
                                    ):("")}
                                </Container>
                            </Card>
                        )}
                    </Container>
                    <Container >
                        <Reviews
                            review={review}
                            game={game}
                        />
                        <Container disableGutters sx={{display:"flex", mt:4}}>
                            <Button onClick={openReviewModal} variant={"contained"}>New review</Button>
                        </Container>
                        <ReviewModal
                            isOpen={isReviewModalOpen}
                            onClose={closeReviewModal}
                            gameId={game.id}
                            gameName={game.slug}
                        />
                    </Container>
                </Grid>
                <Grid item xs={4}>
                    {profile && (
                        <Container sx={{
                            border:"2px solid black",
                            borderRadius: "7px",
                            backgroundColor:"rgba(4,179,194,0.44)",
                            height: "500px",
                            display:"flex",
                            flexDirection:"column",
                            justifyContent:"flex-end"
                        }}>
                            <LiveChat game={game} />
                            <Container disableGutters>
                                <Box component="form" onSubmit={handleMessageSubmit} noValidate sx={{ display:"flex", mb:2}}>
                                    <TextField
                                        type="text"
                                        name="message"
                                        placeholder="Type your message..."
                                        fullWidth
                                        size={"small"}
                                        // sx={{padding:"7px"}}
                                    />
                                    <Button type="submit" variant={"contained"}>
                                        Send
                                        <SendIcon
                                            style={{
                                                marginLeft: '5px',
                                            }}
                                        />
                                    </Button>
                                </Box>
                            </Container>
                        </Container>
                    )}
                </Grid>
            </Grid>
        </Container>

    )
}



export default GamePage
