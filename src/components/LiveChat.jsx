import * as React from 'react';
import {useState, useEffect, useRef } from 'react';
import supabase from "../DB/database.js";
import formatMessageDate from "../util/formatMessageDate.js";
import ListItem from "@mui/material/ListItem";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import {Container} from "@mui/material";

function LiveChat({ game }) {
    const [chat, setChat] = useState([]);
    const chatRef = useRef(null);

    const getMessages = async () => {
        const { data, error } = await supabase
            .from('messages')
            .select('*, profile: profiles(username)')
            .eq('game_id', game.id);
        if (error) {
            alert(error.message);
        } else {
            setChat(data);
        }
    };

    useEffect(() => {
        getMessages();
        const subscription = supabase
            .channel('messages')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                },
                () => getMessages()
            )
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [chat]);

    return (
        <Container sx={{maxHeight: '500px', overflowY: 'auto',scrollBehavior: "smooth"
        }} ref={chatRef}>
            <List >
                {chat &&
                    chat.map((message) => (
                        <React.Fragment key={message.id}>
                            <ListItem  alignItems="flex-start">
                                <ListItemText
                                    primary={message.content}
                                    secondary={
                                        <Typography
                                            sx={{ display: 'inline' }}
                                            component="span"
                                            variant="body2"
                                            color="text.primary"
                                        >
                                            {message.profile.username} <br/>
                                            {formatMessageDate(message.created_at)}
                                        </Typography>
                                    }
                                />
                            </ListItem>
                            <Divider component="li" />
                        </React.Fragment>

                    ))}
            </List>
        </Container>
    );
}

export default LiveChat;
