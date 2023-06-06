import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRegister, selectIsAuth } from '../../redux/slices/auth';
import {useForm} from "react-hook-form"
import { Navigate } from 'react-router-dom';

import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';

import styles from './Register.module.scss';

export const Registration = () => {

  const isAuth = useSelector(selectIsAuth)
  console.log("isAuth:", isAuth)
  const dispatch = useDispatch()
  const {register, handleSubmit, setError, formState: { errors, isValid}} = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      password: ""
    },
    mode: "onChange"
  })

  const onSubmit = async (values) => {
    
      const data = await dispatch(fetchRegister(values));
      
      if (data.payload.error) {
        if (Array.isArray(data.payload.error)) {
          const { path, msg } = data.payload.error[0];
          setError(path, {
            type: "manual",
            message: msg,
          });
          return;
        } alert(data.payload.error.message)
        
        return;
      }

      if (!data.payload) {
        return alert("Failed to register!")
      }

      if ("token" in data.payload) {
        localStorage.setItem("token", data.payload.token)
      }
       
  }

  if(isAuth && localStorage.getItem("token")) {
    return <Navigate to="/"/>
  }

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Create an account
      </Typography>
      <div className={styles.avatar}>
        <Avatar sx={{ width: 100, height: 100 }} />
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        className={styles.field}
        error={Boolean(errors.fullName?.message)}
        helperText={errors.fullName?.message}
        label="Full name"
        fullWidth
        {...register("fullName", {required: "Enter full name"})}
      />
      <TextField
        className={styles.field}
        error={Boolean(errors.email?.message)}
        helperText={errors.email?.message}
        type="email"
        label="E-Mail"
        fullWidth
        {...register("email", {required: "Enter email"})}
      />
      <TextField
        className={styles.field}
        error={Boolean(errors.password?.message)}
        helperText={errors.password?.message}
        type="password"
        label="Password"
        fullWidth
        {...register("password", {required: "Enter password"})}
      />
      <Button disabled={!isValid} type="submit" size="large" variant="contained" fullWidth>
        Register
      </Button>
      </form>
      
    </Paper>
  );
};
