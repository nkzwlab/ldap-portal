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
  Stack,
  Typography,
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
        spacing={4}
        sx={{ m: 2, p: 6, backgroundColor: "white" }}
      >
        <Typography variant="h3" component={"h1"}>
          Registration
        </Typography>
        <Controller
          name="loginName"
          control={control}
          render={() => <Input id="loginName" placeholder="Login name"></Input>}
        />
        <Controller
          name="password"
          control={control}
          render={() => (
            <Input id="password" type="password" placeholder="Password"></Input>
          )}
        />
        <Controller
          name="passwordConfirmation"
          control={control}
          render={() => (
            <Input
              id="passwordConfirmation"
              type="password"
              placeholder="Password confirmation"
            ></Input>
          )}
        />
        <Box alignSelf="end">
          <Button
            fullWidth={false}
            type="submit"
            variant="contained"
            size="medium"
          >
            Submit
          </Button>
        </Box>
      </Stack>
    </Container>
  );
};

export default Register;
