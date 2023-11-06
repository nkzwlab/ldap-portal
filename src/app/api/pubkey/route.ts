import { HEADER_USERID } from "@/lib/auth";
import { statusBadRequest, statusUnauthorized } from "@/lib/http";
import * as ldap from "@/lib/ldap";
import { NextRequest, NextResponse } from "next/server";

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
  const userID = req.headers.get(HEADER_USERID);
  if (userID === null) {
    console.error("GET /api/shell: userID not found in header");
    return new NextResponse(null, { status: statusUnauthorized });
  }

  const { shell } = await req.json();
  if (typeof shell !== "string" || shell === "") {
    return NextResponse.json(
      { error: "invalid shell: " + shell },
      { status: statusBadRequest }
    );
  }

  await ldap.setShell(userID, shell);
  return NextResponse.json({ success: true, shell });
};
