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
import { ApiLoginParams } from "../api/auth/route";
import { useRouter } from "next/router";

const API_PATH_LOGIN = "/api/auth";

export default function Login() {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isSubmitted },
  } = useForm<Schema>({ resolver: zodResolver(schema) });

  const onSubmit: SubmitHandler<Schema> = async ({ loginName, password }) => {
    console.log("on submit");
    const params: ApiLoginParams = { loginName, password };
    const resp = await axios.post(API_PATH_LOGIN, params);

    if (resp.data.success) {
      router.push("/");
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
                placeholder="Login name"
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
                placeholder="Password"
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
            disabled={isSubmitting || isSubmitted}
          >
            Submit
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
}
