import React, {useEffect, useState} from 'react'
import axios from "../axios/axios";
import {Link} from "react-router-dom";

function Store() {
    const [stores, setStores] = useState();

    useEffect(() => {
        axios.get(`stores?key=${import.meta.env.VITE_TOKEN}`)
            .then((response) => {
                console.log(response.data.results)
                setStores(response.data.results)
            }).catch((error) => {
            console.log(error)
        })
    },[])

    return (
        <aside>
            <p>Lista degli Store</p>
            <nav>
                <ul>
                    {stores && stores.map((store) => (
                        <li key={store.id}><Link to={`/store/${store.slug}`}>{store.name}</Link></li>
                    ))}
                </ul>
            </nav>
        </aside>
    )
}

export default Store
