"use client";

import React from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";

import { Box, Container, CssBaseline } from "@mui/material";
import { useLanguage } from "@/lib/i18n/LanguageContext";

type CardItem = {
  label: string;
  description: string;
  href: string;
  external?: boolean;
};

function CardGrid({ items }: { items: CardItem[] }) {
  return (
    <Grid container spacing={3}>
      {items.map(({ label, description, href, external }) => (
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
  );
}

export default function Index() {
  const { t } = useLanguage();

  const links: CardItem[] = [
    { label: t.home.vpn.title, description: t.home.vpn.description, href: "https://vpn.jn.sfc.keio.ac.jp/", external: true },
  ];

  const settings: CardItem[] = [
    { label: t.home.password.title, description: t.home.password.description, href: "/password" },
    { label: t.home.shell.title, description: t.home.shell.description, href: "/shell" },
    { label: t.home.pubkey.title, description: t.home.pubkey.description, href: "/pubkey" },
  ];

  return (
    <Container component="main" maxWidth="lg">
      <CssBaseline />
      <Box sx={{ marginTop: 8 }}>
        <Typography variant="body1" sx={{ mb: 2, color: "text.secondary" }}>
          {t.home.linksSection}
        </Typography>
        <CardGrid items={links} />
      </Box>
      <Box sx={{ marginTop: 8 }}>
        <Typography variant="body1" sx={{ mb: 2, color: "text.secondary" }}>
          {t.home.settingsSection}
        </Typography>
        <CardGrid items={settings} />
      </Box>
    </Container>
  );
}
