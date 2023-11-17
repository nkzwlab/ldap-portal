"use client";
import * as React from "react";
import {
  AppBar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import Link from "next/link";
import { AccountCircle } from "@mui/icons-material";
import axios from "axios";
import { COOKIE_NAME_USERID } from "../auth/consts";
import Cookies from "js-cookie";

export default function NavBar() {
  const loginName = Cookies.get(COOKIE_NAME_USERID);
  const isLoggedIn = typeof loginName !== "undefined";

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const loggedInAsText = isLoggedIn
    ? `Logged in as: ${loginName}`
    : "Not logged in";

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    return new Promise(() => {
      const sure = confirm("Are you sure you want to log out?");

      if (!sure) {
        setAnchorEl(null);
        return;
      }

      axios.post("/api/auth/logout");
    });
  };

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
          <div>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem disabled={true}>{loggedInAsText}</MenuItem>
              {/* Call handleLogout indirectly because it takes too long time */}
              <MenuItem disabled={!isLoggedIn} onClick={() => handleLogout()}>
                Log out
              </MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
