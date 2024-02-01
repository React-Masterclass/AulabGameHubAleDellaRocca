import React from 'react'
import {Field, Form, Formik} from "formik";
import * as Yup from "yup";
import supabase from "../../DB/database.js";
import {useNavigate} from "react-router-dom";

function Register() {
    const navigate = useNavigate();
    const messageRequired = "Required"

    const registerSchema = Yup.object().shape({
        email: Yup.string()
            .email('Invalid email')
            .required(messageRequired),
        name: Yup.string()
            .required(messageRequired),
        surname: Yup.string()
            .required(messageRequired),
        password: Yup.string()
            .required(messageRequired)
            .min(4, "La password deve contenere almeno 4 caratteri")
            .max(8, "La password deve contenere al massimo 8 caratteri"),
        repassword: Yup.string()
            .required()
            .oneOf([Yup.ref('password'),null], 'Le password non corrispondono')
    })

    const handleRegister = async (value) => {
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

    return (
        <>
            <Formik
                initialValues={{
                    email:'',
                    password:''
                }}
                validationSchema={registerSchema}
                onSubmit={(value) => handleRegister(value)}
            >
                {({ errors, touched }) => (
                    <Form>
                        <label htmlFor="name">
                            Name
                            <Field name="name" type="text" />
                            {errors.name && touched.name ? <div>{errors.name}</div> : null}
                        </label>
                        <label htmlFor="surname">
                            Surname
                            <Field name="surname" type="text" />
                            {errors.surname && touched.surname ? <div>{errors.name}</div> : null}
                        </label>
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
                        <label htmlFor="repassword">
                            Repeat password
                            <Field name="repassword" type="password" />
                            {errors.repassword && touched.repassword ? <div>{errors.repassword}</div> : null}
                        </label>
                        <button type="submit">Submit</button>
                    </Form>
                )}

            </Formik>
        </>
    )
}

export default Register
