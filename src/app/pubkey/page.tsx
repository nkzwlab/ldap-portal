"use client";

import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
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
import { usePubkeys, usePutPubkey } from "@/lib/hooks/pubkey";

export default function Pubkey() {
  const [alertOpen, setAlertOpen] = useState(false);

  const [currentPubkeys, reloadCurrentPubkey] = usePubkeys();
  const { putPubkeys, result } = usePutPubkey();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm<Schema>({
    resolver: zodResolver(schema),
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "pubkeys",
  });

  const onSubmit: SubmitHandler<Schema> = async (data) => {
    console.log("onSubmit:", { data });
    const pubkeys = data.pubkeys.map(({ value }) => value);
    await putPubkeys(pubkeys);
    reloadCurrentPubkey();
    setAlertOpen(true);
  };

  useEffect(() => {
    setAlertOpen(!!result?.success);
  }, [result]);

  useEffect(() => {
    if (currentPubkeys === null) {
      console.log("pubkey effect: result or curretnShel is null");
      return;
    }

    console.log("pubkey effect: result is not null", currentPubkeys);

    for (const pubkey of currentPubkeys) {
      append({ value: pubkey });
    }

    if (currentPubkeys.length <= 0) {
      append({ value: "" });
    }
  }, [append, currentPubkeys, setValue]);

  const handleAlertClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setAlertOpen(false);
  };

  const textFields = fields.map((item, index, arr) => (
    <Controller
      name={`pubkeys.${index}.value`}
      key={index}
      control={control}
      render={({ field, fieldState }) => (
        <Stack>
          <TextField
            {...field}
            id={`pubkeys-${index}`}
            label={`Public key ${index + 1}`}
            fullWidth
            type="text"
            autoComplete="publickey"
            error={fieldState.invalid}
          />
          <Button
            type="button"
            variant="contained"
            onClick={() => remove(index)}
          >
            Delete
          </Button>
        </Stack>
      )}
    />
  ));

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Stack alignItems="center" spacing={2} sx={{ marginTop: 8 }}>
        <Typography variant="h5" component="h1">
          Change login pubkey
        </Typography>

        <Stack
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          spacing={2}
          alignItems="center"
          width="100%"
        >
          {textFields}

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
            Updated login pubkey successfully.
          </Alert>
        </Snackbar>
      </Stack>
    </Container>
  );
}
