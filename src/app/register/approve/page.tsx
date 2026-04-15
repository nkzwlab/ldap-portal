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
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function Approve() {
  const applications = useApplications();
  const { t } = useLanguage();
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
            {application.email || t.approve.noEmail}
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
          {t.approve.title}
        </Typography>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: "sm" }} aria-label="user information">
            <TableHead>
              <TableRow>
                <TableCell>{t.approve.loginName}</TableCell>
                <TableCell align="right">{t.approve.email}</TableCell>
                <TableCell align="right">{t.approve.approveHeader}</TableCell>
                <TableCell align="right">{t.approve.declineHeader}</TableCell>
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

const ApproveButton = ({ application }: ApplicationButtonProps) => {
  const { approve, result, state, setState } = useApproval(application.token);
  const { t } = useLanguage();

  const successMessage = t.approve.approveSuccess(application.loginName);
  const errorMessage =
    typeof result?.error !== "undefined"
      ? t.approve.approveError(application.loginName, result.error)
      : "";

  const onSubmit: SubmitHandler<{}> = async () => {
    await approve();
  };

  const doText = t.approve.approveButton;
  const doneText = t.approve.approvedButton;

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
  const { t } = useLanguage();

  const successMessage = t.approve.declineSuccess(application.loginName);
  const errorMessage =
    typeof result?.error !== "undefined"
      ? t.approve.declineError(application.loginName, result.error)
      : "";

  const onSubmit: SubmitHandler<{}> = async () => {
    await decline();
  };

  const doText = t.approve.declineButton;
  const doneText = t.approve.declinedButton;

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
