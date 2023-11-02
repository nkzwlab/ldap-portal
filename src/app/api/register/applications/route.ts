import { getRepository } from "@/lib/database/application";
import { NextRequest, NextResponse } from "next/server";

export type ApiRegisterParams = {
  loginName: string;
  email?: string;
  password: string;
};

export const GET = async (_req: NextRequest): Promise<NextResponse> => {
  const repository = await getRepository();
  const applications = repository.getAllEntries();
  return NextResponse.json({ success: true, applications });
};
