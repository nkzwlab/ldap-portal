"use client";

import * as React from "react";
import { NextPage } from "next";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Schema, schema } from "./schema";
import {
  Container,
  FormControl,
  Input,
  InputLabel,
  Stack,
} from "@mui/material";

const Register: NextPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Schema>({ resolver: zodResolver(schema) });

  const onSubmit: SubmitHandler<Schema> = ({ loginName, password }) => {
    return null;
  };

  return (
    <Container>
      <Stack component="form" onSubmit={handleSubmit(onSubmit)}>
        <InputLabel htmlFor="loginName">Login name</InputLabel>
        <Input id="loginName"></Input>
      </Stack>
    </Container>
  );
};

export default Register;
