"use client";

import * as React from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import SnackbarContent from "@mui/material/SnackbarContent";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";

import styles from "./login.module.css";

type State = {
  err: any;
  progress: boolean;
  userID: string;
  password: string;
};

export default function Login() {
  const [state, setState] = React.useState<State>({
    err: null,
    progress: false,
    userID: "",
    password: "",
  });
  const login: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    const { userID, password } = state;
    try {
      setState({ ...state, progress: true });
      const { data } = await axios.post("/api/auth", { userID, password });
      if (data.ok) {
        window.localStorage.setItem("token", data.token);
        this.props.history.push("/");
      }
      setState({ ...state, progress: false });
    } catch (e) {
      const err = e as any;
      setState({
        ...state,
        err: err.response ? err.response.data.message : err.message,
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
      <Grid container>
        <Paper className={styles.paper}>
          <form onSubmit={login}>
            <Grid container spacing={24}>
              <Grid item xs={12}>
                <Typography gutterBottom variant="h5" align="center">
                  LogIn
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="UserID"
                  className={styles.userID}
                  type="text"
                  autoComplete="username"
                  onChange={(e) => {
                    setState({ ...state, userID: e.target.value });
                  }}
                  value={state.userID}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Password"
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
                {state.progress ? (
                  <Grid justifySelf="center">
                    <CircularProgress />
                  </Grid>
                ) : (
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    className={styles.button}
                  >
                    Login
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
