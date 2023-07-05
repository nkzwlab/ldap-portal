"use client";
import React, { useEffect, useState } from "react";
import assert from "assert";
import axios, { AxiosError } from "axios";
import Grid from "@mui/material/Grid";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Snackbar from "@mui/material/Snackbar";
import SnackbarContent from "@mui/material/SnackbarContent";
import CircularProgress from "@mui/material/CircularProgress";

import styles from "./page.module.css";

interface State {
  err: any;
  pubkey: string[];
  inputPubkey: string;
  loadProgress: boolean;
  addProgress: boolean;
  delProgress: boolean;
}

export default function Pubkey() {
  const [state, setState] = useState<State>({
    err: null,
    pubkey: [],
    inputPubkey: "",
    loadProgress: true,
    addProgress: false,
    delProgress: false,
  });

  useEffect(() => {
    const getPubkeys = async () => {
      try {
        const { data } = await axios.get("/api/pubkey");
        assert.notEqual(null, data.pubkey);
        setState({ ...state, pubkey: data.pubkey, loadProgress: false });
      } catch (err) {
        setState({
          ...state,
          err: err instanceof AxiosError ? err.response?.data.message : err,
          loadProgress: false,
        });
      }
    };
    getPubkeys();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function addPubkey() {
    const { inputPubkey } = state;
    try {
      setState({ ...state, addProgress: true });
      const { data } = await axios.post("/api/pubkey", {
        pubkey: inputPubkey,
      });
      if (data.ok) {
        setState({
          ...state,
          pubkey: [...state.pubkey, inputPubkey],
          inputPubkey: "",
        });
      }
      setState({ ...state, addProgress: false });
    } catch (err) {
      setState({
        ...state,
        err: err instanceof AxiosError ? err.response?.data.message : err,
        addProgress: false,
      });
    }
  }
  async function delPubkey(pubkey: string) {
    try {
      setState({ ...state, delProgress: true });
      const { data } = await axios.delete("/api/pubkey", {
        data: { pubkey },
      });
      if (data.ok) {
        setState({
          ...state,
          pubkey: state.pubkey.filter((key) => key != pubkey),
        });
      }
      setState({ ...state, delProgress: false });
    } catch (err) {
      setState({
        ...state,
        err: err instanceof AxiosError ? err.response?.data.message : err,
        delProgress: false,
      });
    }
  }
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
        <Grid container justifySelf="center">
          <CircularProgress />
        </Grid>
      ) : (
        <Grid container justifySelf="center">
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>pubkey</TableCell>
                  <TableCell>delete</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {state.pubkey.map((key, i) => {
                  return (
                    <TableRow key={i}>
                      <TableCell className={styles.pubkey}>{key}</TableCell>
                      <TableCell className={styles.delete}>
                        {state.delProgress ? (
                          <CircularProgress />
                        ) : (
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => delPubkey(key)}
                            disabled={state.pubkey.length == 1}
                          >
                            delete
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
                <TableRow>
                  <TableCell className={styles.pubkey}>
                    <TextField
                      className={styles.pubkeyInput}
                      multiline
                      value={state.inputPubkey}
                      onChange={(e) =>
                        setState({ ...state, inputPubkey: e.target.value })
                      }
                    />
                  </TableCell>
                  <TableCell className={styles.add}>
                    {state.addProgress ? (
                      <CircularProgress />
                    ) : (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={addPubkey}
                      >
                        add
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      )}
    </div>
  );
}
