import React, {useContext, useEffect, useState} from 'react'
import AppContext from "../../context/AuthContext.js";
import supabase from "../../DB/database.js";
import useProfile from "../../hooks/useProfile.js";
import getProfileImg from '../../util/getProfileImg';
import {Link} from "react-router-dom";
import Avatar from "../../components/Avatar.jsx";
function Profile() {

    const {session} = useContext(AppContext);
    const [modify, setModify] = useState(false);
    const { profile, loading } = useProfile();


    useEffect(() => {
        createIfNotExists();
    }, []);
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
            console.log(data)
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
        <div>
            <div>
                <div>
                    <Avatar
                        url={profile && profile.avatar_url}
                        alt="profile"
                        size={200}
                        onUpload={(event, url) => {
                            handleUpdateAvatar(event, url);
                        }}
                    />
                </div>
                TAB Settings
                <form onSubmit={(event) => handleUpdateProfile(event)}>
                    <label htmlFor="first_name">
                        First name
                        <input type="text"
                               name="first_name"
                               defaultValue={profile && profile.first_name}
                               onChange={() => setModify(true)}/>
                    </label>
                    <label htmlFor="last_name">
                        Last name
                        <input type="text"
                               name="last_name"
                               defaultValue={profile && profile.last_name}
                               onChange={() => setModify(true)}/>
                    </label>
                    <label htmlFor="email">
                        Email
                        <input type="text"
                               name="email"
                               defaultValue={session.user.email}
                               disabled={true}/>
                    </label>
                    <label htmlFor="username">
                        Username
                        <input type="text"
                               name="username"
                               defaultValue={profile && profile.username}
                               onChange={() => setModify(true)}/>
                    </label>
                    <button type={"submit"} disabled={!modify}> Update </button>
                </form>
            </div>
            <div>
                TAB Account
                <details>
                    <summary role="button">Your favorites</summary>
                    {profile && profile.favourite.map((fav) => (
                        <li key={fav.id}>{fav.nome_gioco}</li>
                    ))}
                </details>
                <details>
                    <summary role="button">Your reviews</summary>
                    {profile && profile.reviews.map( (rev) => (
                        <li key={rev.id}><Link to={"/game/" + rev.game_name}>{rev.game_name}</Link></li>
                    ))}
                </details>
            </div>
        </div>

    )
}

export default Profile
