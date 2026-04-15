import { COOKIE_NAME_TOKEN, COOKIE_NAME_USERID } from "@/lib/auth/consts";
import { addTokenToBlacklist } from "@/lib/auth/tokenBlacklist";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  const cookieStore = await cookies();

  const token = cookieStore.get(COOKIE_NAME_TOKEN)?.value;
  if (token) {
    await addTokenToBlacklist(token);
  }

  cookieStore.delete(COOKIE_NAME_TOKEN);
  cookieStore.delete(COOKIE_NAME_USERID);

  return new NextResponse(null, { status: 200 });
};
