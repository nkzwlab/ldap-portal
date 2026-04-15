import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { Payload, verifyToken } from "./lib/auth/auth";
import { COOKIE_NAME_TOKEN, HEADER_USERID } from "./lib/auth/consts";

// In-memory rate limiter (per-instance; suitable for single-server deployments).
// Key: "<ip>:<path-group>", Value: { count, resetAt timestamp }
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(
  key: string,
  maxRequests: number,
  windowMs: number
): boolean {
  const now = Date.now();

  // Evict expired entries to prevent unbounded memory growth
  if (rateLimitStore.size > 2000) {
    for (const [k, v] of rateLimitStore.entries()) {
      if (now > v.resetAt) rateLimitStore.delete(k);
    }
  }

  const entry = rateLimitStore.get(key);
  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }
  if (entry.count >= maxRequests) return true;
  entry.count++;
  return false;
}

const unauthenticatedPaths = [
  "/_next/",
  "/favicon.ico",
  "/nakazawa-okoshi-lab-logo.png",
  "/api/auth",
  "/api/register",
  "/api/register/approval/",
  "/login",
  "/register",
  "/slack/interactive",
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

export async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  // Rate limit: login — 10 attempts per 15 min
  if (path === "/api/auth" && req.method === "POST") {
    if (isRateLimited(`login:${ip}`, 10, 15 * 60 * 1000)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }
  }

  // Rate limit: registration — 5 attempts per hour
  if (path === "/api/register" && req.method === "POST") {
    if (isRateLimited(`register:${ip}`, 5, 60 * 60 * 1000)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }
  }

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

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
