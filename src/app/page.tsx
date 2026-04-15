"use client";

import React from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";

import { Container, CssBaseline } from "@mui/material";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function Index() {
  const { t } = useLanguage();

  const cards = [
    { label: t.home.vpn.title, description: t.home.vpn.description, href: "https://vpn.jn.sfc.keio.ac.jp/", external: true },
    { label: t.home.password.title, description: t.home.password.description, href: "/password", external: false },
    { label: t.home.shell.title, description: t.home.shell.description, href: "/shell", external: false },
    { label: t.home.pubkey.title, description: t.home.pubkey.description, href: "/pubkey", external: false },
  ];

  return (
    <Container component="main" maxWidth="lg">
      <CssBaseline />
      <Grid container spacing={3} sx={{ marginTop: 6 }}>
        {cards.map(({ label, description, href, external }) => (
          <Grid item xs={12} sm={6} lg={3} key={label}>
            <Card sx={{ height: "100%" }}>
              <CardActionArea
                component="a"
                href={href}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                sx={{ height: "100%" }}
              >
                <CardContent sx={{ pb: 8 }}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {label}
                  </Typography>
                  <Typography component="p" color="text.secondary">
                    {description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
