import { getRepository } from "@/lib/database";
import { statusBadRequest, statusNotFound, statusOk } from "@/lib/http";
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

  await repository.deleteApplication(application.loginName);

  return NextResponse.json({ success: true }, { status: statusOk });
};
