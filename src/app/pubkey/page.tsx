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
import { Add, Delete } from "@mui/icons-material";

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

  const textFields = fields.map(({ id }, index) => (
    <PubkeyRow
      key={id}
      {...{
        id,
        index,
        control,
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
            type="button"
            variant="contained"
            color="secondary"
            sx={{ display: "flex", paddingRight: "1.5em" }}
            onClick={() => append({ value: "" })}
          >
            <Add /> Add
          </Button>
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
  id: string;
  index: number;
  control: Control<Schema>;
  remove: UseFieldArrayRemove;
}

const PubkeyRow = ({ id, control, index, remove }: PubkeyRowProps) => {
  let button: ReactElement = (
    <Button
      type="button"
      variant="contained"
      color="error"
      sx={{ display: "flex", gap: 0.3, paddingRight: "1.5em" }}
      onClick={() => remove(index)}
    >
      <Delete /> DELETE
    </Button>
  );

  return (
    <Controller
      name={`pubkeys.${index}.value`}
      key={id}
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
