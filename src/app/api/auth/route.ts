import { COOKIE_NAME_TOKEN, signToken } from "@/lib/auth";
import { setCookie } from "@/lib/cookie";
import { statusInternalServerError, statusUnauthorized } from "@/lib/http";
import { NextApiHandler } from "next";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const { userID, password } = await req.json();
    const authed = await lib.ldap.auth(userID, password);

    if (authed) {
      const token = await signToken(userID);
      const res = NextResponse.json({ ok: true });
      setCookie(res, COOKIE_NAME_TOKEN, token);
      return res;
    } else {
      const err = new Error("invalid userID or password");
      const res = NextResponse.json(err, { status: statusUnauthorized });
      return res;
    }
  } catch (err) {
    const res = NextResponse.json(err, { status: statusInternalServerError });
    return res;
  }
};
