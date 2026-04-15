import { Application, getRepository } from "@/lib/database/application";
import {
  statusBadRequest,
  statusInternalServerError,
  statusNotFound,
  statusOk,
} from "@/lib/http/status";
import { AddUserParams, addUser } from "@/lib/ldap";
import { approveApplication } from "@/lib/registration";
import { EntryAlreadyExistsError } from "ldapjs";
import { NextRequest, NextResponse } from "next/server";

type PathParams = {
  token: string;
};

export const POST = async (
  req: NextRequest,
  { params }: { params: Promise<PathParams> }
): Promise<NextResponse> => {
  const { token } = await params;

  if (typeof token !== "string") {
    return NextResponse.json(
      { error: "invalid token" },
      { status: statusBadRequest }
    );
  }

  let success: boolean = false;
  try {
    success = await approveApplication(token);
  } catch (err) {
    if (err instanceof EntryAlreadyExistsError) {
      return NextResponse.json({
        success: false,
        error: "User already exists",
      });
    }

    throw err;
  }

  const status = success ? statusOk : statusInternalServerError;
  return NextResponse.json({ success }, { status });
};

const applicationToParams = (application: Application): AddUserParams => {
  const { loginName, email, passwordHash } = application;
  const params: AddUserParams = {
    loginName,
    email,
    passwd: passwordHash,
  };

  return params;
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: Promise<PathParams> }
): Promise<NextResponse> => {
  const { token } = await params;

  if (typeof token !== "string") {
    return NextResponse.json(
      { error: "invalid token" },
      { status: statusBadRequest }
    );
  }

  const repository = await getRepository();
  const application = await repository.getApplicationByToken(token);

  if (application === null) {
    return NextResponse.json(
      { error: "application not found with that token" },
      { status: statusNotFound }
    );
  }

  await repository.deleteEntry(token);

  return NextResponse.json({ success: true }, { status: statusOk });
};
