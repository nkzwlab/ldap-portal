import { HEADER_USERID } from "@/lib/auth/consts";
import { isCurrentSessionBlacklisted } from "@/lib/auth/tokenBlacklist";
import { statusBadRequest, statusUnauthorized } from "@/lib/http/status";
import * as ldap from "@/lib/ldap";
import { NextRequest, NextResponse } from "next/server";
import * as z from "zod";

const pubkeysSchema = z.object({
  pubkeys: z.array(z.string().min(1).max(4096)),
});

const pubkeySchema = z.object({
  pubkey: z.string().min(1).max(4096),
});

export type ApiGetPubkeysResponse = {
  success: boolean;
  pubkeys: string[];
};

export const GET = async (
  req: NextRequest
): Promise<NextResponse<ApiGetPubkeysResponse>> => {
  const userID = req.headers.get(HEADER_USERID);
  if (userID === null) {
    console.error("GET /api/pubkeys: userID not found in header");
    return new NextResponse(null, { status: statusUnauthorized });
  }

  const pubkeys = await ldap.getPubkey(userID);
  return NextResponse.json({ success: true, pubkeys });
};

export const PUT = async (req: NextRequest): Promise<NextResponse> => {
  if (await isCurrentSessionBlacklisted()) {
    return new NextResponse(null, { status: statusUnauthorized });
  }

  const userID = req.headers.get(HEADER_USERID);
  if (userID === null) {
    console.error("PUT /api/pubkey: userID not found in header");
    return new NextResponse(null, { status: statusUnauthorized });
  }

  const parsed = pubkeysSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input" },
      { status: statusBadRequest }
    );
  }

  // Deduplicate public keys
  const dedupPubkeys = Array.from(new Set(parsed.data.pubkeys));

  await ldap.replacePubkeys(userID, dedupPubkeys);
  return NextResponse.json({ success: true, pubkeys });
};

export const DELETE = async (req: NextRequest): Promise<NextResponse> => {
  if (await isCurrentSessionBlacklisted()) {
    return new NextResponse(null, { status: statusUnauthorized });
  }

  const userID = req.headers.get(HEADER_USERID);
  if (userID === null) {
    console.error("GET /api/pubkey: userID not found in header");
    return new NextResponse(null, { status: statusUnauthorized });
  }

  const parsed = pubkeySchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input" },
      { status: statusBadRequest }
    );
  }

  await ldap.delPubkey(userID, parsed.data.pubkey);
  return NextResponse.json({ success: true, pubkey: parsed.data.pubkey });
};
