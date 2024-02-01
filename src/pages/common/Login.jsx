import React from 'react'
import {Field, Form, Formik} from "formik";
import * as Yup from 'yup';
import supabase from "../../DB/database.js";
import {useLocation, useNavigate} from "react-router-dom";
import GoogleIcon from '@mui/icons-material/Google';

function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    let redirectTo="/user/profile";
    if (location.state){
        redirectTo = "/game/" + location.state.game;
    }

    const loginSchema = Yup.object().shape({
        email: Yup.string().email('Invalid email').required('Required')
    })

    const handleLogin = async (value) => {
        try {
            const {data, error} = await supabase.auth.signInWithPassword({
                email: value.email,
                password: value.password
            })
            if (!error){
                console.log(data)
                navigate(redirectTo);
            }else {
                console.log(error)
                alert("Errore: " + error.message)
            }

        }catch (error){
            console.log(error);
        }
    }

    const handleDiscordLogin = async () => {
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'discord',
                options:{
                    redirectTo:"http://localhost:5173/user/profile"
                }
            });
            console.log(data + error)
        } catch (error) {
            console.log(error);
        }
    };

return (
    <div>
        <div>
            <Formik
                initialValues={{
                    email:'',
                    password:''
                }}
                validationSchema={loginSchema}
                onSubmit={(value) => handleLogin(value)}
            >
                {({ errors, touched }) => (
                    <Form>
                        <label htmlFor="email">
                            Email
                            <Field name="email" type="email" />
                            {errors.email && touched.email ? <div>{errors.email}</div> : null}
                        </label>
                        <label htmlFor="password">
                            Password
                            <Field name="password" type="password" />
                            {errors.password && touched.password ? <div>{errors.password}</div> : null}
                        </label>
                        <button type="submit">Submit</button>
                    </Form>
                )}

            </Formik>
        </div>
        <div>
            <button onClick={() =>  handleDiscordLogin()}>
                Entra con Discord <GoogleIcon/>
            </button>
        </div>
    </div>
)
}

export default Login
