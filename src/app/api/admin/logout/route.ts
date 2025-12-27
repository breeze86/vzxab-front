import { NextRequest, NextResponse } from "next/server";
import { getTokenFromRequest, revokeAdminSession } from "@/lib/adminSession";

export async function POST(request: NextRequest) {
  const token = getTokenFromRequest(request) ?? undefined;
  await revokeAdminSession(token);

  return NextResponse.json({ ok: true });
}
