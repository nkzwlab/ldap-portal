"use client";

import * as React from "react";
import {
  Button,
  Container,
  CssBaseline,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useApplications } from "@/lib/hooks/applications";

const Approve = () => {
  const applications = useApplications();
  console.log({ applications });

  const rows =
    applications !== null
      ? applications.map((application, index) => (
          <TableRow key={index}>
            <TableCell>{application.loginName}</TableCell>
            <TableCell align="right">{application.email}</TableCell>
            <TableCell align="right">{application.token}</TableCell>
          </TableRow>
        ))
      : null;

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Stack alignItems="center" spacing={2} sx={{ marginTop: 8 }}>
        <Typography variant="h4" component="h1">
          Approval
        </Typography>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="user information">
            <TableHead>
              <TableRow>
                <TableCell>Login name</TableCell>
                <TableCell align="right">Email</TableCell>
                <TableCell align="right">Token</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{rows}</TableBody>
          </Table>
        </TableContainer>
        <Button type="submit" variant="contained" fullWidth>
          Submit
        </Button>
      </Stack>
    </Container>
  );
};

export default Approve;
