import { HEADER_USERID } from "@/lib/auth/consts";
import { isCurrentSessionBlacklisted } from "@/lib/auth/tokenBlacklist";
import { statusBadRequest, statusUnauthorized } from "@/lib/http/status";
import * as ldap from "@/lib/ldap";
import { shells } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";
import * as z from "zod";

const shellSchema = z.object({
  shell: z.enum(shells),
});

export const GET = async (req: NextRequest): Promise<NextResponse> => {
  const userID = req.headers.get(HEADER_USERID);
  if (userID === null) {
    console.error("GET /api/shell: userID not found in header");
    return new NextResponse(null, { status: statusUnauthorized });
  }

  const shells = await ldap.getShell(userID);
  const shell = shells.length > 0 ? shells[0] : null;
  return NextResponse.json({ success: true, shell });
};

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  if (await isCurrentSessionBlacklisted()) {
    return new NextResponse(null, { status: statusUnauthorized });
  }

  const userID = req.headers.get(HEADER_USERID);
  if (userID === null) {
    console.error("GET /api/shell: userID not found in header");
    return new NextResponse(null, { status: statusUnauthorized });
  }

  const parsed = shellSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input" },
      { status: statusBadRequest }
    );
  }

  await ldap.setShell(userID, parsed.data.shell);
  return NextResponse.json({ success: true, shell: parsed.data.shell });
};
