import React from 'react'
import supabase from "../../DB/database.js";
import {Link, useLocation, useNavigate} from "react-router-dom";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {Avatar,Container,Grid,TextField} from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDiscord} from "@fortawesome/free-brands-svg-icons";
import * as yup from "yup";
import {useFormik} from "formik";

function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    let redirectTo="/user/profile";
    if (location.state){
        redirectTo = "/game/" + location.state.game;
    }

    const loginSchema = yup.object().shape({
        email: yup
            .string('Enter your email')
            .email('Enter a valid email')
            .required('Email is required'),
        password: yup
            .string('Enter your password')
            .min(6, 'Password should be of minimum 6 characters length')
            .required('Password is required'),
    })

        const formik = useFormik({
            initialValues: {
                email: '',
                password: '',
            },
            validationSchema: loginSchema,
            onSubmit: async (value) => {
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
            },
        });

    console.log(location)
        const handleDiscordLogin = async () => {
            try {
                const { data, error } = await supabase.auth.signInWithOAuth({
                    provider: 'discord',
                    // options:{
                    //     redirectTo:"https://aulab-game-hub-ale-della-rocca.vercel.app/user/profile"
                    // }
                });
                console.log(data + error)
            } catch (error) {
                console.log(error);
            }
        };


        return (
            <Container component="main" maxWidth="xs" sx={{
                background:'white',
                color:'black',
                paddingBottom: 5,
                borderRadius: 4
            }}>
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: '#1975d1' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.password && Boolean(formik.errors.email)}
                            helperText={formik.touched.password && formik.errors.email}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.password && Boolean(formik.errors.password)}
                            helperText={formik.touched.password && formik.errors.password}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </Button>
                    </Box>
                    <Grid container  sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }} spacing={{md:3}}>
                        <Grid item>
                            <Link href="#" variant="body2" to={"/register"} style={{ color: 'black', textDecoration:'underline', paddingBottom:2}}>
                                {"Don't have an account? Sign Up"}
                            </Link>
                        </Grid>
                        <Grid item>
                            <Button variant="contained"
                                    fullWidth
                                    onClick={() =>  handleDiscordLogin()}
                            >
                                Entra con Discord <FontAwesomeIcon icon={faDiscord} style={{marginLeft:'5px'}}/>
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        )
}

export default Login
