import React, {useEffect, useState} from 'react'
import supabase from "../DB/database.js";

function UseAuth() {

    const [session, setSession] = useState(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    return{
        session
    }
}

export default UseAuth
