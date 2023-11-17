import { statusBadRequest, statusUnauthorized } from "@/lib/http/status";
import { NextRequest, NextResponse } from "next/server";

import * as ldap from "@/lib/ldap";
import { HEADER_USERID } from "@/lib/auth/consts";

export type ApiPasswordPutParams = {
  password: string;
  newPassword: string;
};

export const PUT = async (req: NextRequest): Promise<NextResponse> => {
  const userID = req.headers.get(HEADER_USERID);
  if (userID === null) {
    console.error("GET /api/password: userID not found in header");
    return new NextResponse(null, { status: statusUnauthorized });
  }

  const { password, newPassword } = (await req.json()) as ApiPasswordPutParams;

  if (typeof password !== "string" || typeof newPassword !== "string") {
    return NextResponse.json(
      { error: "invalid password or new password" },
      { status: statusBadRequest }
    );
  }

  let success = false;
  try {
    success = await ldap.changePassword(userID, password, newPassword);
  } catch (e) {
    return NextResponse.json({
      success: false,
      error: (e as any)?.message ?? "Unexpected LDAP error",
    });
  }

  return NextResponse.json({ success });
};
