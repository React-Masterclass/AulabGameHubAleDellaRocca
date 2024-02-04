import {useContext, useEffect, useState} from 'react';
import GameCard from "../../components/GameCard";
import axios from "../../axios/axios";
import useDebounceSearch from "../../hooks/useDebounceSearch";
import Modal from "react-modal";
import supabase from "../../DB/database.js";
import NewGameModal from "../../components/NewGameModal.jsx";
import AppContext from "../../context/AuthContext.js";
import SearchBar from "../../components/SearchBar.jsx";
import {Container, createTheme, getContrastRatio, Grid, ThemeProvider} from "@mui/material";
import Typography from "@mui/material/Typography";
import {LoadingButton} from "@mui/lab";
import Button from "@mui/material/Button";
import Divider from '@mui/material/Divider';
import AddCircleIcon from '@mui/icons-material/AddCircle';

Modal.setAppElement('#root');
export default function Home() {

    const [game, setGames] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState(1);
    const [search, setSearch] = useState('');
    const { session } = useContext(AppContext);
    const [isOpen, setIsOpen] = useState(false);
    const [usersGame, setUsersGame] = useState([])
    const [updated, setUpdated] = useState(false)

    const debaouncehSearch = useDebounceSearch(search);

    useEffect(() => {
        setGames([]);
        setError('');
        setLoading(true);
        axios.get(`games?key=${import.meta.env.VITE_TOKEN}&page=${pagination}&page_size=20&search=${search}`)
            .then((response) => {
                console.log(response)
                setGames(response.data.results)
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

    useEffect(()=> {
        const getUserGame = async () => {
            let { data: game, error } = await supabase
                .from('game')
                .select('*')
            setUsersGame(game)
        }
        getUserGame();
        setUpdated(false);
    },[updated]);
    const onClose = () => {
        setIsOpen(false);
        setUpdated(true);
    }

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
            <Typography variant="h2" component="h1" style={{
                margin: '0',
                padding: '0',
            }}>
                New and trending
            </Typography>
            <Typography variant={"subtitle1"}>
                Based on player counts and release date
            </Typography>
            <Container style={{ marginTop: '20px'}}>
                <SearchBar
                    onChange={(value) => setSearch(value)}
                    input={search}
                />
            </Container>

            {session && (
                <Container style={{ marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Button variant="contained" endIcon={<AddCircleIcon />} onClick={()=>setIsOpen(true)}>
                        New Game
                    </Button>
                    <NewGameModal
                        isOpen={isOpen}
                        onClose={()=>onClose()}
                    />
                </Container>
            )}
            <Container style={{ marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ThemeProvider theme={themeBtn}>
                    {loading &&
                        <LoadingButton loading variant="outlined" size={"large"} sx={{bgcolor:'violet.main'}}>
                            Submit
                        </LoadingButton>
                    }
                </ThemeProvider>
            </Container>


            <Container fixed style={{ marginTop: '40px' }}>
                {error && <p style={{
                    color: "red"
                }}>{error}</p>}
                {usersGame.length !== 0 && (
                    <Typography variant={"h4"} sx={{mb:2}}>
                        Game created by users
                    </Typography>)}
                <Grid container spacing={3}>
                    {usersGame.length !== 0 && usersGame.map((game) => (
                        <Grid item xs={4} key={game.id}>
                            <GameCard game={game}/>
                        </Grid>
                    ))}
                </Grid>
                {session && (<Divider sx={{ my: 4 }} />)}
                <Grid container spacing={3}>
                    {game.length !== 0 && game.map((game) => (
                        <Grid item xs={4} key={game.id}>
                            <GameCard game={game}/>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Container>
    );
}



