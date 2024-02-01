import React, {useEffect, useState} from 'react'
import {useParams} from "react-router-dom";
import axios from "../../axios/axios";
import GameCard from "../../components/GameCard";

function GenrePage() {

    const { genre } = useParams();
    const [game, setGame] = useState();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState();


    useEffect(() => {
        setLoading(true)
        axios.get(`games?genres=${genre}&key=${import.meta.env.VITE_TOKEN}`)
            .then((response) => {
                console.log(response.data.results)
                setGame(response.data.results)
                setLoading(false)
            }).catch((error) => {
            console.log(error)
            setError(error)
            setLoading(false)
        })
    },[genre])

    return (
        <div style={{
            width: "80%"
        }}>
            <h1 style={{
                margin: '20px',
                padding: '0',
                fontSize: '2rem'
            }}>Genere: {genre && genre.toUpperCase()}</h1>

            <input type={"text"} placeholder={"Cerca il tuo gioco..."}></input>

            {loading && <button aria-busy="true" className="outline">Please wait…</button>}

            {error && <p style={{
                color: "red"
            }}>{error}</p>}

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '10px',
                gridAutoRows: 'minmax(100px, auto)'
            }}>
                {game && game.map((game) => (
                    <GameCard key={game.id} game={game}/>
                ))}
            </div>
        </div>
    )
}

export default GenrePage
