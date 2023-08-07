import { SSHA, generateToken } from "@/lib/crypto";
import { Application, getRepository } from "@/lib/database/application";
import { statusBadRequest, statusOk, statusUnauthorized } from "@/lib/http";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  const { loginName, email, password } = await req.json();

  if (
    typeof loginName !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
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

  const repository = await getRepository();
  await repository.addEntry(loginName, application);

  return NextResponse.json({ success: true }, { status: statusOk });
};
