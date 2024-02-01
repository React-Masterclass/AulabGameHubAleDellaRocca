import React, {useEffect, useState} from 'react'
import axios from "../axios/axios";
import {Link} from "react-router-dom";

function Platform() {

    const [platforms, setPlatforms] = useState();

    useEffect(() => {
        axios.get(`platforms?key=${import.meta.env.VITE_TOKEN}`)
            .then((response) => {
                console.log(response.data.results)
                setPlatforms(response.data.results)
            }).catch((error) => {
            console.log(error)
        })
    },[])

    return (
        <aside>
            <p>Lista delle piattaforme</p>
            <nav>
                <ul>
                    {platforms && platforms.map((platform) => (
                        <li key={platform.id}><Link to={`/games/${platform.slug}`}>{platform.name}</Link></li>
                    ))}
                </ul>
            </nav>
        </aside>
    )
}

export default Platform
