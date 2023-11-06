"use client";

import React, { useCallback, useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useShell, useUpdateShell } from "@/lib/hooks/shell";
import {
  Alert,
  Container,
  CssBaseline,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Stack,
} from "@mui/material";
import { Schema, schema } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { shells } from "@/lib/types";

export default function Shell() {
  const [alertOpen, setAlertOpen] = useState(false);

  const currentShell = useShell();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isSubmitted },
  } = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: { shell: currentShell ?? undefined },
  });

  const { updateShell, result } = useUpdateShell();

  const onSubmit: SubmitHandler<Schema> = async ({ shell }) => {
    await updateShell(shell);
    setAlertOpen(true);
  };

  useCallback(() => {
    setAlertOpen(!!result?.success);
  }, [result]);

  const handleAlertClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setAlertOpen(false);
  };

  const menuItems = shells.map((shell) => (
    <MenuItem key={shell} value={shell}>
      {shell}
    </MenuItem>
  ));

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
            name="shell"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <InputLabel id="select-shell">Shell</InputLabel>
                <Select
                  {...field}
                  labelId="select-shell"
                  id="loginName"
                  label="Shell"
                  required
                  fullWidth
                  autoComplete="loginName"
                  error={fieldState.invalid}
                >
                  {menuItems}
                </Select>
              </>
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
        <Snackbar
          open={alertOpen}
          autoHideDuration={6000}
          onClose={handleAlertClose}
        >
          <Alert
            onClose={handleAlertClose}
            severity="success"
            variant="filled"
            sx={{ width: "100%" }}
          >
            Updated login shell successfully.
          </Alert>
        </Snackbar>
      </Stack>
    </Container>
  );
}
