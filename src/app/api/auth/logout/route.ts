import { COOKIE_NAME_TOKEN, COOKIE_NAME_USERID } from "@/lib/auth/consts";
import { setCookie } from "@/lib/cookie";
import {
  statusInternalServerError,
  statusUnauthorized,
} from "@/lib/http/status";
import { auth } from "@/lib/ldap";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export type ApiLoginParams = {
  loginName: string;
  password: string;
};

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  cookies().delete(COOKIE_NAME_TOKEN);
  cookies().delete(COOKIE_NAME_USERID);

  const loginUrl = req.nextUrl.clone();
  loginUrl.pathname = "/login";

  return NextResponse.redirect(loginUrl);
};
