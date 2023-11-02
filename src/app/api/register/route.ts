import { SSHA, generateToken } from "@/lib/crypto";
import { Application, getRepository } from "@/lib/database/application";
import { statusBadRequest, statusOk, statusUnauthorized } from "@/lib/http";
import { removeUndefinedProperty } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export type ApiRegisterParams = {
  loginName: string;
  email?: string;
  password: string;
};

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  const { loginName, email, password } = await req.json();

  if (typeof loginName !== "string" || typeof password !== "string") {
    return NextResponse.json(
      { error: "invalid loginName or email or password" },
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

  const repository = await getRepository();
  await repository.addEntry(token, applicationWithoutUndefined);

  return NextResponse.json({ success: true }, { status: statusOk });
};
