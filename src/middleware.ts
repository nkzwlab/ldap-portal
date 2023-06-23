import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt_decode from "jwt-decode";

import { parseBearer } from "./lib/auth";
import { statusUnauthorized } from "./lib/http";

export function middleware(req: NextRequest) {
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
    const { userID } = jwt_decode(token, config.secret);
    req.userID = userID;
    return next();
  } catch (_) {
    const err = new Error("Invalid token");
    err.status = 400;
    return next(err);
  }
}

export const config = {
  matcher: "/api/:path*",
};
