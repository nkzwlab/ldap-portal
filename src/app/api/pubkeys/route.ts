import { HEADER_USERID } from "@/lib/auth/consts";
import { statusBadRequest, statusUnauthorized } from "@/lib/http/status";
import * as ldap from "@/lib/ldap";
import { NextRequest, NextResponse } from "next/server";

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
  const userID = req.headers.get(HEADER_USERID);
  if (userID === null) {
    console.error("PUT /api/pubkey: userID not found in header");
    return new NextResponse(null, { status: statusUnauthorized });
  }

  const { pubkeys } = await req.json();
  if (!Array.isArray(pubkeys)) {
    return NextResponse.json(
      { error: "invalid pubkeys: " + pubkeys },
      { status: statusBadRequest }
    );
  }

  // Deduplicate public keys
  const dedupPubkeys = Array.from(new Set(pubkeys));

  await ldap.replacePubkeys(userID, dedupPubkeys);
  return NextResponse.json({ success: true, pubkeys });
};

export const DELETE = async (req: NextRequest): Promise<NextResponse> => {
  const userID = req.headers.get(HEADER_USERID);
  if (userID === null) {
    console.error("GET /api/pubkey: userID not found in header");
    return new NextResponse(null, { status: statusUnauthorized });
  }

  const { pubkey } = await req.json();
  if (typeof pubkey !== "string") {
    return NextResponse.json(
      { error: "invalid pubkey: " + pubkey },
      { status: statusBadRequest }
    );
  }

  await ldap.delPubkey(userID, pubkey);
  return NextResponse.json({ success: true, pubkey });
};
