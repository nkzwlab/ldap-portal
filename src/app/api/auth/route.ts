import { COOKIE_NAME_TOKEN, signToken } from "@/lib/auth";
import { setCookie } from "@/lib/cookie";
import {
  statusInternalServerError,
  statusUnauthorized,
} from "@/lib/http/status";
import { auth } from "@/lib/ldap";
import { NextApiHandler } from "next";
import { NextRequest, NextResponse } from "next/server";

export type ApiLoginParams = {
  loginName: string;
  password: string;
};

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const { loginName, password } = await req.json();
    const authSuccess = await auth(loginName, password);

    if (authSuccess) {
      const token = await signToken(loginName);
      const res = NextResponse.json({ success: true });
      setCookie(res, COOKIE_NAME_TOKEN, token);
      return res;
    } else {
      const err = new Error("invalid userID or password");
      const res = NextResponse.json(err, { status: statusUnauthorized });
      return res;
    }
  } catch (err) {
    console.error("POST /api/auth: An error occured:", err);
    const res = NextResponse.json(err, { status: statusInternalServerError });
    return res;
  }
};
