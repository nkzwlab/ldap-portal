import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { COOKIE_NAME_TOKEN, HEADER_USERID, verifyToken } from "./lib/auth";
import { statusUnauthorized } from "./lib/http";
import Login from "./app/login/page";

const unauthenticatedPaths = [
  "/_next",
  "/favicon.ico",
  "/api/auth",
  "/login",
  "/register",
];

const isUnauthenticatedPath = (path: string): boolean => {
  const isUnauthenticated = unauthenticatedPaths.reduce(
    (prev, curr) => prev || path.startsWith(curr),
    false
  );

  return isUnauthenticated;
};

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  if (isUnauthenticatedPath(path)) {
    return NextResponse.next();
  }

  const loginUrl = req.nextUrl.clone();
  loginUrl.pathname = "/login";

  const cookie = req.cookies.get(COOKIE_NAME_TOKEN);

  if (typeof cookie === "undefined") {
    return NextResponse.redirect(loginUrl);
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
    return NextResponse.redirect(loginUrl);
  }
}
