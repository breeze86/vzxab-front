import { NextRequest, NextResponse } from "next/server";
import { getAdminFromRequest } from "@/lib/adminSession";

export async function GET(request: NextRequest) {
  const admin = await getAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ authenticated: false });
  }

  return NextResponse.json({
    authenticated: true,
    admin: {
      id: admin.id,
      username: admin.username,
      displayName: admin.displayName,
    },
  });
}
