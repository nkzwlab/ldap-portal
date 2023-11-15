import { Application, getRepository } from "@/lib/database/application";
import {
  statusBadRequest,
  statusInternalServerError,
  statusNotFound,
  statusOk,
} from "@/lib/http/status";
import { AddUserParams, addUser } from "@/lib/ldap";
import { EntryAlreadyExistsError } from "ldapjs";
import { NextRequest, NextResponse } from "next/server";

type PathParams = {
  token: string;
};

export const POST = async (
  req: NextRequest,
  { params: { token } }: { params: PathParams }
): Promise<NextResponse> => {
  if (typeof token !== "string") {
    console.log({ token });
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

  const params: AddUserParams = applicationToParams(application);

  let success = false;

  try {
    success = await addUser(params);
  } catch (err) {
    if (err instanceof EntryAlreadyExistsError) {
      return NextResponse.json({
        success: false,
        error: "User already exists",
      });
    }

    throw err;
  }

  if (success) {
    await repository.deleteEntry(token);
  }

  const status = success ? statusOk : statusInternalServerError;
  return NextResponse.json({ success }, { status });
};

const applicationToParams = (application: Application): AddUserParams => {
  console.log("applicationToParams: converting application:", application);

  const { loginName, email, passwordHash } = application;
  const params: AddUserParams = {
    loginName,
    email,
    passwd: passwordHash,
  };

  console.log("applicationToParams: output params:", params);

  return params;
};

export const DELETE = async (
  req: NextRequest,
  { params: { token } }: { params: PathParams }
): Promise<NextResponse> => {
  if (typeof token !== "string") {
    console.log({ token });
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
