import { getRepository } from "@/lib/database/application";
import { env } from "@/lib/env";
import { statusBadRequest, statusNotFound, statusOk } from "@/lib/http/status";
import { approveApplication, declineApplication } from "@/lib/registration";
import {
  HEADER_NAME_SLACK_SIGNATURE,
  HEADER_NAME_SLACK_TIMESTAMP,
} from "@/lib/slack/consts";
import { verifyRequestSignature } from "@slack/events-api";
import axios from "axios";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { Action } from "./types";

const verificationFailedResponse = new NextResponse(null, {
  status: statusNotFound,
});

type Body =
  | {
      type: "block_actions" | undefined;
      response_url?: string;
      ssl_check?: boolean;
      actions?: {
        value?: string;
      }[];
    }
  | {
      type: "url_verification";
      challenge: string;
    };

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  const body = await req.clone().text();
  const formData = await req.formData();
  const requestHeaders = headers();

  const { slackSigningSecret: signingSecret } = env;
  const requestSignature = requestHeaders.get(HEADER_NAME_SLACK_SIGNATURE);
  const requestTimestamp = Number.parseInt(
    requestHeaders.get(HEADER_NAME_SLACK_TIMESTAMP) ?? "0",
    10
  );

  if (requestSignature === null) {
    return verificationFailedResponse;
  }

  try {
    verifyRequestSignature({
      body,
      signingSecret,
      requestSignature,
      requestTimestamp,
    });
  } catch (err) {
    console.error("POST /slack/events: signature verification failed:", err);
    return verificationFailedResponse;
  }

  const payload = formData.get("payload");
  if (payload === null) {
    return verificationFailedResponse;
  }

  const data: Body = JSON.parse(payload.toString());

  if (data.type === "url_verification") {
    return NextResponse.json({ challenge: data.challenge });
  }

  if (data.type !== "block_actions") {
    console.error("POST /slack/events: Unknown event type:", data.type);
    return NextResponse.json(
      { success: false, error: "Unknown event type" },
      { status: statusBadRequest }
    );
  }

  const approveInBackground = async () => {
    console.log("POST /slack/events: Started background task.");
    if (typeof data?.actions === "undefined" || data.actions.length <= 0) {
      console.error("POST /slack/events: :value is empty:", data?.actions);
      return;
    }

    const action = data.actions[0];

    if (typeof action.value === "undefined") {
      console.error("POST /slack/events: :value is empty:", action);
      return;
    }
    if (typeof data?.response_url === "undefined") {
      console.error("POST /slack/events: response_url was not given:", data);
      return;
    }

    const { token, type } = parseAction(action.value);

    const repository = await getRepository();
    const application = await repository.getApplicationByToken(token);
    if (application === null) {
      console.error("POST /slack/events <async>: application not found");
      return;
    }

    let message = "";
    let success;

    switch (type) {
      case "approve":
        success = await approveApplication(token);
        if (!success) {
          console.error("POST /slack/events <async>: failed to approve");
          return;
        }
        message = `Approved the application from ${application.loginName} successfully.`;
        break;

      case "decline":
        success = await declineApplication(token);
        if (!success) {
          console.error("POST /slack/events <async>: failed to decline");
          return;
        }
        message = `Declined the application from ${application.loginName} successfully.`;
        break;

      default:
        console.error("POST /slack/events <async>: Unknown action type:", type);
        return;
    }

    axios.post(data.response_url, {
      replace_original: true,
      text: message,
    });
  };

  approveInBackground().finally(() => {
    console.log("POST /slack/events: Finished background task.");
  });

  console.log("POST /slack/events: Acknowledging to slack server...");
  return new NextResponse();
};

const parseAction = (value: string): Action => {
  const data = JSON.parse(value) as Partial<Action>;

  if (typeof data?.token === "undefined" || typeof data?.type === "undefined") {
    console.error("parseAction: Invalid action data:", data);
    throw new TypeError("Invalid action data");
  }

  return data as any as Action;
};
