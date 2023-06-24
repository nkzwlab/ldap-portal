import { serialize } from "cookie";
import { NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

export const HEADER_SET_COOKIE = "Set-Cookie";

export const setCookie = (
  res: NextResponse | NextApiResponse,
  name: string,
  value: string
): void => {
  const serialized = serialize(name, value, {
    httpOnly: true,
    secure: true,
    path: "/",
  });

  if (res instanceof NextResponse) {
    res.headers.set(HEADER_SET_COOKIE, serialized);
  } else {
    res.setHeader(name, serialized);
  }
};
