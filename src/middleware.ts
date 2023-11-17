import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { Payload, verifyToken } from "./lib/auth/auth";
import { COOKIE_NAME_TOKEN, HEADER_USERID } from "./lib/auth/consts";

const unauthenticatedPaths = [
  "/_next/",
  "/favicon.ico",
  "/api/auth",
  "/api/register",
  "/api/register/approval/",
  "/login",
  "/register",
  "/slack/events",
];

const pathMatches = (paths: string[], targetPath: string): boolean => {
  for (const p of paths) {
    const matches = p === targetPath;
    const nestedMatches = p.endsWith("/") && targetPath.startsWith(p);

    if (matches || nestedMatches) {
      return true;
    }
  }

  return false;
};

const isUnauthenticatedPath = (path: string) =>
  pathMatches(unauthenticatedPaths, path);

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

  let payload: Payload;

  try {
    payload = await verifyToken(token);
  } catch (e) {
    console.error(`Unauthorized: ${e}`);
    return NextResponse.redirect(loginUrl);
  }

  const { userID } = payload;

  const headers = new Headers(req.headers);
  headers.set(HEADER_USERID, userID);

  return NextResponse.next({
    headers,
  });
}
