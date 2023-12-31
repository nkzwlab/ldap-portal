import { PropsWithChildren, useCallback, useState } from "react";
import {
  Alert as MuiAlert,
  AlertProps as MuiAlertProps,
  Snackbar,
} from "@mui/material";

export interface AlertProps extends PropsWithChildren {
  open: boolean;
  handleClose: () => void;
  severity: MuiAlertProps["severity"];
}

export default function Alert({
  open,
  handleClose,
  children,
  severity,
}: AlertProps) {
  const callback = useCallback(() => {
    handleClose();
  }, [handleClose]);

  const handleAlertClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    handleClose();
  };

  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={handleAlertClose}>
      <MuiAlert
        onClose={handleAlertClose}
        severity={severity}
        variant="filled"
        sx={{ width: "100%" }}
      >
        {children}
      </MuiAlert>
    </Snackbar>
  );
}
