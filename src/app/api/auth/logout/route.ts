import { COOKIE_NAME_TOKEN, COOKIE_NAME_USERID } from "@/lib/auth/consts";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export type ApiLoginParams = {
  loginName: string;
  password: string;
};

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME_TOKEN);
  cookieStore.delete(COOKIE_NAME_USERID);

  const loginUrl = req.nextUrl.clone();
  loginUrl.pathname = "/login";

  return NextResponse.redirect(loginUrl);
};
