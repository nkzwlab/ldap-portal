"use client";

import * as React from "react";
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
import { ApiLoginParams } from "../api/auth/route";
import { useRouter } from "next/navigation";
import { statusUnauthorized } from "@/lib/http/status";
import Alert from "@/lib/components/Alert";
import Link from "next/link";

const API_PATH_LOGIN = "/api/auth";

export default function Login() {
  const router = useRouter();

  const [errorOpen, setErrorOpen] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isSubmitted },
  } = useForm<Schema>({ resolver: zodResolver(schema) });

  const onSubmit: SubmitHandler<Schema> = async ({ loginName, password }) => {
    console.log("on submit");
    const params: ApiLoginParams = { loginName, password };

    let resp: AxiosResponse | undefined = undefined;
    try {
      resp = await axios.post(API_PATH_LOGIN, params);

      if (resp?.data.success) {
        router.push("/");
      }
    } catch (err) {
      console.log({ err });
      let message =
        (err as Error)?.message ?? "An error occured while authenticating";

      if (
        err instanceof AxiosError &&
        err.response?.status === statusUnauthorized
      ) {
        message = "Invalid login name or password";
      } else if (resp?.data?.error) {
        message = resp.data.error;
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
          Log in
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

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isSubmitting}
          >
            Submit
          </Button>
        </Stack>
        <Typography variant="body2" color="GrayText" align="center">
          Don&apos;t have account yet?{" "}
          <Link href="/register" style={{ textDecoration: "underline" }}>
            Create an account
          </Link>
        </Typography>
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
}
