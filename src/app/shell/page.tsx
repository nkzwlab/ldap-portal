"use client";

import React, { useEffect, useState } from "react";
import assert from "assert";
import axios, { Axios, AxiosError } from "axios";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Snackbar from "@mui/material/Snackbar";
import SnackbarContent from "@mui/material/SnackbarContent";
import CircularProgress from "@mui/material/CircularProgress";

import styles from "./page.module.css";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useShell, useUpdateShell } from "@/lib/hooks/shell";
import { Container, CssBaseline, Stack } from "@mui/material";
import { Schema, schema } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";

export default function Shell() {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isSubmitted },
  } = useForm<Schema>({ resolver: zodResolver(schema) });

  const currentShell = useShell();
  const { updateShell, result } = useUpdateShell();

  const onSubmit: SubmitHandler<Schema> = async ({ shell }) => {
    await updateShell(shell);
  };

  TODO: select shell

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Stack alignItems="center" spacing={2} sx={{ marginTop: 8 }}>
        <Typography variant="h5" component="h1">
          Change login shell
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
}
