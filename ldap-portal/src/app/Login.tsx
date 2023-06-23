import React from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import SnackbarContent from "@mui/material/SnackbarContent";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";

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

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      err: null,
      progress: false,
      userID: "",
      password: "",
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
            <form onSubmit={this.login.bind(this)}>
              <Grid container spacing={24}>
                <Grid item xs={12}>
                  <Typography gutterBottom variant="h5" align="center">
                    LogIn
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="UserID"
                    className={this.props.classes.userID}
                    type="text"
                    autoComplete="username"
                    onChange={(e) => {
                      this.setState({ userID: e.target.value });
                    }}
                    value={this.state.userID}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Password"
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
  async login(e) {
    e.preventDefault();
    const { userID, password } = this.state;
    try {
      this.setState({ progress: true });
      const { data } = await axios.post("/api/auth", { userID, password });
      if (data.ok) {
        window.localStorage.setItem("token", data.token);
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

export default container(styles)(Login);
