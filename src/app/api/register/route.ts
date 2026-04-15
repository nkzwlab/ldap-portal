import { SSHA, generateToken } from "@/lib/crypto";
import { Application, getRepository } from "@/lib/database/application";
import { statusBadRequest, statusConflict, statusOk } from "@/lib/http/status";
import { searchUser } from "@/lib/ldap";
import { loginNameSchema, newPasswordSchema } from "@/lib/schemas";
import { notifyApplication, notifyDuplication } from "@/lib/slack/post";
import { removeUndefinedProperty } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import * as z from "zod";

export type ApiRegisterParams = {
  loginName: string;
  email?: string;
  password: string;
};

const registerSchema = z.object({
  loginName: loginNameSchema,
  email: z.string().email().optional().or(z.literal("")),
  password: newPasswordSchema,
});

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  const body = await req.json();
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input" },
      { status: statusBadRequest }
    );
  }
  const { loginName, email, password } = parsed.data;

  try {
    const existingUsers = await searchUser(loginName);
    if (existingUsers.length > 0) {
      console.warn(
        `POST /api/register: User ${loginName} already exists. Discarding the application`
      );
      await notifyDuplication(loginName);
      return NextResponse.json(
        { success: false, error: "This login name is already registered." },
        { status: statusConflict }
      );
    }
  } catch (err) {
    console.error(
      `POST /api/register: Failed to search LDAP user ${loginName}:`,
      err
    );
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }

  const repository = await getRepository();

  const existingApplication = await repository.getApplicationByLoginName(
    loginName
  );
  if (existingApplication !== null) {
    console.error(
      `POST /api/register: Duplicated application for ${loginName}`
    );
    return NextResponse.json(
      { success: false, error: "You have already submitted the form." },
      { status: statusBadRequest }
    );
  }

  const token = generateToken();
  const ssha = await SSHA.withRandomSalt(password);
  const passwordHash = ssha.passwd;
  const application: Application = {
    loginName,
    email,
    passwordHash,
    token,
  };
  console.log({ application });
  const applicationWithoutUndefined = removeUndefinedProperty(application);

  await repository.addEntry(token, applicationWithoutUndefined);

  console.log("POST /api/register: Notifying to Slack...");
  const result = await notifyApplication(application);
  console.log("POST /api/register: Notification result:", result);

  return NextResponse.json({ success: true }, { status: statusOk });
};
