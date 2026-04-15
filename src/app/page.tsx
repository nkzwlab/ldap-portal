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
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function Index() {
  const router = useRouter();
  const { t } = useLanguage();
  return (
    <Container component="main" maxWidth="md">
      <CssBaseline />
      <Stack direction="row" spacing={4} sx={{ marginTop: 8 }}>
        <Card>
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {t.home.password.title}
            </Typography>
            <Typography component="p">
              {t.home.password.description}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small" color="primary">
              <Link href="/password">{t.home.password.link}</Link>
            </Button>
          </CardActions>
        </Card>
        <Card>
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {t.home.shell.title}
            </Typography>
            <Typography component="p">{t.home.shell.description}</Typography>
          </CardContent>
          <CardActions>
            <Button size="small" color="primary">
              <Link href="/shell">{t.home.shell.link}</Link>
            </Button>
          </CardActions>
        </Card>
        <Card>
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {t.home.pubkey.title}
            </Typography>
            <Typography component="p">{t.home.pubkey.description}</Typography>
          </CardContent>
          <CardActions>
            <Button size="small" color="primary">
              <Link href="/pubkey">{t.home.pubkey.link}</Link>
            </Button>
          </CardActions>
        </Card>
      </Stack>
    </Container>
  );
}
