import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, revokeAdminSession } from "@/lib/adminSession";

const isCookieSecure =
  process.env.COOKIE_SECURE?.toLowerCase() === "true" ||
  (process.env.COOKIE_SECURE === undefined &&
    process.env.NODE_ENV === "production");

export async function POST(request: NextRequest) {
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  await revokeAdminSession(token);

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: isCookieSecure,
    expires: new Date(0),
    path: "/",
  });

  return response;
}
