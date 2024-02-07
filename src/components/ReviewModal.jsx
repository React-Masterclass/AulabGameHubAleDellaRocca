import React, {useContext} from 'react';
import Modal from 'react-modal';
import supabase from "../DB/database.js";
import AppContext from "../context/AuthContext.js";
import Typography from "@mui/material/Typography";
import {ButtonGroup, Container, TextField} from "@mui/material";
import { TextareaAutosize as BaseTextareaAutosize } from '@mui/base/TextareaAutosize';
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {styled} from "@mui/material/styles";
import {blue, grey} from "@mui/material/colors";
import {Rating} from "@mui/lab";

Modal.setAppElement('#root');

const ReviewModal = ({ isOpen, onClose, gameId, gameName}) => {
    const { session } = useContext(AppContext);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target)
        const { data, error } = await supabase
            .from('reviews')
            .insert([
                {
                    fk_user: session.user.id,
                    title: formData.get("title"),
                    content: formData.get("content"),
                    value: formData.get("value"),
                    game_id: gameId,
                    game_name: gameName
                },
            ])
            .select()
        if (error){
            console.log(error);
        }
        // Chiudi la modale
        onClose();
    };
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

    const TextareaAutosize = styled(BaseTextareaAutosize)(
        ({ theme }) => `
  box-sizing: border-box;
  width: 320px;
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  padding: 8px 12px;
  border-radius: 8px;
  color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
  box-shadow: 0px 2px 2px ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};

  &:hover {
    border-color: ${blue[400]};
  }

  &:focus {
    border-color: ${blue[400]};
    box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? blue[600] : blue[200]};
  }

  // firefox
  &:focus-visible {
    outline: 0;
  }
`,
    );
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Write a review"
            style={customStyles}

        >
            <Container sx={{
                display:"flex",
                alignItems:"center",
                flexDirection:"column"
            }}>
                <Typography variant={"h2"} component={"h1"} sx={{color: "black"}}>
                    Write a review
                </Typography>
                <Box component="form"
                     onSubmit={(event) => handleSubmit(event)}
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
                        id="title"
                        label="Title"
                        name="title"
                        autoFocus
                        sx={{mb:2}}
                    />
                    <Rating
                        name="value"
                        sx={{mb:2}}
                    />
                    <TextareaAutosize
                        rows="10"
                        cols="50"
                        margin="normal"
                        required
                        fullWidth
                        placeholder="Write here..."
                        id="content"
                        name="content"
                        aria-label="empty textarea"
                        sx={{mb:2}}
                    />
                    <ButtonGroup variant="contained">
                        <Button type={"submit"} color={"success"}> Send </Button>
                        <Button onClick={onClose} color={"error"}>Back</Button>
                    </ButtonGroup>
                </Box>
            </Container>
        </Modal>
    );
};

export default ReviewModal;
