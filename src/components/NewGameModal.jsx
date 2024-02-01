import React, {useState} from 'react'
import Modal from "react-modal";
import supabase from "../DB/database.js";

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

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={() => handleClose()}
            contentLabel="New Game"
        >
            <h2>New Game</h2>
            <form onSubmit={(event) => handleNewGame(event)}>
                <label htmlFor="name">
                    Name
                    <input type="text" name={"name"} required={true}/>
                </label>
                <label htmlFor="img">
                    Image
                    <input type="file" name={"img"} required={true} onChange={uploadImage}/>
                </label>
                <label htmlFor="genre">
                    Genres (write each genre separate by comma)
                    <input type="text" name={"genre"} required={true} />
                </label>
                Platform
                <label>
                    <input
                        type="checkbox"
                        name="platform"
                        value="PC"
                        onChange={handleCheckboxChange}
                    />{' '}
                    PC
                </label>
                <br />
                <label>
                    <input
                        type="checkbox"
                        name="platform"
                        value="PlayStation 5"
                        onChange={handleCheckboxChange}
                    />{' '}
                    PlayStation 5
                </label>
                <br />
                <label>
                    <input
                        type="checkbox"
                        name="platform"
                        value="PlayStation 4"
                        onChange={handleCheckboxChange}
                    />{' '}
                    PlayStation 4
                </label>
                <br />
                <label>
                    <input
                        type="checkbox"
                        name="platform"
                        value="Xbox 360"
                        onChange={handleCheckboxChange}
                    />{' '}
                    Xbox 360
                </label>
                <br />
                <label>
                    <input
                        type="checkbox"
                        name="platform"
                        value="Xbox One"
                        onChange={handleCheckboxChange}
                    />{' '}
                    Xbox One
                </label>
                <br />
                <button type={"submit"}> Create </button>
            </form>
        </Modal>
    )
}

export default NewGameModal
