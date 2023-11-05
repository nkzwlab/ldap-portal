"use client";

import * as React from "react";
import { NextPage } from "next";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Schema, schema } from "./schema";
import {
  Avatar,
  Button,
  Container,
  CssBaseline,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { LockOutlined } from "@mui/icons-material";
import axios from "axios";
import { type ApiRegisterParams } from "../api/register/route";

const API_PATH_REGISTER = "/api/register";

const Register: NextPage = () => {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isSubmitted },
  } = useForm<Schema>({ resolver: zodResolver(schema) });

  const onSubmit: SubmitHandler<Schema> = async ({ loginName, password }) => {
    console.log("on submit");
    const params: ApiRegisterParams = { loginName, password };
    const resp = await axios.post(API_PATH_REGISTER, params);

    if (resp.data.success) {
      alert("Registration form has been sent successfully.");
    } else {
      alert("Failed to send registration form.");
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Stack alignItems="center" spacing={2} sx={{ marginTop: 8 }}>
        <Avatar sx={{ backgroundColor: "secondary.main" }}>
          <LockOutlined />
        </Avatar>

        <Typography variant="h5" component="h1">
          Registration
        </Typography>

        <Stack
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          spacing={2}
          alignItems="center"
          width="100%"
        >
          {/* Text field for login name. Conrtolled by React-Hook-Form */}
          <Controller
            name="loginName"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                id="loginName"
                label="Login name"
                required
                fullWidth
                autoComplete="loginName"
                autoFocus
                error={fieldState.invalid}
                helperText={fieldState.error?.message}
              ></TextField>
            )}
          />

          {/* Text field for password. Controlled by React-Hook-Form */}
          <Controller
            name="password"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                id="password"
                type="password"
                label="Password"
                required
                fullWidth
                autoComplete="password"
                error={fieldState.invalid}
                helperText={fieldState.error?.message}
              ></TextField>
            )}
          />

          {/* Text field for password confirmation. Controlled by React-Hook-Form */}
          <Controller
            name="passwordConfirmation"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                id="passwordConfirmation"
                type="password"
                label="Password confirmation"
                required
                fullWidth
                error={fieldState.invalid}
                helperText={fieldState.error?.message}
              ></TextField>
            )}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isSubmitting || isSubmitted}
          >
            Submit
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
};

export default Register;
