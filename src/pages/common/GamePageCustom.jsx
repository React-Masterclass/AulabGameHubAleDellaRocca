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
export async function getSingleGameCustom({ params }) {
    let { data: game, error } = await supabase
        .from('game')
        .select('*')
        .eq("name", params.game_slug)
    return game[0];
}
function GamePageCustom() {
    let game = useLoaderData();
    const {session} = useContext(AuthContext);
    const [fav, setFav] = useState([]);
    const [updated, setUpdated] = useState(false)
    const {profile} = useProfile();
    const [isReviewModalOpen, setReviewModalOpen] = useState(false);
    const navigate = useNavigate();
    const [review, setReview] = useState()
    const [url, setUrl] = useState()
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
        <div>
            <div>
                {game && (
                    <article>
                        <h1>{game.name}</h1>
                        <img src={url} alt="" width={300}/>
                        <div>
                            Disponibile per:
                            <p>{game.platform.map((p) => p).join(', ')}</p>
                        </div>
                        <div>
                            {profile ? (
                                fav.length !== 0 ? (
                                        <StarIcon onClick={() => (removeFavorite())}></StarIcon>
                                    ):(
                                        <StarBorderOutlinedIcon onClick={() => (addFavorite())}></StarBorderOutlinedIcon>
                                    )
                            ):(<div></div>)}

                        </div>
                    </article>
                    )}
            </div>
            <div>
                {profile && (
                    <div className={""}>
                        <LiveChat game={game} />
                        <div className={""}>
                            <form
                                className={""}
                                onSubmit={handleMessageSubmit}
                            >
                                <input
                                    className={""}
                                    type="text"
                                    name="message"
                                    placeholder="type your message..."
                                />
                                <button
                                    type="submit"
                                    className={""}
                                >
                                    Send
                                    <SendIcon
                                        style={{
                                            marginLeft: '5px',
                                        }}
                                    />
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
            <div>
                <Reviews
                    review={review}
                    game={game}
                />
                <button onClick={openReviewModal}>New review</button>
                <ReviewModal
                    isOpen={isReviewModalOpen}
                    onClose={closeReviewModal}
                    gameId={game.id}
                    gameName={game.slug}
                />
            </div>
        </div>

    )
}



export default GamePageCustom
