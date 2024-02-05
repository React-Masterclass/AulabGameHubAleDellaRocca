import React, {useEffect, useState} from 'react'
import {useParams} from "react-router-dom";
import axios from "../../axios/axios";
import GameCard from "../../components/GameCard";
import SearchBar from "../../components/SearchBar.jsx";
import {Container, createTheme, getContrastRatio, Grid, LinearProgress, ThemeProvider} from "@mui/material";
import useDebounceSearch from "../../hooks/useDebounceSearch.js";
import Typography from "@mui/material/Typography";
import {LoadingButton} from "@mui/lab";
import Box from "@mui/material/Box";

function GenrePage() {

    const { genre } = useParams();
    const [game, setGame] = useState();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState();
    const [search, setSearch] = useState('');
    const debaouncehSearch = useDebounceSearch(search);
    const [pagination, setPagination] = useState(1);


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
    useEffect(() => {
        setGame([]);
        setError('');
        setLoading(true);
        axios.get(`games?key=${import.meta.env.VITE_TOKEN}&page=${pagination}&page_size=20&search=${search}`)
            .then((response) => {
                console.log(response)
                setGame(response.data.results)
                setLoading(false)
            })
            .catch((error) => {
                console.log(error)
                if (error.response) {
                    // Errore nella risposta del server (non 2xx)
                    console.error('Errore nella risposta del server:', error.response.data);
                } else if (error.request) {
                    // La richiesta è stata fatta ma non è stata ricevuta una risposta
                    console.error('Nessuna risposta ricevuta dalla richiesta.');
                } else {
                    // Errore durante la configurazione della richiesta
                    console.error('Errore durante la configurazione della richiesta:', error.message);
                }
                setError(error.message);
            })
    }, [debaouncehSearch]);

    const violetBase = '#7F00FF';
    const themeBtn = createTheme({
        palette: {
            violet: {
                main: violetBase,
                contrastText: getContrastRatio(violetBase, '#fff') > 4.5 ? '#fff' : '#111',
            },
        },
    });
    return (
        <Container fixed style={{ marginTop: '20px', alignContent: "center" }}>
            <h1 style={{
                margin: '20px',
                padding: '0',
                fontSize: '2rem'
            }}></h1>
            <Typography variant="h2" component="h1" style={{
                margin: '0',
                padding: '0',
            }}>
                Genre: {genre && genre.toUpperCase()}
            </Typography>
            <Container style={{ marginTop: '20px'}}>
                <SearchBar
                    onChange={(value) => setSearch(value)}
                    input={search}
                />
            </Container>
            <Container style={{ marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {loading &&
                    <Box sx={{ width: '100%' }}>
                        <LinearProgress />
                    </Box>
                }
            </Container>
            {error && <p style={{
                color: "red"
            }}>{error}</p>}

            <Grid container spacing={3}>
                {game && game.map((game) => (
                    <Grid item xs={4} key={game.id}>
                        <GameCard game={game}/>
                    </Grid>
                ))}
            </Grid>
        </Container>
    )
}

export default GenrePage
