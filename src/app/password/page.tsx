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
import axios from "axios";
import { useRouter } from "next/navigation";
import { ApiPasswordPutParams } from "../api/password/route";

const API_PATH_PASSWORD = "/api/password";

export default function Login() {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isSubmitSuccessful, isValid },
  } = useForm<Schema>({ resolver: zodResolver(schema) });
  console.log({ isSubmitSuccessful, isSubmitting, isValid });

  const onSubmit: SubmitHandler<Schema> = async ({ password, newPassword }) => {
    console.log("on submit");
    const params: ApiPasswordPutParams = { password, newPassword };
    const resp = await axios.put(API_PATH_PASSWORD, params);

    if (resp.data.success) {
      alert("Updated password successfully.");
    } else {
      alert("Failed to update password.");
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
            disabled={!isValid || isSubmitting}
          >
            Submit
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
}
