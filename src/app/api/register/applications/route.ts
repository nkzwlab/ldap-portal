import { HEADER_USERID } from "@/lib/auth/consts";
import { getRepository } from "@/lib/database/application";
import { env } from "@/lib/env";
import { statusUnauthorized } from "@/lib/http/status";
import { isUserInGroup } from "@/lib/ldap";
import { NextRequest, NextResponse } from "next/server";

export type ApiRegisterParams = {
  loginName: string;
  email?: string;
  password: string;
};

export const GET = async (req: NextRequest): Promise<NextResponse> => {
  const userID = req.headers.get(HEADER_USERID);

  if (userID === null) {
    console.error("GET /api/register/applications: userID not found in header");
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: statusUnauthorized }
    );
  }

  const { adminGroup } = env;
  const authorezied = await isUserInGroup(userID, adminGroup);

  if (!authorezied) {
    console.error(
      `GET /api/register/applications: "${userID}" is not in the admin group`
    );
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: statusUnauthorized }
    );
  }

  const repository = await getRepository();
  const applications = await repository.getAllEntries();
  console.log("GET /api/register/applications:", { applications });

  return NextResponse.json({ success: true, applications });
};
