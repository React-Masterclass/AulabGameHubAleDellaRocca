import React from 'react'
import {Field, Form, Formik, useFormik} from "formik";
import * as yup from "yup";
import supabase from "../../DB/database.js";
import {Link, useNavigate} from "react-router-dom";
import {Avatar, Container, TextField} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined.js";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

function Register() {
    const navigate = useNavigate();
    const messageRequired = "Required"

    const registerSchema = yup.object().shape({
        email: yup.string()
            .email('Invalid email')
            .required(messageRequired),
        name: yup.string()
            .required(messageRequired),
        surname: yup.string()
            .required(messageRequired),
        password: yup.string()
            .required(messageRequired)
            .min(4, "La password deve contenere almeno 6 caratteri"),
        repassword: yup.string()
            .required()
            .oneOf([yup.ref('password'),null], 'Le password non corrispondono')
    })

    const formik = useFormik({
        initialValues:{
            email:'',
            password:''
        },
        validationSchema: registerSchema,
        onSubmit: async (value) => {
            try {
                const { data, error } = await supabase.auth.signUp({
                    email: value.email,
                    password: value.password,
                    options: {
                        data: {
                            first_name: value.name,
                            last_name: value.surname,
                            email: value.email
                        }
                    }
                })
                if (!error){
                    console.log(data)
                    navigate('/login');
                }else {
                    console.log(error)
                    alert("Errore: " + error.message)
                }
            }catch (error){
                console.log(error)
                alert("Errore: " + error.message)
            }
        }
    })


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
                    Sign up
                </Typography>
                <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="name"
                        label="Name"
                        name="name"
                        autoComplete="name"
                        autoFocus
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.password && Boolean(formik.errors.name)}
                        helperText={formik.touched.password && formik.errors.name}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="surname"
                        label="Surname"
                        name="surname"
                        autoComplete="surname"
                        autoFocus
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.password && Boolean(formik.errors.surname)}
                        helperText={formik.touched.password && formik.errors.surname}
                    />
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
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="repassword"
                        label="Repeat password"
                        type="repassword"
                        id="repassword"
                        type="password"
                        autoComplete="current-password"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.password && Boolean(formik.errors.repassword)}
                        helperText={formik.touched.password && formik.errors.repassword}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign Up
                    </Button>
                </Box>
                <Link href="#" variant="body2" to={"/login"} style={{ color: 'black', textDecoration:'underline', paddingBottom:2}}>
                    {"Already have an account? Sign in"}
                </Link>
            </Box>
        </Container>
    )
}

export default Register
