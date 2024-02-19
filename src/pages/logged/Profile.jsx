import React, {useContext, useEffect, useState} from 'react'
import AppContext from "../../context/AuthContext.js";
import supabase from "../../DB/database.js";
import useProfile from "../../hooks/useProfile.js";
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import {Link} from "react-router-dom";
import Avatar from "../../components/Avatar.jsx";
import {Accordion, AccordionDetails, AccordionSummary, Container, Grid, TextField} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from "@mui/material/Button";

function Profile() {

    const {session} = useContext(AppContext);
    const [modify, setModify] = useState(false);
    const { profile, loading } = useProfile();
    const [value, setValue] = React.useState('1');
    const [avatarUrl, setAvatarUrl] = useState("")

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };


    useEffect(() => {
        createIfNotExists();

    }, []);

    useEffect(() => {
        setAvatarUrl(profile && profile.avatar_url)
    }, [loading]);
    async function handleUpdateProfile(event) {
        event.preventDefault();
        const formData = new FormData(event.target)
        const { data, error } = await supabase
            .from('profiles')
            .update({
                first_name: formData.get("first_name"),
                last_name: formData.get("last_name"),
                username: formData.get("username")
            })
            .eq('id', session.user.id)
            .select()
        if (error){
            console.log(error)
        }else {
            alert("Profile updated")
        }
        setModify(false);
    }

    async function handleUpdateAvatar(event,url){
        event.preventDefault();
        const { data, error } = await supabase
            .from('profiles')
            .update({
                avatar_url: url
            })
            .eq('id', session.user.id)
            .select()
        if (error){
            console.log(error)
        }else {
            console.log(data)
            alert("Profile updated")
            setAvatarUrl(url)
        }
    }

    async function createIfNotExists(){
        const userEmail = session.user.email;
        let { data: user, error } = await supabase
            .from('profiles')
            .select('*')
            .eq("email", userEmail)
    }

    console.log(profile)
    return (
            <Grid container spacing={3}>
                <Grid item xs={2}>
                    <Avatar
                        url={avatarUrl}
                        alt="profile"
                        size={200}
                        onUpload={(event, url) => {
                            handleUpdateAvatar(event, url);
                        }}
                    />
                </Grid>
                <Grid item xs={10}>
                    <TabContext value={value}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <TabList onChange={handleChange}>
                                <Tab label="Settings" value="1" />
                                <Tab label="Account" value="2" />
                            </TabList>
                        </Box>
                        <TabPanel value="1">
                            <Container>
                                <Box component="form"
                                     onSubmit={(event) => handleUpdateProfile(event)}
                                     noValidate
                                     key={profile}
                                     sx={{
                                         mt: 1,
                                         color:"black",
                                         alignItems:"center",
                                         flexDirection:"column",
                                         display:"flex",
                                         width:"50%",
                                         backgroundColor:"#fff",
                                         padding:2,
                                         borderRadius:"10px"
                                     }}>
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="first_name"
                                        label="First name"
                                        name="first_name"
                                        onChange={() => setModify(true)}
                                        defaultValue={profile && profile.first_name}
                                    />
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="last_name"
                                        label="Last name"
                                        name="last_name"
                                        onChange={() => setModify(true)}
                                        defaultValue={profile && profile.last_name}
                                    />
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        type={"email"}
                                        id="email"
                                        label="Email"
                                        name="email"
                                        disabled
                                        defaultValue={session.user.email}
                                    />
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="username"
                                        label="Username"
                                        name="username"
                                        onChange={() => setModify(true)}
                                        defaultValue={profile && profile.username}
                                    />
                                    <Button variant={"contained"} type={"submit"} disabled={!modify}> Update </Button>
                                </Box>
                            </Container>

                        </TabPanel>
                        <TabPanel value="2">
                            <Container sx={{ml:0,width:"50%"}}>
                                <Accordion>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1-content"
                                        id="panel1-header"
                                    >
                                        Your favorites
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        {profile && profile.favourite.map((fav) => (
                                            <li key={fav.id}>{fav.nome_gioco}</li>
                                        ))}
                                    </AccordionDetails>
                                </Accordion>
                                <Accordion>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1-content"
                                        id="panel1-header"
                                    >
                                        Your reviews
                                    </AccordionSummary>
                                    <AccordionDetails >
                                        {profile && profile.reviews.map( (rev) => (
                                            // <li key={rev.id}><Link to={"/game/" + rev.game_name} style={{color:"black"}}>{rev.game_name}</Link></li>
                                            <li key={rev.id}>{rev.game_name}</li>
                                        ))}
                                    </AccordionDetails>
                                </Accordion>
                            </Container>
                        </TabPanel>
                    </TabContext>
                </Grid>
            </Grid>
    )
}

export default Profile
