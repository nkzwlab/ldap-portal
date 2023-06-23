import React from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";

const styles = {
  root: {
    padding: 20,
  },
};

class Index extends React.Component {
  render() {
    return (
      <div className={this.props.classes.root}>
        <Grid container justify="center" spacing={24}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  パスワード変更
                </Typography>
                <Typography component="p">
                  Linux,vpn,sambaのパスワード変更。
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="primary"
                  onClick={() => this.props.history.push("/password")}
                >
                  Password
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  シェル変更
                </Typography>
                <Typography component="p">
                  Linuxのログインシェルの変更。
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="primary"
                  onClick={() => this.props.history.push("/shell")}
                >
                  Shell
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  公開鍵登録
                </Typography>
                <Typography component="p">LinuxのSSHの公開鍵登録。</Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="primary"
                  onClick={() => this.props.history.push("/pubkey")}
                >
                  Pubkey
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default container(styles)(Index);
