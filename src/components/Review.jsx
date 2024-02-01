import React, {useEffect, useState} from 'react'
import formatMessageDate from "../util/formatMessageDate.js";
import supabase from "../DB/database.js";

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
        <div key={review.id}>
            <div className={"style.comment_container"}>
                <article>
                    <p>{review.title}</p>
                    <p>{review.content}</p>
                    <div className={"style.comment_details"}>
                        <p className={"style.detail"}>
                            Published by: {username}
                        </p>
                        <p className={"style.detail"}>
                            {formatMessageDate(review.created_at)}
                        </p>
                        <p></p>
                    </div>
                </article>
            </div>
        </div>
    )
}

export default Review
