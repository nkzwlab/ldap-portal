import { statusBadRequest, statusUnauthorized } from "@/lib/http/status";
import { NextRequest, NextResponse } from "next/server";

import * as ldap from "@/lib/ldap";
import { HEADER_USERID } from "@/lib/auth/consts";
import { isCurrentSessionBlacklisted } from "@/lib/auth/tokenBlacklist";
import { newPasswordSchema, passwordSchema } from "@/lib/schemas";
import * as z from "zod";

export type ApiPasswordPutParams = {
  password: string;
  newPassword: string;
};

const passwordChangeSchema = z.object({
  password: passwordSchema,
  newPassword: newPasswordSchema,
});

export const PUT = async (req: NextRequest): Promise<NextResponse> => {
  if (await isCurrentSessionBlacklisted()) {
    return new NextResponse(null, { status: statusUnauthorized });
  }

  const userID = req.headers.get(HEADER_USERID);
  if (userID === null) {
    console.error("GET /api/password: userID not found in header");
    return new NextResponse(null, { status: statusUnauthorized });
  }

  const body = await req.json();
  const parsed = passwordChangeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input" },
      { status: statusBadRequest }
    );
  }
  const { password, newPassword } = parsed.data;

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
