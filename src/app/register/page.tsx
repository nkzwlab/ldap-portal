"use client";

import * as React from "react";
import { NextPage } from "next";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Schema, schema } from "./schema";
import {
  Box,
  Button,
  Container,
  Input,
  InputLabel,
  Stack,
} from "@mui/material";

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
    <Container maxWidth="lg">
      <Stack
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        spacing={2}
        sx={{ m: 2, p: 6, backgroundColor: "white" }}
      >
        <Controller
          name="loginName"
          control={control}
          render={() => (
            <Stack>
              <InputLabel htmlFor="loginName">Login name</InputLabel>
              <Input id="loginName"></Input>
            </Stack>
          )}
        />
        <Controller
          name="password"
          control={control}
          render={() => (
            <Stack>
              <InputLabel htmlFor="password">Password</InputLabel>
              <Input id="password" type="password"></Input>
            </Stack>
          )}
        />
        <Controller
          name="passwordConfirmation"
          control={control}
          render={() => (
            <Stack>
              <InputLabel htmlFor="passwordConfirmation">
                Password confirmation
              </InputLabel>
              <Input id="passwordConfirmation" type="password"></Input>
            </Stack>
          )}
        />
        <Box alignSelf="end">
          <Button
            fullWidth={false}
            type="submit"
            variant="contained"
            size="medium"
            sx={{ margin: 2 }}
          >
            Submit
          </Button>
        </Box>
      </Stack>
    </Container>
  );
};

export default Register;
