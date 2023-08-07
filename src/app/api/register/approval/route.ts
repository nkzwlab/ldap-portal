import { Application, getRepository } from "@/lib/database/application";
import {
  statusBadRequest,
  statusInternalServerError,
  statusNotFound,
  statusOk,
} from "@/lib/http";
import { AddUserParams, addUser } from "@/lib/ldap";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  const { token } = await req.json();

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

  const params: AddUserParams = applicationToParams(application);

  await repository.deleteEntry(application.loginName);
  const success = await addUser(params);
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
