import { useState, useEffect, useContext } from 'react';
import supabase from "../DB/database.js";
import AuthContext from "../context/AuthContext.js";

function useProfile() {
    const { session } = useContext(AuthContext);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let ignore = false;
        async function getProfile() {
            if (session){
                setLoading(true);
                const { user } = session;

                const { data, error } = await supabase
                    .from('profiles')
                    .select(`*, favourite: Favourite(*), reviews: reviews(*)`)
                    .eq('id', user.id)
                    .single();

                console.log(data)

                if (!ignore) {
                    if (error) {
                        console.warn(error);
                    } else if (data) {
                        setProfile(data);
                    }
                }
            }


            setLoading(false);
        }

        getProfile();

        return () => {
            ignore = true;
        };
    }, [session]);

    return {
        profile,
        loading,
    };
}

export default useProfile;
