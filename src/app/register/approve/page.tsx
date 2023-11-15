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
import { SubmitHandler, useForm } from "react-hook-form";
import { Application } from "@/lib/database/application";
import { ApprovalState, useApproval } from "@/lib/hooks/approval";
import Alert from "@/lib/components/Alert";

const Approve = () => {
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
              </TableRow>
            </TableHead>
            <TableBody>{rows}</TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </Container>
  );
};

interface ApproveButtonProps {
  application: Application;
}

const formatSuccessMessage = (person: string) =>
  `Approved application from ${person} successfully.`;
const formatErrorMessage = (person: string, error?: string): string | null =>
  typeof error !== "undefined"
    ? `Failed to approve application from ${person}: ${error}`
    : null;

const ApproveButton = ({ application }: ApproveButtonProps) => {
  const { approve, result, state, setState } = useApproval(application.token);

  const successOpen = state === "approved";
  const successMessage = formatSuccessMessage(application.loginName);
  const errorOpen = state === "error";
  const errorMessage = formatErrorMessage(application.loginName, result?.error);

  const {
    handleSubmit,
    formState: { isSubmitting, isSubmitted },
  } = useForm<{}>();

  const onSubmit: SubmitHandler<{}> = async () => {
    await approve();
  };

  const approveTextMap: { [key in ApprovalState]: "Approve" | "Approved" } = {
    start: "Approve",
    loading: "Approve",
    error: "Approve",
    approved: "Approved",
    end: "Approved",
  };
  const approveText = approveTextMap[state];

  return (
    <>
      <form onSubmit={onSubmit} noValidate>
        <Button
          type="submit"
          variant="contained"
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting || (isSubmitted && result?.success)}
        >
          {approveText}
        </Button>
      </form>
      <Alert open={successOpen} handleClose={() => {}} severity="success">
        {successMessage}
      </Alert>
      <Alert open={errorOpen} handleClose={() => {}} severity="error">
        {errorMessage}
      </Alert>
    </>
  );
};

export default Approve;
