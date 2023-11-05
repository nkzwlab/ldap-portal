"use client";

import React from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";

import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import { Container, CssBaseline, Stack } from "@mui/material";

export default function Index() {
  const router = useRouter();
  return (
    <Container component="main" maxWidth="md">
      <CssBaseline />
      <Stack direction="row" spacing={4} sx={{ marginTop: 8 }}>
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
              onClick={() => router.push("/password")}
            >
              Password
            </Button>
          </CardActions>
        </Card>
        <Card>
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              シェル変更
            </Typography>
            <Typography component="p">Linuxのログインシェルの変更。</Typography>
          </CardContent>
          <CardActions>
            <Button
              size="small"
              color="primary"
              onClick={() => router.push("/shell")}
            >
              Shell
            </Button>
          </CardActions>
        </Card>
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
              onClick={() => router.push("/pubkey")}
            >
              Pubkey
            </Button>
          </CardActions>
        </Card>
      </Stack>
    </Container>
  );
}
