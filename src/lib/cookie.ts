import { serialize } from "cookie";
import { NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import { env } from "./env";

export const HEADER_SET_COOKIE = "Set-Cookie";

export type SetCookieOptions = {
  httpOnly?: boolean;
};

export const setCookie = (
  res: NextResponse | NextApiResponse,
  name: string,
  value: string,
  { httpOnly = true }: SetCookieOptions = {}
): void => {
  const serialized = serialize(name, value, {
    httpOnly,
    secure: env.isProduction,
    path: "/",
  });

  if (res instanceof NextResponse) {
    res.headers.append(HEADER_SET_COOKIE, serialized);
  } else {
    res.setHeader(name, serialized);
  }
};
