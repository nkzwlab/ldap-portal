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

const Register: NextPage = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Schema>({ resolver: zodResolver(schema) });

  const onSubmit: SubmitHandler<Schema> = ({ loginName, password }) => {
    return null;
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
            render={() => (
              <TextField
                id="loginName"
                placeholder="Login name"
                required
                fullWidth
                autoComplete="loginName"
                autoFocus
              ></TextField>
            )}
          />

          {/* Text field for password. Controlled by React-Hook-Form */}
          <Controller
            name="password"
            control={control}
            render={() => (
              <TextField
                id="password"
                type="password"
                placeholder="Password"
                required
                fullWidth
                autoComplete="password"
              ></TextField>
            )}
          />

          {/* Text field for password confirmation. Controlled by React-Hook-Form */}
          <Controller
            name="passwordConfirmation"
            control={control}
            render={() => (
              <TextField
                id="passwordConfirmation"
                type="password"
                placeholder="Password confirmation"
                required
                fullWidth
              ></TextField>
            )}
          />

          <Button type="submit" variant="contained" fullWidth>
            Submit
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
};

export default Register;
