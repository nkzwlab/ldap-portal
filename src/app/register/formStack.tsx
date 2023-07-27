"use client";

import * as React from "react";

import { Input, InputLabel, Stack } from "@mui/material";

export interface FormStackProps {
  onSubmit: React.FormEventHandler<HTMLFormElement>;
}

export const FormStack = ({ onSubmit }: FormStackProps) => (
  <Stack component="form" onSubmit={onSubmit}>
    <InputLabel htmlFor="loginName">Login name</InputLabel>
    <Input id="loginName"></Input>
  </Stack>
);
