import { statusBadRequest, statusUnauthorized } from "@/lib/http";
import { NextRequest, NextResponse } from "next/server";

import * as ldap from "@/lib/ldap";
import { HEADER_USERID } from "@/lib/auth";

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  const userID = req.headers.get(HEADER_USERID);
  if (userID === null) {
    console.error("GET /api/shell: userID not found in header");
    return new NextResponse(null, { status: statusUnauthorized });
  }

  const { password, newPassword } = await req.json();

  if (typeof password !== "string" || typeof newPassword !== "string") {
    return NextResponse.json(
      { error: "invalid password or new password" },
      { status: statusBadRequest }
    );
  }

  const ok = await ldap.changePassword(userID, password, newPassword);
  return NextResponse.json({ ok });
};
