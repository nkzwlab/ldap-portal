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
import axios, { AxiosError, AxiosResponse } from "axios";
import { type ApiRegisterParams } from "../api/register/route";
import { useRouter } from "next/navigation";
import Alert from "@/lib/components/Alert";

const API_PATH_REGISTER = "/api/register";

const Register: NextPage = () => {
  const router = useRouter();

  const [successOpen, setSuccessOpen] = React.useState(false);
  const successMessage =
    "Registration form has been sent successfully. Redirecting to login page in 6s.";
  const [errorOpen, setErrorOpen] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isSubmitted },
  } = useForm<Schema>({ resolver: zodResolver(schema) });

  const onSubmit: SubmitHandler<Schema> = async ({ loginName, password }) => {
    console.log("on submit");
    const params: ApiRegisterParams = { loginName, password };
    let resp: AxiosResponse | undefined;

    try {
      resp = await axios.post(API_PATH_REGISTER, params);
      if (resp?.data.success) {
        setSuccessOpen(true);
      } else {
        throw new Error(
          `Failed to submit registration form: ${
            resp?.data?.error ?? "unknown error"
          }`
        );
      }
    } catch (err) {
      console.log({ err });
      let message =
        (err as Error)?.message ?? "An error occured while submitting the form";

      if (err instanceof AxiosError && err.response?.data.error) {
        message = err.response.data.error;
      }

      setErrorMessage(message);
      setErrorOpen(true);
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
            disabled={isSubmitting}
          >
            Submit
          </Button>
        </Stack>
        <Alert
          open={successOpen}
          handleClose={() => setSuccessOpen(false)}
          severity="success"
        >
          {successMessage}
        </Alert>
        <Alert
          open={errorOpen}
          handleClose={() => setErrorOpen(false)}
          severity="error"
        >
          {errorMessage}
        </Alert>
      </Stack>
    </Container>
  );
};

export default Register;
