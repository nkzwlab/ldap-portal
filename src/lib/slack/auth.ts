import * as crypto from "crypto";
import {
  HEADER_NAME_SLACK_SIGNATURE,
  HEADER_NAME_SLACK_TIMESTAMP,
} from "./consts";
import { env } from "../env";

export const verify_signature = (body: string, headers: Headers): boolean => {
  const { slackSigningSecret: signingSecret } = env;
  const signature = headers.get(HEADER_NAME_SLACK_SIGNATURE);
  const timestamp = Number.parseInt(
    headers.get(HEADER_NAME_SLACK_TIMESTAMP) ?? "0",
    10
  );

  if (signature === null) {
    return false;
  }

  // Divide current date to match Slack ts format
  // Subtract 5 minutes from current time
  const fiveMinutesAgo = Math.floor(Date.now() / 1000) - 60 * 5;

  if (timestamp < fiveMinutesAgo) {
    console.error("verify_signature: request is older than 5 minutes");
    return false;
  }

  const hmac = crypto.createHmac("sha256", signingSecret);
  const [version, hash] = signature.split("=");
  hmac.update(`${version}:${timestamp}:${body}`);

  if (hash !== hmac.digest("hex")) {
    console.error("verify_signature: request signature is not valid");
    return false;
  }

  console.log("verify_siganture: request signing verification success");
  return true;
};

const generate_siganture = (
  timestamp: string,
  body: string
): string | void => {};

const format_request = (timestamp: string, body: string): string =>
  `v0:${timestamp}:${body}`;
