import React, {useState} from 'react'
import Modal from "react-modal";
import supabase from "../DB/database.js";
import {ButtonGroup, Container, TextField} from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Checkbox from '@mui/material/Checkbox';
import Button from "@mui/material/Button";
import FormLabel from '@mui/material/FormLabel';



function NewGameModal({isOpen, onClose}) {

    const [selectedPlatforms, setSelectedPlatforms] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [url, setUrl] = useState();

    const handleCheckboxChange = (event) => {
        const value = event.target.value;
        if (event.target.checked) {
            setSelectedPlatforms((prevSelected) => [...prevSelected, value]);
        } else {
            setSelectedPlatforms((prevSelected) =>
                prevSelected.filter((platform) => platform !== value)
            );
        }
    };
    function splitAndTrimWords(inputString) {
        // Verifica se l'input è una stringa
        if (typeof inputString !== 'string') {
            throw new Error('L\'input deve essere una stringa.');
        }

        // Divide la stringa in parole utilizzando la virgola come separatore
        const wordsArray = inputString.split(',');

        // Rimuove gli spazi bianchi da ciascuna parola e crea un nuovo array
        return wordsArray.map((word) => word.trim());
    }

    async function handleNewGame(event) {
        event.preventDefault();
        const formData = new FormData(event.target)
        const genres = splitAndTrimWords(formData.get("genre"))
        const { data, error } = await supabase
            .from('game')
            .insert([
                { name: formData.get("name"),
                    image_url: url ,
                    platform: selectedPlatforms,
                    genres:genres},
            ])
            .select()
        if (error){
            console.log(error)
        }
        handleClose();
    }

    async function uploadImage(event) {
        try {
            setUploading(true);

            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.');
            }

            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const {data, error: uploadError } = await supabase.storage
                .from('game')
                .upload(filePath, file);
            if (uploadError) {
                throw uploadError;
            }
            setUrl(data.path);
        } catch (error) {
            alert(error.message);
        } finally {
            setUploading(false);
        }
    }


    function handleClose() {
        setSelectedPlatforms([])
        onClose();
    }
    const customStyles = {
        borderRadius: "5px",
        overlay: {
            background: "rgba(0,0,0,0.56)"
        },
        content: {
            width: '60%',
            height: "80%",
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
        },
    };
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={() => handleClose()}
            contentLabel="New Game"
            style={customStyles}
        >
            <Container sx={{
                display:"flex",
                alignItems:"center",
                flexDirection:"column"
            }}>
                <Typography variant={"h2"} component={"h1"} sx={{color: "black"}}>
                    New Game
                </Typography>
                <Box component="form"
                     onSubmit={(event) => handleNewGame(event)}
                     noValidate
                     sx={{
                         mt: 1,
                         color:"black",
                         alignItems:"center",
                         flexDirection:"column",
                         display:"flex",
                         width:"100%"
                     }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="name"
                        label="Name"
                        name="name"
                        autoFocus
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        type={"file"}
                        id="name"
                        name="img"
                        onChange={uploadImage}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="genre"
                        label="Genres (write each genre separate by comma)"
                        name="genre"
                    />
                    <FormLabel component="legend">Platform</FormLabel>
                    <label>
                        <Checkbox
                            type="checkbox"
                            name="platform"
                            value="PC"
                            onChange={handleCheckboxChange}
                        />{' '}
                        PC
                    </label>
                    <br />
                    <div>
                        <label>
                            <Checkbox
                                type="checkbox"
                                name="platform"
                                value="PlayStation 5"
                                onChange={handleCheckboxChange}
                            />{' '}
                            PlayStation 5
                        </label>
                        <label>
                            <Checkbox
                                type="checkbox"
                                name="platform"
                                value="PlayStation 4"
                                onChange={handleCheckboxChange}
                            />{' '}
                            PlayStation 4
                        </label>
                    </div>
                    <br />
                    <div>
                        <label>
                            <Checkbox
                                type="checkbox"
                                name="platform"
                                value="Xbox 360"
                                onChange={handleCheckboxChange}
                            />{' '}
                            Xbox 360
                        </label>
                        <label>
                            <Checkbox
                                type="checkbox"
                                name="platform"
                                value="Xbox One"
                                onChange={handleCheckboxChange}
                            />{' '}
                            Xbox One
                        </label>
                    </div>

                    <br />
                    <ButtonGroup variant="contained">
                        <Button type={"submit"} color={"success"}> Create </Button>
                        <Button onClick={() => handleClose()} color={"error"}>Back</Button>
                    </ButtonGroup>

                </Box>
            </Container>


        </Modal>
    )
}

export default NewGameModal
