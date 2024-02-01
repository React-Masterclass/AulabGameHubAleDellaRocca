import React, {useEffect, useState} from 'react'
import {useParams} from "react-router-dom";
import axios from "../../axios/axios";

function StorePage() {
    const { store_slug } = useParams();
    const [game, setGame] = useState();

    useEffect(() => {
        axios.get(`stores/${store_slug}?key=${import.meta.env.VITE_TOKEN}`)
            .then((response) => {
                console.log(response.data)
                setGame(response.data)
            }).catch((error) => {
            console.log(error)
        })
    },[])

    return (
        <>
            <div>
                {game && (
                    <article>
                        <h1>{game.name}</h1>
                        <img src={game.background_image} alt=""/>
                        <div dangerouslySetInnerHTML={{ __html: game.description }} />
                        <div className={'grid'}>
                            {game.developers.map((dev) => (
                                <div key={dev.id}>
                                    <img src={dev.image_background} alt=""/>
                                    <h4>{dev.name}</h4>
                                </div>
                            ))}
                        </div>
                    </article>
                )}

            </div>
        </>
    )
}

export default StorePage
