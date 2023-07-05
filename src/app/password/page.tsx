import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import axios, { AxiosError } from "axios";
import Snackbar from "@mui/material/Snackbar";
import SnackbarContent from "@mui/material/SnackbarContent";
import CircularProgress from "@mui/material/CircularProgress";

import styles from "./page.module.css";
import { useRouter } from "next/router";

interface State {
  err: any;
  progress: boolean;
  password: string;
  newPassword: string;
  confirmNewPassword: string;
}

export default function Password() {
  const router = useRouter();

  const [state, setState] = useState<State>({
    err: null,
    progress: false,
    password: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const changePassword: React.FormEventHandler<HTMLFormElement> = async (
    event
  ) => {
    event.preventDefault();
    const { password, newPassword } = state;
    if (newPassword != state.confirmNewPassword || newPassword.length < 8) {
      setState({ ...state, err: "invalid new password" });
      return;
    }
    try {
      setState({ ...state, progress: true });
      const { data } = await axios.post("/api/password", {
        password,
        newPassword,
      });
      if (data.ok) {
        router.push("/");
      }
      setState({ ...state, progress: false });
    } catch (err) {
      setState({
        ...state,
        err: err instanceof AxiosError ? err.response?.data.message : err,
        progress: false,
      });
    }
  };

  return (
    <div className={styles.root}>
      <Snackbar
        open={state.err != null}
        autoHideDuration={2000}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        onClose={() => {
          setState({ ...state, err: null });
        }}
      >
        <SnackbarContent message={state.err} />
      </Snackbar>
      <Grid container justifySelf="center">
        <Paper className={styles.paper}>
          <form onSubmit={changePassword}>
            <Grid container spacing={24}>
              <Grid item xs={12}>
                <Typography gutterBottom variant="h5" align="center">
                  Change Password
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Current Password"
                  className={styles.password}
                  type="password"
                  autoComplete="current-password"
                  onChange={(e) => {
                    setState({ ...state, password: e.target.value });
                  }}
                  value={state.password}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="New Password"
                  className={styles.password}
                  type="password"
                  autoComplete="new-password"
                  onChange={(e) => {
                    setState({ ...state, newPassword: e.target.value });
                  }}
                  error={
                    state.newPassword.length < 8 &&
                    state.newPassword.length != 0
                  }
                  value={state.newPassword}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Confirm New Password"
                  className={styles.password}
                  type="password"
                  autoComplete="new-password"
                  onChange={(e) => {
                    setState({ ...state, confirmNewPassword: e.target.value });
                  }}
                  error={state.newPassword != state.confirmNewPassword}
                  value={state.confirmNewPassword}
                />
              </Grid>
              <Grid item xs={12}>
                {state.progress ? (
                  <Grid container justifySelf="center">
                    <CircularProgress />
                  </Grid>
                ) : (
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    className={styles.button}
                  >
                    Submit
                  </Button>
                )}
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Grid>
    </div>
  );
}
