import { Button } from "@mui/material";
import * as React from "react";
import Alert from "./Alert";
import { ApiState } from "../types";
import { SubmitHandler, useForm } from "react-hook-form";

interface ApiActionButtonProps {
  color?: Parameters<typeof Button>[0]["color"];
  onSubmit: SubmitHandler<{}>;
  state: ApiState;
  successMessage: string;
  errorMessage: string;
  doText: string;
  doneText: string;
}

export function ApiActionButton({
  color,
  onSubmit,
  state,
  successMessage,
  errorMessage,
  doText,
  doneText,
}: ApiActionButtonProps) {
  const successOpen = state === "success";
  const errorOpen = state === "error";

  const hasDone = ["success", "end"].includes(state);
  const buttonText = hasDone ? doneText : doText;
  const disabled = hasDone || state === "loading";

  const { handleSubmit } = useForm<{}>();

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Button
          type="submit"
          color={color}
          variant="contained"
          disabled={disabled}
        >
          {buttonText}
        </Button>
      </form>
      <Alert open={successOpen} handleClose={() => {}} severity="success">
        {successMessage}
      </Alert>
      <Alert open={errorOpen} handleClose={() => {}} severity="error">
        {errorMessage}
      </Alert>
    </>
  );
}
