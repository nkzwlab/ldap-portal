import {
  IncomingWebhook,
  IncomingWebhookResult,
  IncomingWebhookSendArguments,
} from "@slack/webhook";
import { env } from "../env";
import { Application } from "../database/application";
import { Action } from "@/app/slack/interactive/types";

const url = env.slacWebhookUrl;

const webhook = new IncomingWebhook(url);

export const notifyApplication = async (
  application: Application
): Promise<IncomingWebhookResult> => {
  const approveAction: Action = {
    type: "approve",
    token: application.token,
  };
  const declineAction: Action = {
    type: "decline",
    token: application.token,
  };

  const options: IncomingWebhookSendArguments = {
    blocks: [
      {
        // Header
        type: "header",
        text: {
          type: "plain_text",
          text: "New LDAP Portal Application",
          emoji: true,
        },
      },
      {
        // Application information
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*Login name:*\n${application.loginName}`,
          },
          {
            type: "mrkdwn",
            text: `*Email:*\n${application.email || "(_not entered)_"}`,
          },
        ],
      },
      {
        // Action buttons
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              emoji: true,
              text: "Approve",
            },
            style: "primary",
            value: JSON.stringify(approveAction),
          },
          {
            type: "button",
            text: {
              type: "plain_text",
              emoji: true,
              text: "Reject",
            },
            style: "danger",
            value: JSON.stringify(declineAction),
          },
        ],
      },
    ],
  };

  const result = await webhook.send(options);

  return result;
};

export const notifyApproval = async (
  application: Application
): Promise<IncomingWebhookResult> => {
  const options: IncomingWebhookSendArguments = {
    blocks: [
      {
        // Header
        type: "header",
        text: {
          type: "plain_text",
          text: "Application was approwed",
          emoji: true,
        },
      },
      {
        // Application information
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `New user **${application.loginName}** was created.`,
          },
        ],
      },
    ],
  };

  const result = await webhook.send(options);

  return result;
};

export const notifyDuplication = async (
  loginName: string
): Promise<IncomingWebhookResult> => {
  const options: IncomingWebhookSendArguments = {
    blocks: [
      {
        // Header
        type: "header",
        text: {
          type: "plain_text",
          text: "Duplicated application notice",
          emoji: true,
        },
      },
      {
        // Application information
        type: "section",
        text: {
          type: "mrkdwn",
          text: `Registration form for user *${loginName}* was submitted, but the user already exists on LDAP.`,
        },
      },
    ],
  };

  const result = await webhook.send(options);

  return result;
};
