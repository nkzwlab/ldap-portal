"use client";

import React, { ReactElement, useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import {
  Control,
  Controller,
  SubmitHandler,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  useFieldArray,
  useForm,
} from "react-hook-form";
import {
  Alert,
  Container,
  CssBaseline,
  Snackbar,
  Stack,
  TextField,
} from "@mui/material";
import { Schema, schema } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePubkeys, usePutPubkey } from "@/lib/hooks/pubkey";

export default function Pubkey() {
  const [alertOpen, setAlertOpen] = useState(false);

  const [currentPubkeys] = usePubkeys();
  const { putPubkeys, result } = usePutPubkey();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<Schema>({
    resolver: zodResolver(schema),
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "pubkeys",
  });

  const onSubmit: SubmitHandler<Schema> = async (data) => {
    const pubkeys = data.pubkeys.map(({ value }) => value);
    await putPubkeys(pubkeys);
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

    if (fields.length > 0) {
      console.log("pubkey effect: fields are not empty. Skip adding rows");
      return;
    }

    for (const pubkey of currentPubkeys) {
      append({ value: pubkey });
    }

    // Last field is "add" row
    append({ value: "" });
    // We depend on fields.length in this effect, howoever we don't want to re-run even if fields changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPubkeys]);

  const handleAlertClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setAlertOpen(false);
  };

  const textFields = fields.map((_item, index, { length }) => (
    <PubkeyRow
      key={index}
      {...{
        action: length - 1 === index ? "add" : "delete",
        index,
        control,
        append,
        remove,
      }}
    />
  ));

  return (
    <Container component="main" maxWidth="sm">
      <CssBaseline />
      <Stack alignItems="center" spacing={2} sx={{ marginTop: 8 }}>
        <Typography variant="h5" component="h1">
          Add/Remove SSH public key
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
            Updated SSH pubkeys successfully.
          </Alert>
        </Snackbar>
      </Stack>
    </Container>
  );
}

interface PubkeyRowProps {
  action: "add" | "delete";
  index: number;
  control: Control<Schema>;
  append: UseFieldArrayAppend<Schema>;
  remove: UseFieldArrayRemove;
}

const PubkeyRow = ({
  action,
  control,
  index,
  append,
  remove,
}: PubkeyRowProps) => {
  let button: ReactElement;
  switch (action) {
    case "add":
      button = (
        <Button
          type="button"
          variant="contained"
          color="secondary"
          onClick={() => append({ value: "" })}
        >
          Add
        </Button>
      );
      break;
    case "delete":
      button = (
        <Button
          type="button"
          variant="contained"
          color="error"
          onClick={() => remove(index)}
        >
          Delete
        </Button>
      );
      break;
  }

  return (
    <Controller
      name={`pubkeys.${index}.value`}
      key={index}
      control={control}
      render={({ field, fieldState }) => (
        <Stack direction="row" spacing={2} width="100%">
          <TextField
            {...field}
            id={`pubkeys-${index}`}
            label={`Public key ${index + 1}`}
            fullWidth
            type="text"
            autoComplete="publickey"
          />
          {button}
        </Stack>
      )}
    />
  );
};
