import React from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import {useForm} from "react-hook-form"
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

import styles from "./Login.module.scss";
import { fetchAuth, selectIsAuth } from "../../redux/slices/auth";

export const Login = () => {

  const isAuth = useSelector(selectIsAuth)
  const dispatch = useDispatch()
  const {register, handleSubmit, setError, formState: { errors, isValid}} = useForm({
    defaultValues: {
      email: "",
      password: ""
    },
    mode: "onChange"
  })

  const onSubmit = async (values) => {
    const data = await dispatch(fetchAuth(values))
    if (!data.payload) {
      alert("Did not manage to login!")
    }
    if ("token" in data.payload) {
      localStorage.setItem("token", data.payload.token)
    } 
  }

  if(isAuth) {
    return <Navigate to="/"/>
  }

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Login
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        className={styles.field}
        label="E-Mail"
        type="email"
        error={Boolean(errors.email?.message)}
        helperText={errors.email?.message}
        {...register("email", {required: "Enter email"})}
        fullWidth
      />
      <TextField type="password" className={styles.field} error={Boolean(errors.password?.message)} label="Password" helperText={errors.password?.message} {...register("password", {required: "Enter password"})} fullWidth />
      <Button disabled={!isValid} type="submit" size="large" variant="contained" fullWidth>
        Login
      </Button>
      </form>
      
    </Paper>
  );
};
