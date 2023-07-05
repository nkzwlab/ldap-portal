import React, { useEffect, useState } from "react";
import assert from "assert";
import axios, { Axios, AxiosError } from "axios";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Snackbar from "@mui/material/Snackbar";
import SnackbarContent from "@mui/material/SnackbarContent";
import CircularProgress from "@mui/material/CircularProgress";

import styles from "./page.module.css";

const shells = [
  "/bin/sh",
  "/bin/bash",
  "/bin/rbash",
  "/bin/dash",
  "/bin/tcsh",
  "/bin/csh",
  "/bin/zsh",
  "/usr/bin/zsh",
  "/usr/bin/fish",
];

interface State {
  err: any;
  shell: string;
  loadProgress: boolean;
}

export default function Shell() {
  const [state, setState] = useState<State>({
    err: null,
    shell: "",
    loadProgress: true,
  });

  const setShell: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    const { shell } = state;
    try {
      setState({ ...state, loadProgress: true });
      const { data } = await axios.post("/api/shell", { shell });
      if (data.ok) {
        setState({ ...state, shell });
      }
      setState({ ...state, loadProgress: false });
    } catch (err) {
      if (err instanceof AxiosError) {
        setState({
          ...state,
          err: err.response ? err.response.data.message : err.message,
          loadProgress: false,
        });
      } else {
        throw err;
      }
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get("/api/shell");
        assert.notEqual(null, data.shell);
        setState({ ...state, shell: data.shell, loadProgress: false });
        console.log(data.shell);
      } catch (err) {
        if (err instanceof AxiosError) {
          setState({
            ...state,
            err: err.response ? err.response.data.message : err.message,
            loadProgress: false,
          });
        } else {
          throw err;
        }
      }
    })();
  });

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
      {state.loadProgress ? (
        <Grid container justifyContent="center">
          <CircularProgress />
        </Grid>
      ) : (
        <Grid container justifyContent="center">
          <Paper className={styles.paper}>
            <form
              onSubmit={setShell.bind({
                /*TODO*/
              })}
            >
              <Grid container spacing={24}>
                <Grid item xs={12}>
                  <Typography gutterBottom variant="h5" align="center">
                    Change Shell
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <FormControl className={styles.shell}>
                    <InputLabel htmlFor="shell-select">Shell</InputLabel>
                    <Select
                      value={state.shell}
                      onChange={(e) => {
                        setState({ ...state, shell: e.target.value });
                      }}
                      inputProps={{
                        name: "shell",
                        id: "shell-select",
                      }}
                    >
                      {shells.map((shell) => {
                        return (
                          <MenuItem key={shell} value={shell}>
                            {shell}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  {state.loadProgress ? (
                    <Grid container justifyContent="center">
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
      )}
    </div>
  );
}
