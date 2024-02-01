import React, {useContext, useState} from 'react';
import Modal from 'react-modal';
import supabase from "../DB/database.js";
import AppContext from "../context/AuthContext.js";

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

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Scrivi una recensione"
        >
            <h2>Write a review</h2>
            <form onSubmit={(event)=> handleSubmit(event)}>
                <label htmlFor="title">
                    Title
                    <input
                        type={"text"}
                        name={"title"}
                    />
                </label>
                <label htmlFor="value">
                    Points
                    <input
                        name={"value"}
                        type={"number"}
                        min={0}
                        max={5}
                    />
                </label>
                <textarea
                    rows="4"
                    cols="50"
                    placeholder="Write here..."
                    name={"content"}
                />
                <button type={"submit"}>Send</button>
                <button onClick={onClose}>Back</button>
            </form>


        </Modal>
    );
};

export default ReviewModal;
