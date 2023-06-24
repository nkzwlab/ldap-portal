import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { COOKIE_NAME_TOKEN, HEADER_USERID, verifyToken } from "./lib/auth";
import { statusUnauthorized } from "./lib/http";

export async function middleware(req: NextRequest) {
  const cookie = req.cookies.get(COOKIE_NAME_TOKEN);

  if (typeof cookie === "undefined") {
    return new NextResponse(null, { status: statusUnauthorized });
  }

  const token = cookie.value;

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
