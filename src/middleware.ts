import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import {
  COOKIE_NAME_TOKEN,
  HEADER_USERID,
  Payload,
  verifyToken,
} from "./lib/auth";
import { statusUnauthorized } from "./lib/http";
import Login from "./app/login/page";
import { isUserInGroup } from "./lib/ldap";
import { env } from "./lib/env";

const unauthenticatedPaths = [
  "/_next/",
  "/favicon.ico",
  "/api/auth",
  "/api/register",
  "/login",
  "/register",
];

const adminAuthorizedPaths = [
  "/api/register/applications",
  "/register/approve",
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

const isAdminAuthorizedPath = (path: string) =>
  pathMatches(adminAuthorizedPaths, path);

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

  if (isAdminAuthorizedPath(path)) {
    const { adminGroup } = env;
    const authorezied = await isUserInGroup(userID, adminGroup);

    if (!authorezied) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: statusUnauthorized }
      );
    }
  }

  const headers = new Headers(req.headers);
  headers.set(HEADER_USERID, userID);

  return NextResponse.next({
    headers,
  });
}
