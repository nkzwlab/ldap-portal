"use client";
import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import Link from "next/link";

export default function NavBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="home"
            sx={{ mr: 2 }}
          >
            <Link href="/">
              <HomeIcon />
            </Link>
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            LDAP Portal
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
