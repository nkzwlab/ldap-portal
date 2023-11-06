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
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Stack,
  TextField,
} from "@mui/material";
import { Schema, schema } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { shells } from "@/lib/types";

export default function Shell() {
  const [alertOpen, setAlertOpen] = useState(false);

  const [currentShell, reloadCurrentShell] = useShell();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: { shell: "/bin/bash" },
  });

  const { updateShell, result } = useUpdateShell();

  const onSubmit: SubmitHandler<Schema> = async ({ shell }) => {
    await updateShell(shell);
    reloadCurrentShell();
    setAlertOpen(true);
  };

  useEffect(() => {
    setAlertOpen(!!result?.success);
  }, [result]);

  useEffect(() => {
    if (currentShell === null) {
      console.log("shell effect: result or curretnShel is null");
      return;
    }

    console.log("shell effect: result is not null");
    setValue("shell", currentShell);
  }, [result, currentShell, setValue]);

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
              <FormControl fullWidth>
                <TextField
                  {...field}
                  id="loginName"
                  label="Shell"
                  select
                  required
                  fullWidth
                  autoComplete="loginName"
                  error={fieldState.invalid}
                >
                  {menuItems}
                </TextField>
              </FormControl>
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
