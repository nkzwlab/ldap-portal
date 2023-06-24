import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { parseBearer, verifyToken } from "./lib/auth";
import { statusUnauthorized } from "./lib/http";

export const HEADER_USERID = "X-User-Id";

export async function middleware(req: NextRequest) {
  const authorization = req.headers.get("Authorization");

  if (authorization == null) {
    return new NextResponse(null, { status: statusUnauthorized });
  }

  const token = parseBearer(authorization);

  if (token == null) {
    const err = new Error("Unauthorized");
    return new NextResponse(null, { status: statusUnauthorized });
  }

  try {
    const { userID } = await verifyToken(token);
    const headers = new Headers(req.headers);
    headers.set(HEADER_USERID, userID);

    return NextResponse.next({
      headers,
    });
  } catch (e) {
    console.error(`Unauthorized: ${e}`);
    return new NextResponse(null, { status: statusUnauthorized });
  }
}

export const config = {
  matcher: "/api/:path*",
};
