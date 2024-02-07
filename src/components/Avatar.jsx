import { useEffect, useState } from 'react';
import supabase from "../DB/database.js";
import Button from "@mui/material/Button";
import {ButtonGroup, Container} from "@mui/material";

export default function Avatar({ url, size, onUpload }) {
    const [avatarUrl, setAvatarUrl] = useState(null);
    const [uploading, setUploading] = useState(false);
    // funzione che carica l'immagine nello storage...
    async function downloadImage(path) {
        try {
            const { data, error } = await supabase.storage
                .from('avatars')
                .download(path);
            if (error) {
                throw error;
            }
            const url = URL.createObjectURL(data);
            setAvatarUrl(url);
        } catch (error) {
            console.log('Error downloading image: ', error.message);
        }
    }

    // se url cambia invoca la funzione downloadImage...
    useEffect(() => {
        if (url && !url.includes("discord")) downloadImage(url);
    }, [url]);
    // funzione che controlla il path dell'immagine da inserire...
    async function uploadAvatar(event) {
        try {
            setUploading(true);

            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.');
            }

            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            onUpload(event, filePath);
        } catch (error) {
            alert(error.message);
        } finally {
            setUploading(false);
        }
    }

    console.log(url)
    console.log(avatarUrl)

    return (
        <div>
            {avatarUrl ? (
                <img
                    src={avatarUrl || url}
                    alt="Avatar"
                    className="avatar image"
                    style={{
                        height: size,
                        width: size,
                        boxShadow: '1px 1px 10px #030405',
                    }}
                />
            ) : (
                <img
                    src={"https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/no-profile-picture-icon.png"}
                    alt="Avatar"
                    className="avatar image"
                    style={{
                        height: size,
                        width: size,
                        boxShadow: '1px 1px 10px #030405',
                    }}
                />
            )}
            <Container disableGutters sx={{ml: 0, width: size, mt:"5px", display:"flex", justifyContent:"center"}}>
                <ButtonGroup>
                    <Button variant={"contained"} component={"label"}>
                        Upload img
                        <input
                            type="file"
                            id="single"
                            accept="image/*"
                            hidden
                            onChange={uploadAvatar}
                            disabled={uploading}
                        />
                    </Button>
                </ButtonGroup>
            </Container>
        </div>
    );
}
