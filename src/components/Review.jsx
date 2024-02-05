import React, {useEffect, useState} from 'react'
import formatMessageDate from "../util/formatMessageDate.js";
import supabase from "../DB/database.js";
import Container from "@mui/material/Container";
import {Card} from "@mui/material";
import Typography from "@mui/material/Typography";
import Rating from '@mui/material/Rating';
function Review({review}) {
    const [username, setUsername] = useState("")

    useEffect(() => {
        async function getUsername() {
            let { data: user, error } = await supabase
                .from('profiles')
                .select('username')
                .eq("id", review.fk_user)
            setUsername(user[0].username)
            if (error){
                console.log(error)
            }
        }
        getUsername()
    }, []);
    return (
        <Container disableGutters key={review.id} sx={{
            mt:5
        }}>
                <Card sx={{
                    padding: "10px"
                }}>
                    <Typography variant={"h4"} component={"h1"}>{review.title}</Typography>
                    <Rating defaultValue={review.value} readOnly></Rating>
                    <Typography variant={"body1"}>{review.content}</Typography>
                    <Container disableGutters sx={{mt:2}}>
                        <Typography variant={"subtitle2"}>
                            Published by: {username}
                        </Typography>
                        <Typography variant={"subtitle2"}>
                            {formatMessageDate(review.created_at)}
                        </Typography>
                    </Container>
                </Card>
        </Container>
    )
}

export default Review
