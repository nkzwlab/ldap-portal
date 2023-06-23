import React from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import SnackbarContent from "@mui/material/SnackbarContent";
import CircularProgress from "@mui/material/CircularProgress";

const styles = {
  root: {
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  paper: {
    flexGrow: 1,
    maxWidth: 450,
    // minHeight: 500,
    padding: 40,
    boxSizing: "border-box",
  },
  userID: {
    width: "100%",
  },
  password: {
    width: "100%",
  },
  button: {
    float: "right",
  },
};

class Password extends React.Component {
  constructor(props) {
    super(props);
    const token = window.localStorage.getItem("token");
    this.state = {
      err: null,
      progress: false,
      token,
      password: "",
      newPassword: "",
      confirmNewPassword: "",
    };
  }
  render() {
    return (
      <div className={this.props.classes.root}>
        <Snackbar
          open={this.state.err != null}
          autoHideDuration={2000}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          onClose={() => {
            this.setState({ err: null });
          }}
        >
          <SnackbarContent message={this.state.err} />
        </Snackbar>
        <Grid container justify="center">
          <Paper className={this.props.classes.paper}>
            <form onSubmit={this.changePassword.bind(this)}>
              <Grid container spacing={24}>
                <Grid item xs={12}>
                  <Typography gutterBottom variant="h5" align="center">
                    Change Password
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Current Password"
                    className={this.props.classes.password}
                    type="password"
                    autoComplete="current-password"
                    onChange={(e) => {
                      this.setState({ password: e.target.value });
                    }}
                    value={this.state.password}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="New Password"
                    className={this.props.classes.password}
                    type="password"
                    autoComplete="new-password"
                    onChange={(e) => {
                      this.setState({ newPassword: e.target.value });
                    }}
                    error={
                      this.state.newPassword.length < 8 &&
                      this.state.newPassword.length != 0
                    }
                    value={this.state.newPassword}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Confirm New Password"
                    className={this.props.classes.password}
                    type="password"
                    autoComplete="new-password"
                    onChange={(e) => {
                      this.setState({ confirmNewPassword: e.target.value });
                    }}
                    error={
                      this.state.newPassword != this.state.confirmNewPassword
                    }
                    value={this.state.confirmNewPassword}
                  />
                </Grid>
                <Grid item xs={12}>
                  {this.state.progress ? (
                    <Grid container justify="center">
                      <CircularProgress />
                    </Grid>
                  ) : (
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      className={this.props.classes.button}
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

  async changePassword(e) {
    e.preventDefault();
    const { token, password, newPassword } = this.state;
    if (
      newPassword != this.state.confirmNewPassword ||
      newPassword.length < 8
    ) {
      this.setState({ err: "invalid new password" });
      return;
    }
    try {
      this.setState({ progress: true });
      const { data } = await axios.post("/api/password", {
        token,
        password,
        newPassword,
      });
      if (data.ok) {
        this.props.history.push("/");
      }
      this.setState({ progress: false });
    } catch (err) {
      this.setState({
        err: err.response ? err.response.data.message : err.message,
        progress: false,
      });
    }
  }
}

export default container(styles)(Password);
