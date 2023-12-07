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
import { ApiPasswordPutParams } from "../api/password/route";
import { useRouter } from "next/navigation";
import { statusUnauthorized } from "@/lib/http/status";
import Alert from "@/lib/components/Alert";

const API_PATH_PASSWORD = "/api/password";

export default function Login() {
  const [successOpen, setSuccessOpen] = React.useState(false);
  const successMessage = "Updated password successfully.";
  const [errorOpen, setErrorOpen] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isSubmitSuccessful, isValid },
  } = useForm<Schema>({ resolver: zodResolver(schema) });
  console.log({ isSubmitSuccessful, isSubmitting, isValid });

  const onSubmit: SubmitHandler<Schema> = async ({ password, newPassword }) => {
    console.log("on submit");
    const params: ApiPasswordPutParams = { password, newPassword };
    let resp: AxiosResponse | undefined;

    try {
      resp = await axios.put(API_PATH_PASSWORD, params);
      if (resp?.data.success) {
        setSuccessOpen(true);
      } else {
        throw new Error(
          `Updating password failed: ${resp?.data?.error ?? "unknown error"}`
        );
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
          Update Password
        </Typography>

        <Stack
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          spacing={2}
          alignItems="center"
          width="100%"
        >
          <Controller
            name="password"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                id="password"
                type="password"
                label="Current Password"
                required
                fullWidth
                autoComplete="password"
                autoFocus
                error={fieldState.invalid}
                helperText={fieldState.error?.message}
              ></TextField>
            )}
          />

          <Controller
            name="newPassword"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                id="newPassword"
                type="password"
                label="New Password"
                required
                fullWidth
                autoComplete="new-password"
                error={fieldState.invalid}
                helperText={fieldState.error?.message}
              ></TextField>
            )}
          />

          <Controller
            name="newPasswordConfirmation"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                id="newPasswordConfirmation"
                type="password"
                label="Confirm new password"
                required
                fullWidth
                autoComplete="new-password"
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
}
