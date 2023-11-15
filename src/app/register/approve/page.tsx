"use client";

import * as React from "react";
import {
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
import { Application } from "@/lib/database/application";
import { useApproval } from "@/lib/hooks/approval";
import { SubmitHandler } from "react-hook-form";
import { ApiActionButton } from "@/lib/components/ApiActionButton";
import { useDecline } from "@/lib/hooks/decline";

export default function Approve() {
  const applications = useApplications();
  console.log("Approve:", { applications });

  if (applications === null) {
    console.log("Approve: applications are null");
  }
  console.log("Approve: typeof applications =", typeof applications);
  console.log("Approve: typeof applications.map =", typeof applications?.map);

  const rows = Array.isArray(applications)
    ? applications.map((application, index) => (
        <TableRow key={index}>
          <TableCell>{application.loginName}</TableCell>
          <TableCell align="right">
            {application.email || "(Not entered)"}
          </TableCell>
          <TableCell align="right">
            <ApproveButton application={application} />
          </TableCell>
          <TableCell align="right">
            <DeclineButton application={application} />
          </TableCell>
        </TableRow>
      ))
    : null;

  return (
    <Container component="main" maxWidth="sm">
      <CssBaseline />
      <Stack alignItems="center" spacing={2} sx={{ marginTop: 8 }}>
        <Typography variant="h4" component="h1">
          Approval
        </Typography>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: "sm" }} aria-label="user information">
            <TableHead>
              <TableRow>
                <TableCell>Login name</TableCell>
                <TableCell align="right">Email</TableCell>
                <TableCell align="right">Approve</TableCell>
                <TableCell align="right">Decline</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{rows}</TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </Container>
  );
}

interface ApplicationButtonProps {
  application: Application;
}

const formatSuccessMessage = (person: string) =>
  `Approved application from ${person} successfully.`;
const formatErrorMessage = (person: string, error?: string): string =>
  typeof error !== "undefined"
    ? `Failed to approve application from ${person}: ${error}`
    : "";

const ApproveButton = ({ application }: ApplicationButtonProps) => {
  const { approve, result, state, setState } = useApproval(application.token);

  const successMessage = `Approved application from ${application.loginName} successfully.`;
  const errorMessage =
    typeof result?.error !== "undefined"
      ? `Failed to approve application from ${application.loginName}: ${result.error}`
      : "";

  const onSubmit: SubmitHandler<{}> = async () => {
    await approve();
  };

  const doText = "Approve";
  const doneText = "Approved";

  return (
    <ApiActionButton
      {...{
        onSubmit,
        state,
        setState,
        successMessage,
        errorMessage,
        doText,
        doneText,
      }}
    />
  );
};

const DeclineButton = ({ application }: ApplicationButtonProps) => {
  const { decline, result, state, setState } = useDecline(application.token);

  const successMessage = `Declined application from ${application.loginName}.`;
  const errorMessage =
    typeof result?.error !== "undefined"
      ? `Failed to decline application from ${application.loginName}: ${result.error}`
      : "";

  const onSubmit: SubmitHandler<{}> = async () => {
    await decline();
  };

  const doText = "Decline";
  const doneText = "Declined";

  return (
    <ApiActionButton
      {...{
        color: "warning",
        onSubmit,
        state,
        setState,
        successMessage,
        errorMessage,
        doText,
        doneText,
      }}
    />
  );
};
