"use client";
import * as React from "react";
import {
  AppBar,
  Box,
  Button,
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
import { useLanguage } from "../i18n/LanguageContext";

export default function NavBar() {
  const loginName = Cookies.get(COOKIE_NAME_USERID);
  const isLoggedIn = typeof loginName !== "undefined";

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const { language, toggleLanguage, t } = useLanguage();

  const loggedInAsText = isLoggedIn
    ? t.nav.loggedInAs(loginName!)
    : t.nav.notLoggedIn;

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    return new Promise(() => {
      const sure = confirm(t.nav.logOutConfirm);

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
            <Link href="/" prefetch={false}>
              <HomeIcon />
            </Link>
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            LDAP Portal
          </Typography>
          <Button
            color="inherit"
            onClick={toggleLanguage}
            sx={{ mr: 1, border: "1px solid rgba(255,255,255,0.5)", minWidth: 48 }}
          >
            {language === "ja" ? "EN" : "JA"}
          </Button>
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
                {t.nav.logOut}
              </MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
