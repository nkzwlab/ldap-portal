import { signToken } from "@/lib/auth/auth";
import { COOKIE_NAME_TOKEN, COOKIE_NAME_USERID } from "@/lib/auth/consts";
import { setCookie } from "@/lib/cookie";
import {
  statusBadRequest,
  statusInternalServerError,
  statusUnauthorized,
} from "@/lib/http/status";
import { auth } from "@/lib/ldap";
import { loginNameSchema, passwordSchema } from "@/lib/schemas";
import { NextRequest, NextResponse } from "next/server";
import * as z from "zod";

export type ApiLoginParams = {
  loginName: string;
  password: string;
};

const loginSchema = z.object({
  loginName: loginNameSchema,
  password: passwordSchema,
});

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input" },
        { status: statusBadRequest }
      );
    }
    const { loginName, password } = parsed.data;
    const authSuccess = await auth(loginName, password);

    if (authSuccess) {
      const token = await signToken(loginName);
      const res = NextResponse.json({ success: true });
      setCookie(res, COOKIE_NAME_TOKEN, token);
      setCookie(res, COOKIE_NAME_USERID, loginName, { httpOnly: false });
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
